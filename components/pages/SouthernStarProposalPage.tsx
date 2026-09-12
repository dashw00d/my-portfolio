import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Loader2, RefreshCw, Send } from "lucide-react";

import { ProposalOptionCard, ProposalRecurringCard, ProposalSectionCard } from "@/components/proposal/ProposalCards";
import { PROPOSAL_CONFIG as config } from "@/lib/proposal/config";
import type { DoodleStroke, FeedbackStatus, ProposalState, SharedSelections } from "@/lib/proposal/types";

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

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

export default function SouthernStarProposalPage() {
  const [state, setState] = useState<ProposalState>(emptyState);
  const revision = useRef(1);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const savedState = useRef<ProposalState | null>(null);
  const latestState = useRef(state);
  latestState.current = state;
  const [editable, setEditable] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [previewToken, setPreviewToken] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") || "";
    let cancelled = false;
    fetch(`/proposal/api.php?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("This proposal link is not available.");
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        const loaded = { ...emptyState, ...data.state };
        savedState.current = loaded;
        setState(loaded);
        revision.current = data.revision ?? 1;
        setEditable(data.status === "active" && !data.isExpired);
        setPreviewToken(token);
      })
      .catch(() => {
        if (!cancelled) {
          setSaveStatus("error");
          setSaveMessage("Could not load the shared proposal. Check your link and refresh.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!previewToken || !editable || state === savedState.current) return;
    const timer = window.setTimeout(() => {
      void saveState(state).catch(() => {});
    }, 700);
    return () => window.clearTimeout(timer);
  }, [state, previewToken, editable]);

  const totals = useMemo(() => {
    const selectedOneTime = config.oneTimeOptions.filter((option) => state.selections.oneTimeOptionIds.includes(option.id));
    const oneTime = (state.selections.baseSelected ? config.baseOption.price : 0) + selectedOneTime.reduce((sum, option) => sum + option.price, 0);
    const recurring = config.recurringOptions
      .filter((option) => state.selections.recurringOptionIds.includes(option.id))
      .reduce((sum, option) => sum + option.price, 0);
    return { oneTime, recurring };
  }, [state.selections]);

  function saveState(nextState: ProposalState): Promise<void> {
    const pending = saveQueue.current.then(async () => {
      if (savedState.current === nextState) return;
      setSaveStatus("saving");
      try {
        const response = await fetch(`/proposal/api.php?token=${encodeURIComponent(previewToken)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: revision.current, state: nextState }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result?.error ?? "Unable to save.");
        revision.current = result.revision;
        savedState.current = nextState;
        setSaveStatus(latestState.current === nextState ? "saved" : "saving");
        setSaveMessage("Saved");
      } catch (error) {
        setSaveStatus("error");
        setSaveMessage(error instanceof Error ? error.message : "Could not save. Retry in a moment.");
        throw error;
      }
    });
    saveQueue.current = pending.catch(() => {});
    return pending;
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
    try {
      await saveState(state);
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

  function addDoodle(stroke: DoodleStroke) {
    if (state.doodles.length >= 80) {
      setSaveStatus("error");
      setSaveMessage("The proposal has 80 marks. Undo a mark before adding another.");
      return;
    }
    setState((previous) => ({ ...previous, doodles: [...previous.doodles, stroke] }));
    setSaveStatus("saving");
  }

  function undoDoodle(targetId: string) {
    setState((previous) => {
      const index = previous.doodles.findLastIndex((stroke) => stroke.targetId === targetId);
      return { ...previous, doodles: previous.doodles.filter((_, position) => position !== index) };
    });
  }

  const markup = { doodles: state.doodles, onDraw: editable ? addDoodle : undefined, onUndo: undoDoodle };

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
              disabled={!editable}
              value={state.selections.displayName}
              onChange={(event) => updateSelections((previous) => ({ ...previous, displayName: event.target.value }))}
              placeholder="Erica or Taylor"
              className="w-44 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <p className="mt-4 text-sm text-brand-700">Use Draw on any option to circle details or sketch a note right on it.</p>
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
                    disabled={!editable}
                    checked={state.selections.baseSelected}
                    onChange={(event) => updateSelections((previous) => ({ ...previous, baseSelected: event.target.checked }))}
                    className="h-5 w-5 accent-brand-600"
                  />
                  Included
                </label>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {config.sections.map((section) => (
                  <ProposalSectionCard key={section.id} {...markup} section={section}
                    feedback={state.selections.sectionFeedback[section.id] ?? { comment: "", status: "" }}
                    onFeedback={editable ? (patch) => setSectionFeedback(section.id, patch) : undefined} />
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-zinc-900">Optional upgrades</h2>
              <p className="mt-2 text-sm text-zinc-600">These are separate from the base rebuild. Check anything you'd like to discuss.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {config.oneTimeOptions.map((option) => (
                  <ProposalOptionCard key={option.id} {...markup} option={option}
                    selected={state.selections.oneTimeOptionIds.includes(option.id)}
                    onSelect={editable ? (selected) => updateSelections((previous) => ({ ...previous, oneTimeOptionIds: toggleArrayItem(previous.oneTimeOptionIds, option.id, selected) })) : undefined} />
                ))}
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
                {config.recurringOptions.map((option) => (
                  <ProposalRecurringCard key={option.id} {...markup} option={option}
                    selected={state.selections.recurringOptionIds.includes(option.id)}
                    onSelect={editable ? (selected) => updateSelections((previous) => ({ ...previous, recurringOptionIds: toggleArrayItem(previous.recurringOptionIds, option.id, selected) })) : undefined} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-zinc-900">Finish</h2>
              <p className="mt-2 text-sm text-zinc-600">Selections are for discussion, not a payment or binding acceptance.</p>
              <button
                type="button"
                onClick={submitFeedback}
                disabled={!editable || submitStatus === "sending"}
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
