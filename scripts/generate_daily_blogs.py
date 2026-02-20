#!/usr/bin/env python3
"""Generate dated MDX blog posts from git-chronicle daily blog ideas.

Default model: qwen/qwen3-235b-a22b-2507

Examples:
  python scripts/generate_daily_blogs.py --regen-step1 --limit 10
  python scripts/generate_daily_blogs.py --from-date 2026-01-01 --to-date 2026-02-20
  python scripts/generate_daily_blogs.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "content" / "blog"

GIT_CHRONICLE_DIR = Path("/home/ryan/tools/git-chronicle")
DEFAULT_IDEAS_FILE = GIT_CHRONICLE_DIR / "data" / "enhanced" / "daily-blog-ideas.json"

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "qwen/qwen3-235b-a22b-2507"
DEFAULT_AUTHOR = "Ryan Dashwood"

# Authoritative stack corrections for known historical naming drift.
PROJECT_STACK_OVERRIDES: dict[str, str] = {
    "AustinsElite (Legacy)": "Legacy PHP app (custom framework with some Laravel packages), not Next.js.",
    "AustinsElite (Next.js)": "Primary AustinsElite production app on Laravel 12 (historical label is stale), not Next.js.",
}


def load_api_key() -> str:
    key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if key:
        return key

    for env_file in [
        Path("/home/ryan/tools/GhostGraph/.env"),
        Path("/home/ryan/sites/GhostGraph/.env"),
        Path.home() / ".env",
    ]:
        if not env_file.exists():
            continue
        for line in env_file.read_text().splitlines():
            if line.startswith("OPENROUTER_API_KEY="):
                return line.split("=", 1)[1].strip()

    raise RuntimeError("OPENROUTER_API_KEY not found in environment or known .env files")


def call_openrouter(prompt: str, model: str, api_key: str, max_tokens: int = 2600) -> str:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.45,
        "max_tokens": max_tokens,
    }

    req = urllib.request.Request(
        OPENROUTER_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://dashwood.dev",
        },
    )

    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read())
                return data["choices"][0]["message"]["content"].strip()
        except urllib.error.HTTPError as exc:
            body = ""
            try:
                body = exc.read().decode("utf-8", errors="replace")[:400]
            except Exception:
                pass
            if exc.code == 429 and attempt < 5:
                time.sleep(min(30, 2 ** attempt + 2))
                continue
            if exc.code >= 500 and attempt < 5:
                time.sleep(min(30, 2 ** attempt + 2))
                continue
            raise RuntimeError(f"OpenRouter HTTP {exc.code}: {body}")
        except urllib.error.URLError as exc:
            if attempt < 5:
                time.sleep(min(30, 2 ** attempt + 2))
                continue
            raise RuntimeError(f"OpenRouter connection error: {exc}")

    raise RuntimeError("OpenRouter request failed after retries")


def parse_json_response(text: str) -> dict[str, Any]:
    candidate = text.strip()

    if candidate.startswith("```"):
        candidate = re.sub(r"^```(?:json)?", "", candidate).strip()
        candidate = re.sub(r"```$", "", candidate).strip()

    start = candidate.find("{")
    end = candidate.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = candidate[start : end + 1]

    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        # Common model glitch: invalid backslash escapes inside markdown/code blocks.
        candidate = re.sub(r"(?<!\\)\\(?![\"\\/bfnrtu])", r"\\\\", candidate)
        return json.loads(candidate)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text[:80] or "untitled"


def yaml_quote(text: str) -> str:
    return text.replace("\\", "\\\\").replace('"', '\\"')


def existing_posts_by_date() -> dict[str, list[Path]]:
    out: dict[str, list[Path]] = {}
    if not BLOG_DIR.exists():
        return out

    for path in BLOG_DIR.glob("*.mdx"):
        m = re.match(r"^(\d{4}-\d{2}-\d{2})-", path.name)
        if not m:
            continue
        out.setdefault(m.group(1), []).append(path)
    return out


def maybe_regen_step1(args: argparse.Namespace):
    cmd = [
        str(GIT_CHRONICLE_DIR / ".venv" / "bin" / "python"),
        "-u",
        "enhance.py",
        "blog-ideas-daily",
        "--model",
        args.step1_model,
        "--workers",
        str(args.step1_workers),
    ]
    print("Regenerating daily ideas (step 1):", " ".join(cmd))
    subprocess.run(cmd, cwd=GIT_CHRONICLE_DIR, check=True)


def build_stack_hints(day_data: dict[str, Any]) -> str:
    hints: list[str] = []
    for project in day_data.get("projects", [])[:12]:
        correction = PROJECT_STACK_OVERRIDES.get(project)
        if correction:
            hints.append(f"- {project}: {correction}")

    if not hints:
        return "(No project-specific stack overrides.)"

    return "\n".join(hints)


def build_prompt(day: str, day_data: dict[str, Any]) -> str:
    ideas = day_data.get("ideas", [])
    primary = ideas[0] if ideas else {}
    secondary = ideas[1:] if len(ideas) > 1 else []

    projects = ", ".join(day_data.get("projects", [])[:8]) or "Unknown"
    stack_hints = build_stack_hints(day_data)

    primary_json = json.dumps(primary, indent=2)
    secondary_json = json.dumps(secondary, indent=2)

    return f"""Write one polished developer blog post for Ryan Dashwood's portfolio.

