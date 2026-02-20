#!/usr/bin/env python3
"""Create and publish one dated blog post from yesterday's git activity.

Behavior:
1) Collect all commits from yesterday across git-chronicle tracked repos.
2) If no commits, exit successfully without creating a post.
3) Generate one blog post via OpenRouter model.
4) Write /content/blog/YYYY-MM-DD-<slug>.mdx
5) Commit + push only that new file.

Usage:
  python scripts/publish_yesterday_git_blog.py
  python scripts/publish_yesterday_git_blog.py --date 2026-02-19
  python scripts/publish_yesterday_git_blog.py --model qwen/qwen3-235b-a22b-2507
  python scripts/publish_yesterday_git_blog.py --dry-run
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
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "content" / "blog"
GIT_CHRONICLE_DIR = Path("/home/ryan/tools/git-chronicle")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "qwen/qwen3-235b-a22b-2507"
DEFAULT_AUTHOR = "Ryan Dashwood"
TZ = ZoneInfo("America/Chicago")

# Known label drift in historical repo naming
PROJECT_LABEL_OVERRIDES = {
    "AustinsElite (Next.js)": "AustinsElite (Laravel 12)",
    "AustinsElite (Legacy)": "AustinsElite (Legacy PHP + some Laravel packages)",
}


@dataclass
class Commit:
    sha: str
    date: str
    message: str
    project: str
    repo_path: str


def run(cmd: list[str], cwd: Path | None = None) -> str:
    proc = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Command failed ({proc.returncode}): {' '.join(cmd)}\n{proc.stderr.strip()}")
    return proc.stdout


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


def call_openrouter(prompt: str, model: str, api_key: str, max_tokens: int = 2400) -> str:
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
            "HTTP-Referer": "https://dashwood.net",
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
            if exc.code in (429, 500, 502, 503, 504) and attempt < 5:
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
        # Common model glitch: invalid bare backslashes in long markdown content.
        candidate = re.sub(r"(?<!\\)\\(?![\"\\/bfnrtu])", r"\\\\", candidate)
        return json.loads(candidate)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text[:80] or "untitled"


def yaml_quote(text: str) -> str:
    return text.replace("\\", "\\\\").replace('"', '\\"')


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


def resolve_target_date(raw: str) -> str:
    if raw:
        datetime.strptime(raw, "%Y-%m-%d")
        return raw
    return (datetime.now(TZ).date() - timedelta(days=1)).isoformat()


def load_repos() -> list[tuple[str, str]]:
    sys.path.insert(0, str(GIT_CHRONICLE_DIR))
    try:
        import chronicle  # type: ignore
    except Exception as exc:
        raise RuntimeError(f"Unable to import git-chronicle REPOS: {exc}")

    repos: list[tuple[str, str]] = []
    for repo_path, project_name, _desc in chronicle.REPOS:
        repos.append((repo_path, PROJECT_LABEL_OVERRIDES.get(project_name, project_name)))
    return repos


def collect_commits_for_date(target_date: str) -> list[Commit]:
    repos = load_repos()
    start = f"{target_date}T00:00:00"
    end = f"{target_date}T23:59:59"

    commits: list[Commit] = []
    for repo_path, project_name in repos:
        if not Path(repo_path).is_dir():
            continue

        try:
            out = run(
                [
                    "git",
                    "-C",
                    repo_path,
                    "log",
                    "--no-merges",
                    f"--since={start}",
                    f"--until={end}",
                    "--format=%H|%ai|%s",
                ]
            )
        except Exception:
            continue

        for line in out.splitlines():
            if not line.strip() or "|" not in line:
                continue
            sha, date, message = line.split("|", 2)
            commits.append(
                Commit(
                    sha=sha.strip(),
                    date=date.strip(),
                    message=message.strip(),
                    project=project_name,
                    repo_path=repo_path,
                )
            )

    commits.sort(key=lambda c: c.date)
    return commits


def build_prompt(target_date: str, commits: list[Commit]) -> str:
    by_project = Counter(c.project for c in commits)

    project_lines = [f"- {name}: {count} commits" for name, count in by_project.most_common()]

    commit_lines = []
    for c in commits[:120]:
        sha8 = c.sha[:8]
        commit_lines.append(f"- [{c.project}] {c.message} ({sha8})")

    stack_note = (
        "Stack corrections (authoritative):\n"
        "- AustinsElite (Legacy) = legacy PHP app with some Laravel packages; not Next.js.\n"
        "- AustinsElite primary production app = Laravel 12 (historical \"Next.js\" label is stale).\n"
        "- Mention Next.js only when describing specific frontend modules/routes, not the primary backend stack."
    )

    return f"""Write ONE daily engineering recap blog post for {target_date}.

