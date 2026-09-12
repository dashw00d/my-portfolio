import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Loader2, MessageCircleQuestion, Pencil, RefreshCw, Send, Undo2 } from "lucide-react";

import { PROPOSAL_CONFIG as config } from "@/lib/proposal/config";
import type { DoodleStroke, FeedbackStatus, PreviewPin, ProposalState, SharedSelections } from "@/lib/proposal/types";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const emptySelections: SharedSelections = {
  baseSelected: true,
  oneTimeOptionIds: [],
  recurringOptionIds: [],
  sectionFeedback: {},
  displayName: "",
  updatedAt: new Date(0).toISOString(),
};

const emptyState: ProposalState = {
  selections: emptySelections,
  threads: [],
  pins: [],
  doodles: [],
};

const statusLabels: Record<FeedbackStatus, string> = {
  interested: "Interested",
  question: "Question",
  maybe_later: "Maybe later",
};

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

export default function SouthernStarProposalPage() {
  const [state, setState] = useState<ProposalState>(emptyState);
  const [revision, setRevision] = useState(1);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [tool, setTool] = useState<"pin" | "draw" | "none">("none");
  const [draftStroke, setDraftStroke] = useState<Array<{ x: number; y: number }>>([]);
  const [previewToken, setPreviewToken] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") || "default-client-token";
    setPreviewToken(token);
    let cancelled = false;
    fetch(`/proposal/api.php?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("This proposal link is not available.");
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        setState({ ...emptyState, ...data.state });
        setRevision(data.revision ?? 1);
      })
      .catch(() => {
        if (!cancelled) {
          setSaveStatus("error");
          setSaveMessage("Could not load the shared proposal. Your local changes will still be kept.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!previewToken) return;
    const timer = window.setTimeout(() => {
      void saveState(state);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [state, previewToken]);

  const totals = useMemo(() => {
    const selectedOneTime = config.oneTimeOptions.filter((option) => state.selections.oneTimeOptionIds.includes(option.id));
    const oneTime = (state.selections.baseSelected ? config.baseOption.price : 0) + selectedOneTime.reduce((sum, option) => sum + option.price, 0);
    const recurring = config.recurringOptions
      .filter((option) => state.selections.recurringOptionIds.includes(option.id))
      .reduce((sum, option) => sum + option.price, 0);
    return { oneTime, recurring };
  }, [state.selections]);

  async function saveState(nextState: ProposalState) {
    setSaveStatus("saving");
    try {
      const response = await fetch(`/proposal/api.php?token=${encodeURIComponent(previewToken)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revision, state: nextState }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error ?? "Unable to save.");
      setState(nextState);
      setRevision(result.revision ?? revision + 1);
      setSaveStatus("saved");
      setSaveMessage("Saved");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Could not save. Retry in a moment.");
    }
  }

  function updateSelections(updater: (previous: SharedSelections) => SharedSelections) {
    setState((previous) => ({ ...previous, selections: updater(previous.selections) }));
    setSaveStatus("saving");
  }

  function setSectionFeedback(sectionId: string, patch: Partial<{ comment: string; status: FeedbackStatus | "" }>) {
    updateSelections((previous) => ({
      ...previous,
      sectionFeedback: {
        ...previous.sectionFeedback,
        [sectionId]: {
          comment: previous.sectionFeedback[sectionId]?.comment ?? "",
          status: previous.sectionFeedback[sectionId]?.status ?? "",
          ...patch,
        },
      },
    }));
  }

  function toggleArrayItem(ids: string[], id: string, selected: boolean) {
    return selected ? Array.from(new Set([...ids, id])) : ids.filter((item) => item !== id);
  }

  async function submitFeedback() {
    setSubmitStatus("sending");
    await saveState(state);
    try {
      const response = await fetch(`/proposal/api.php?token=${encodeURIComponent(previewToken)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: state.selections.displayName }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error ?? "Unable to send feedback.");
      setSubmitStatus("sent");
    } catch {
      setSubmitStatus("error");
    }
  }

  function previewPosition(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }

  function handlePreviewPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (tool === "none" || state.selections.baseSelected === undefined) return;
    const point = previewPosition(event);
    event.currentTarget.setPointerCapture(event.pointerId);
    if (tool === "pin") {
      setState((previous) => ({
        ...previous,
        pins: [...previous.pins, { id: `pin-${Date.now()}`, number: previous.pins.length + 1, ...point, createdAt: new Date().toISOString() }],
      }));
      setTool("none");
    } else if (tool === "draw") {
      setDraftStroke([point]);
    }
  }

  function handlePreviewPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (tool !== "draw" || draftStroke.length === 0) return;
    const point = previewPosition(event);
    setDraftStroke((previous) => [...previous, point]);
  }

  function handlePreviewPointerUp() {
    if (tool !== "draw" || draftStroke.length < 2) {
      setDraftStroke([]);
      return;
    }
    const stroke: DoodleStroke = { id: `stroke-${Date.now()}`, points: draftStroke, createdAt: new Date().toISOString() };
    setState((previous) => ({ ...previous, doodles: [...previous.doodles, stroke] }));
    setDraftStroke([]);
  }

  function undoLastMark() {
    setState((previous) => {
      if (previous.doodles.length > 0) {
        return { ...previous, doodles: previous.doodles.slice(0, -1) };
      }
      return { ...previous, pins: previous.pins.slice(0, -1) };
    });
  }

  function copyLink() {
    const url = `${window.location.origin}/p/southern-star/?token=${encodeURIComponent(previewToken)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  }

  const oneTimeSelected = config.oneTimeOptions.filter((option) => state.selections.oneTimeOptionIds.includes(option.id));
  const recurringSelected = config.recurringOptions.filter((option) => state.selections.recurringOptionIds.includes(option.id));

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-brand-50/30 to-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
        <header className="rounded-3xl border border-brand-200 bg-white/85 p-7 shadow-xl shadow-brand-950/5 backdrop-blur sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Private proposal</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl">{config.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-600">{config.introduction}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <label htmlFor="displayName" className="text-sm font-semibold text-zinc-700">Your first name</label>
            <input
              id="displayName"
              value={state.selections.displayName}
              onChange={(event) => updateSelections((previous) => ({ ...previous, displayName: event.target.value }))}
              placeholder="Erica or Taylor"
              className="w-44 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <article className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">The core rebuild</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">{config.baseOption.summary}</p>
                </div>
                <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={state.selections.baseSelected}
                    onChange={(event) => updateSelections((previous) => ({ ...previous, baseSelected: event.target.checked }))}
                    className="h-5 w-5 accent-brand-600"
                  />
                  Included
                </label>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {config.sections.map((section) => {
                  const feedback = state.selections.sectionFeedback[section.id] ?? { comment: "", status: "" as FeedbackStatus | "" };
                  return (
                    <div key={section.id} className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5">
                      <h3 className="text-lg font-semibold text-zinc-900">{section.title}</h3>
                      <p className="mt-1 text-sm text-zinc-600">{section.summary}</p>
                      <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2"><Check className="mt-1 h-4 w-4 flex-none text-success-600" /><span>{bullet}</span></li>
                        ))}
                      </ul>
                      <textarea
                        value={feedback.comment}
                        onChange={(event) => setSectionFeedback(section.id, { comment: event.target.value })}
                        placeholder="Add a question or note"
                        rows={3}
                        className="mt-4 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setSectionFeedback(section.id, { status: feedback.status === value ? "" : value as FeedbackStatus })}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                              feedback.status === value
                                ? "border-brand-500 bg-brand-500 text-white"
                                : "border-zinc-300 bg-white text-zinc-600 hover:border-brand-300"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-zinc-900">Optional upgrades</h2>
              <p className="mt-2 text-sm text-zinc-600">These are separate from the base rebuild. Check anything you'd like to discuss.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {config.oneTimeOptions.map((option) => {
                  const selected = state.selections.oneTimeOptionIds.includes(option.id);
                  return (
                    <label key={option.id} className={`flex h-full cursor-pointer flex-col rounded-2xl border p-5 transition ${selected ? "border-brand-500 bg-brand-50/80 shadow-md" : "border-zinc-200 bg-white hover:border-brand-300"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{option.effort}</p>
                          <h3 className="mt-2 text-lg font-semibold text-zinc-900">{option.label}</h3>
                        </div>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) => updateSelections((previous) => ({ ...previous, oneTimeOptionIds: toggleArrayItem(previous.oneTimeOptionIds, option.id, event.target.checked) }))}
                          className="mt-1 h-5 w-5 flex-none accent-brand-600"
                        />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{option.summary}</p>
                      <ul className="mt-4 space-y-1.5 text-xs text-zinc-600">
                        {option.includes.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                      <p className="mt-5 text-xl font-bold text-zinc-900">{formatMoney(option.price)}</p>
                    </label>
                  );
                })}
              </div>
            </article>

            <article className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/80 p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Mark up the preview</h2>
                  <p className="mt-1 text-sm text-zinc-600">{config.previewCaption}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setTool(tool === "pin" ? "none" : "pin")} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tool === "pin" ? "bg-brand-600 text-white" : "border border-zinc-300 bg-white text-zinc-700"}`}>
                    <MessageCircleQuestion className="mr-2 inline h-4 w-4" />Pin note
                  </button>
                  <button type="button" onClick={() => setTool(tool === "draw" ? "none" : "draw")} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tool === "draw" ? "bg-brand-600 text-white" : "border border-zinc-300 bg-white text-zinc-700"}`}>
                    <Pencil className="mr-2 inline h-4 w-4" />Draw
                  </button>
                  <button type="button" onClick={undoLastMark} className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700"><Undo2 className="mr-2 inline h-4 w-4" />Undo</button>
                </div>
              </div>
              <div
                className="relative mt-5 aspect-[3/2] w-full cursor-crosshair overflow-hidden rounded-2xl border border-zinc-300 bg-white"
                onPointerDown={handlePreviewPointerDown}
                onPointerMove={handlePreviewPointerMove}
                onPointerUp={handlePreviewPointerUp}
              >
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-zinc-50 to-brand-50 text-center">
                  <div className="px-6">
                    <p className="text-sm font-semibold text-zinc-500">Preview placeholder</p>
                    <p className="mt-2 max-w-md text-sm text-zinc-500">{config.previewCaption}</p>
                  </div>
                </div>
                {state.pins.map((pin) => (
                  <div key={pin.id} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-lg">{pin.number}</span>
                  </div>
                ))}
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 667">
                  {state.doodles.map((doodle) => (
                    <polyline
                      key={doodle.id}
                      points={doodle.points.map((point) => `${point.x * 1000},${point.y * 667}`).join(" ")}
                      fill="none"
                      stroke="#036564"
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                  ))}
                  {draftStroke.length > 1 && (
                    <polyline
                      points={draftStroke.map((point) => `${point.x * 1000},${point.y * 667}`).join(" ")}
                      fill="none"
                      stroke="#43ABA7"
                      strokeWidth={3}
                    />
                  )}
                </svg>
              </div>
            </article>
          </div>

          <aside className="h-fit space-y-6 lg:sticky lg:top-8">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-zinc-900">Running total</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3 font-semibold text-brand-900">
                  <span>Core rebuild</span>
                  <span>{state.selections.baseSelected ? formatMoney(config.baseOption.price) : "Off"}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600"><span>One-time extras</span><span>{formatMoney(oneTimeSelected.reduce((sum, option) => sum + option.price, 0))}</span></div>
                <div className="flex items-center justify-between rounded-xl bg-zinc-100 px-4 py-3 font-bold text-zinc-900"><span>One-time total</span><span>{formatMoney(totals.oneTime)}</span></div>
                <div className="flex items-center justify-between text-zinc-600"><span>Optional monthly</span><span>{formatMoney(recurringSelected.reduce((sum, option) => sum + option.price, 0))}</span></div>
              </div>
              <div className="mt-5 rounded-xl bg-highlight-50 p-4 text-xs text-highlight-800">
                {config.closingNote}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-zinc-900">Ongoing options</h2>
              <div className="mt-4 space-y-3">
                {config.recurringOptions.map((option) => {
                  const selected = state.selections.recurringOptionIds.includes(option.id);
                  return (
                    <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4 text-sm">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(event) => updateSelections((previous) => ({ ...previous, recurringOptionIds: toggleArrayItem(previous.recurringOptionIds, option.id, event.target.checked) }))}
                        className="mt-0.5 h-4 w-4 accent-brand-600"
                      />
                      <span>
                        <span className="block font-semibold text-zinc-900">{option.label}</span>
                        <span className="text-zinc-600">{option.summary}</span>
                        <span className="mt-1 block font-bold text-brand-600">
                          {formatMoney(option.price)} / {option.period === "month" ? "month" : option.period}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-zinc-900">Finish</h2>
              <p className="mt-2 text-sm text-zinc-600">Selections are for discussion, not a payment or binding acceptance.</p>
              <button
                type="button"
                onClick={submitFeedback}
                disabled={submitStatus === "sending"}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
              >
                {submitStatus === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                Send feedback to Ryan
              </button>
              {submitStatus === "sent" && <p className="mt-3 text-sm font-semibold text-success-700">Feedback sent.</p>}
              {submitStatus === "error" && <p className="mt-3 text-sm font-semibold text-danger-700">Could not send. Try again.</p>}
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                {saveStatus === "saving" && <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>}
                {saveStatus === "saved" && <><Check className="h-4 w-4 text-success-600" /> Saved</>}
                {saveStatus === "error" && <><RefreshCw className="h-4 w-4 text-danger-600" /> {saveMessage}</>}
                {saveStatus === "idle" && <>Changes save automatically.</>}
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/60 p-5">
              <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-brand-600">
                <Copy className="h-4 w-4" /> Copy this proposal link
              </button>
              {copied && <p className="mt-2 text-xs text-success-700">Copied.</p>}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