DATE: {day}
PROJECTS TOUCHED: {projects}
ANALYZED COMMITS: {day_data.get('commit_count', 0)}

STACK CORRECTIONS (authoritative):
{stack_hints}

PRIMARY IDEA:
{primary_json}

ADDITIONAL IDEAS:
{secondary_json}

Return STRICT JSON only (no markdown fences, no prose outside JSON):
{{
  "title": "",
  "excerpt": "",
  "tags": ["", "", ""],
  "content": ""
}}

Rules:
- First-person voice, practical, builder-focused.
- 500-1100 words.
- Must include at least 3 section headings using Markdown (## Heading).
- Ground claims in the supplied context; do not invent fake projects/events.
- Treat STACK CORRECTIONS as truth even if labels/idea text suggest otherwise.
- If supplied ideas conflict with stack corrections, rewrite them to be technically accurate.
- Keep tone punchy and human (not corporate).
- Excerpt must be 1 sentence, under 170 chars.
- Tags: 3-6 concise tags.
- Ryan only uses Next.js for this blog project (`my-portfolio` / `dashwood.net`).
- Do NOT use `Next.js` as a tag unless the post is explicitly about this blog project.
- For all other projects, prefer tags like `Laravel`, `Hybrid Architecture`, `Frontend`, `Full-Stack`, `PHP`.
- `content` must be markdown body only (NO frontmatter).
"""


def write_mdx(path: Path, date: str, title: str, excerpt: str, tags: list[str], author: str, content: str):
    frontmatter = [
        "---",
        f'title: "{yaml_quote(title)}"',
        f'date: "{date}"',
        f'excerpt: "{yaml_quote(excerpt)}"',
        "tags: [" + ", ".join(f'"{yaml_quote(tag)}"' for tag in tags) + "]",
        f'author: "{yaml_quote(author)}"',
        "---",
        "",
    ]
    body = "\n".join(frontmatter) + content.strip() + "\n"
    path.write_text(body)


def generate_one_post(
    day: str,
    day_data: dict[str, Any],
    args: argparse.Namespace,
    api_key: str,
    existing_for_day: list[Path],
) -> str:
    if args.overwrite and existing_for_day:
        for p in existing_for_day:
            p.unlink(missing_ok=True)

    prompt = build_prompt(day, day_data)
    raw = call_openrouter(prompt, model=args.model, api_key=api_key)
    parsed = parse_json_response(raw)

    title = (parsed.get("title") or "").strip()
    excerpt = (parsed.get("excerpt") or "").strip()
    tags = parsed.get("tags") or []
    content = (parsed.get("content") or "").strip()

    if not title or not content:
        raise RuntimeError("Model returned missing title/content")

    if not isinstance(tags, list):
        tags = []
    tags = [str(t).strip() for t in tags if str(t).strip()][:6]
    if len(tags) < 3:
        tags = (tags + ["engineering", "software", "build-in-public"])[:3]

    slug = slugify(title)
    out_path = BLOG_DIR / f"{day}-{slug}.mdx"
    write_mdx(
        out_path,
        date=day,
        title=title,
        excerpt=excerpt or title,
        tags=tags,
        author=args.author,
        content=content,
    )

    return out_path.name


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate daily MDX blogs from git-chronicle daily ideas")
    parser.add_argument("--ideas-file", default=str(DEFAULT_IDEAS_FILE))
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--author", default=DEFAULT_AUTHOR)
    parser.add_argument("--limit", type=int, default=0, help="Max posts to generate (0 = no limit)")
    parser.add_argument("--from-date", default="", help="Inclusive YYYY-MM-DD")
    parser.add_argument("--to-date", default="", help="Inclusive YYYY-MM-DD")
    parser.add_argument("--overwrite", action="store_true", help="Replace existing posts for same date")
    parser.add_argument("--dry-run", action="store_true", help="Show targets only")
    parser.add_argument("--regen-step1", action="store_true", help="Regenerate daily ideas before writing posts")
    parser.add_argument("--step1-model", default=DEFAULT_MODEL)
    parser.add_argument("--step1-workers", type=int, default=12)
    parser.add_argument("--workers", type=int, default=20, help="Parallel blog generations")
    args = parser.parse_args()

    if args.regen_step1:
        maybe_regen_step1(args)

    ideas_path = Path(args.ideas_file)
    if not ideas_path.exists():
        raise FileNotFoundError(f"Ideas file not found: {ideas_path}")

    data = json.loads(ideas_path.read_text())
    daily = data.get("daily", {})
    if not isinstance(daily, dict) or not daily:
        raise RuntimeError(f"No daily ideas found in: {ideas_path}")

    existing = existing_posts_by_date()

    days = sorted(daily.keys(), reverse=True)  # newest first so interrupted runs still give recent content

    targets: list[tuple[str, dict[str, Any]]] = []
    for day in days:
        if args.from_date and day < args.from_date:
            continue
        if args.to_date and day > args.to_date:
            continue

        day_data = daily[day]
        if day_data.get("error"):
            continue
        if not day_data.get("ideas"):
            continue

        if day in existing and not args.overwrite:
            continue

        targets.append((day, day_data))

    if args.limit and args.limit > 0:
        targets = targets[: args.limit]

    print(f"Daily ideas loaded: {len(daily)}")
    print(f"Existing dated posts: {sum(len(v) for v in existing.values())}")
    print(f"Target posts to generate: {len(targets)}")

    if targets:
        print("First targets:")
        for day, _ in targets[:8]:
            print(" -", day)

    if args.dry_run:
        return 0

    api_key = load_api_key()
    BLOG_DIR.mkdir(parents=True, exist_ok=True)

    created = 0
    failed = 0
    completed = 0

    worker_count = max(1, int(args.workers))
    print(f"Writer model: {args.model} | Parallel workers: {worker_count}")

    with ThreadPoolExecutor(max_workers=worker_count) as pool:
        future_map = {
            pool.submit(
                generate_one_post,
                day,
                day_data,
                args,
                api_key,
                existing.get(day, []),
            ): day
            for day, day_data in targets
        }

        for future in as_completed(future_map):
            day = future_map[future]
            completed += 1
            try:
                out_name = future.result()
                created += 1
                print(f"[{completed}/{len(targets)}] wrote {out_name}")
            except Exception as exc:
                failed += 1
                print(f"[{completed}/{len(targets)}] FAIL {day}: {exc}")

    print(f"\nDone. Created={created}, Failed={failed}, Targeted={len(targets)}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