CONTEXT:
- This post should summarize all git activity from that date.
- Audience: technical readers following real build-in-public progress.

ACTIVITY SUMMARY:
- Total commits: {len(commits)}
- Projects touched: {len(by_project)}

COMMITS BY PROJECT:
{chr(10).join(project_lines)}

COMMIT LIST:
{chr(10).join(commit_lines)}

{stack_note}

Return STRICT JSON only (no markdown fences, no extra prose):
{{
  "title": "",
  "excerpt": "",
  "tags": ["", "", ""],
  "content": ""
}}

Rules:
- First-person voice, practical and specific.
- 600-1200 words.
- Must include at least 3 markdown section headings (## Heading).
- Ground claims in commits above; do not invent fake work.
- If activity spans multiple projects, structure post with clear sub-sections.
- Excerpt: one sentence, <= 170 chars.
- Tags: 3-6 concise tags.
- Ryan only uses Next.js for this blog project (`my-portfolio` / `dashwood.net`).
- Do NOT use `Next.js` as a tag unless the post is explicitly about this blog project.
- For all other projects, prefer tags like `Laravel`, `Hybrid Architecture`, `Frontend`, `Full-Stack`, `PHP`.
- content must be markdown body only (NO frontmatter).
"""


def existing_post_for_date(target_date: str) -> Path | None:
    matches = sorted(BLOG_DIR.glob(f"{target_date}-*.mdx"))
    return matches[0] if matches else None


def git_commit_and_push(path: Path, target_date: str, dry_run: bool):
    if dry_run:
        print(f"[dry-run] would git add/commit/push: {path}")
        return

    run(["git", "add", str(path)], cwd=ROOT)

    # Commit only this file so unrelated working-tree changes don't get included.
    run(["git", "commit", "-m", f"blog: daily git recap {target_date}", "--", str(path)], cwd=ROOT)
    run(["git", "push"], cwd=ROOT)


def main() -> int:
    parser = argparse.ArgumentParser(description="Publish yesterday's git-activity blog post")
    parser.add_argument("--date", default="", help="Target date YYYY-MM-DD (default: yesterday in America/Chicago)")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--author", default=DEFAULT_AUTHOR)
    parser.add_argument("--overwrite", action="store_true", help="Replace existing post for target date")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    target_date = resolve_target_date(args.date)
    print(f"Target date: {target_date}")

    existing = existing_post_for_date(target_date)
    if existing and not args.overwrite:
        print(f"Post already exists for {target_date}: {existing.name} (skip)")
        return 0

    commits = collect_commits_for_date(target_date)
    print(f"Found {len(commits)} commits on {target_date}")

    if not commits:
        print("No git activity for target date; nothing to publish.")
        return 0

    prompt = build_prompt(target_date, commits)

    if args.dry_run:
        print("[dry-run] Prompt prepared; skipping model call/write/commit/push.")
        return 0

    api_key = load_api_key()
    raw = call_openrouter(prompt, model=args.model, api_key=api_key)
    parsed = parse_json_response(raw)

    title = str(parsed.get("title", "")).strip() or f"Daily engineering recap — {target_date}"
    excerpt = str(parsed.get("excerpt", "")).strip() or title
    content = str(parsed.get("content", "")).strip()
    tags = parsed.get("tags") or []

    if not content:
        raise RuntimeError("Model returned empty content")

    if not isinstance(tags, list):
        tags = []
    tags = [str(t).strip() for t in tags if str(t).strip()][:6]
    if len(tags) < 3:
        tags = (tags + ["engineering", "git", "build-in-public"])[:3]

    BLOG_DIR.mkdir(parents=True, exist_ok=True)

    if existing and args.overwrite:
        existing.unlink(missing_ok=True)

    out_path = BLOG_DIR / f"{target_date}-{slugify(title)}.mdx"
    write_mdx(
        out_path,
        date=target_date,
        title=title,
        excerpt=excerpt,
        tags=tags,
        author=args.author,
        content=content,
    )

    print(f"Wrote {out_path}")
    git_commit_and_push(out_path, target_date=target_date, dry_run=args.dry_run)
    print("Committed and pushed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
