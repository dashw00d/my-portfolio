import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CheckCheck,
  Copy,
  FileText,
  Loader2,
  LockKeyhole,
  MessageSquare,
  PencilLine,
  Send,
} from "lucide-react";

import {
  ProposalOptionCard,
  ProposalRecurringCard,
  ProposalSectionCard,
} from "@/components/proposal/ProposalCards";
import ProposalMarkup from "@/components/proposal/ProposalMarkup";
import type { ProposalConfig } from "@/lib/proposal/config";
import type {
  DoodleStroke,
  FeedbackStatus,
  ProposalState,
  SharedSelections,
} from "@/lib/proposal/types";

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

interface ReviewMirror {
  state: ProposalState;
  clientToken: string;
  toolbar: ReactNode;
  response: ReactNode;
  clientPath: string;
}

export default function ProposalPage({
  review,
  initialConfig,
}: {
  review?: ReviewMirror;
  initialConfig?: ProposalConfig;
}) {
  const [loadedConfig, setConfig] = useState<ProposalConfig | undefined>(
    initialConfig,
  );
  const config = review ? initialConfig : loadedConfig;
  const [loadError, setLoadError] = useState("");
  const [localState, setState] = useState<ProposalState>(emptyState);
  const state = review?.state ?? localState;
  const revision = useRef(1);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const savedState = useRef<ProposalState | null>(null);
  const latestState = useRef(state);
  latestState.current = state;
  const [editable, setEditable] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [previewToken, setPreviewToken] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (review) return;
    const token =
      new URLSearchParams(window.location.search).get("token") || "";
    let cancelled = false;
    fetch(`/proposal/api.php?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        if (!response.ok)
          throw new Error("This proposal link is not available.");
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (!data.config && !initialConfig)
          throw new Error("Proposal content is unavailable.");
        const loaded = { ...emptyState, ...data.state };
        savedState.current = loaded;
        setState(loaded);
        setConfig(data.config ?? initialConfig);
        revision.current = data.revision ?? 1;
        setEditable(data.status === "active" && !data.isExpired);
        setPreviewToken(token);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(
            "This proposal could not be opened. Check the link or contact the sender.",
          );
          setSaveStatus("error");
          setSaveMessage(
            "Could not load the shared proposal. Check your link and refresh.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [review, initialConfig]);

  useEffect(() => {
    if (!previewToken || !editable || state === savedState.current) return;
    const timer = window.setTimeout(() => {
      void saveState(state).catch(() => {});
    }, 700);
    return () => window.clearTimeout(timer);
  }, [state, previewToken, editable]);

  const totals = useMemo(() => {
    if (!config) return { oneTime: 0 };
    const selectedOneTime = config.oneTimeOptions.filter((option) =>
      state.selections.oneTimeOptionIds.includes(option.id),
    );
    const oneTime =
      (state.selections.baseSelected ? config.baseOption.price : 0) +
      selectedOneTime.reduce((sum, option) => sum + option.price, 0);
    return { oneTime };
  }, [state.selections, config]);

  function saveState(nextState: ProposalState): Promise<void> {
    const pending = saveQueue.current.then(async () => {
      if (savedState.current === nextState) return;
      setSaveStatus("saving");
      try {
        const response = await fetch(
          `/proposal/api.php?token=${encodeURIComponent(previewToken)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              revision: revision.current,
              state: nextState,
            }),
          },
        );
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result?.error ?? "Unable to save.");
        revision.current = result.revision;
        savedState.current = nextState;
        setSaveStatus(latestState.current === nextState ? "saved" : "saving");
        setSaveMessage("Saved");
      } catch (error) {
        setSaveStatus("error");
        setSaveMessage(
          error instanceof Error
            ? error.message
            : "Could not save. Retry in a moment.",
        );
        throw error;
      }
    });
    saveQueue.current = pending.catch(() => {});
    return pending;
  }

  function updateSelections(
    updater: (previous: SharedSelections) => SharedSelections,
  ) {
    setState((previous) => ({
      ...previous,
      selections: updater(previous.selections),
    }));
    setSaveStatus("saving");
    setSubmitStatus("idle");
  }

  function setSectionFeedback(
    sectionId: string,
    patch: Partial<{ comment: string; status: FeedbackStatus | "" }>,
  ) {
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
    return selected
      ? Array.from(new Set([...ids, id]))
      : ids.filter((item) => item !== id);
  }

  async function submitFeedback() {
    setSubmitStatus("sending");
    try {
      await saveState(state);
      const response = await fetch(
        `/proposal/api.php?token=${encodeURIComponent(previewToken)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName: state.selections.displayName }),
        },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result?.error ?? "Unable to send feedback.");
      setSubmitStatus("sent");
    } catch {
      setSubmitStatus("error");
    }
  }

  function addDoodle(stroke: DoodleStroke) {
    setSubmitStatus("idle");
    if (state.doodles.length >= 80) {
      setSaveStatus("error");
      setSaveMessage(
        "The proposal has 80 marks. Undo a mark before adding another.",
      );
      return;
    }
    setState((previous) => ({
      ...previous,
      doodles: [...previous.doodles, stroke],
    }));
    setSaveStatus("saving");
  }

  function undoDoodle(targetId: string) {
    setSaveStatus("saving");
    setSubmitStatus("idle");
    setState((previous) => {
      const index = previous.doodles
        .map((stroke) => stroke.targetId)
        .lastIndexOf(targetId);
      return {
        ...previous,
        doodles: previous.doodles.filter((_, position) => position !== index),
      };
    });
  }

  function clearDoodles(targetId: string) {
    setState((previous) => ({
      ...previous,
      doodles: previous.doodles.filter(
        (stroke) => stroke.targetId !== targetId,
      ),
    }));
    setSaveStatus("saving");
    setSubmitStatus("idle");
  }

  const markup = {
    doodles: state.doodles,
    onDraw: editable ? addDoodle : undefined,
    onUndo: undoDoodle,
    onClear: clearDoodles,
  };

  function copyLink() {
    const url = `${window.location.origin}${review?.clientPath ?? window.location.pathname}?token=${encodeURIComponent(review?.clientToken ?? previewToken)}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {
        setSaveMessage("Copy the proposal address from your browser.");
        setSaveStatus("error");
      });
  }

  if (!config || loadError)
    return (
      <main className="proposal-shell grid min-h-screen place-items-center p-6">
        <div className="proposal-panel max-w-md text-center">
          <FileText className="mx-auto mb-5 h-8 w-8 text-brand-600" />
          <h1 className="text-2xl font-bold">
            {loadError ? "Proposal unavailable" : "Opening your proposal…"}
          </h1>
          <p className="mt-3 text-sm">
            {loadError || "Getting everything ready for you."}
          </p>
          {loadError && (
            <button
              className="proposal-button mt-6"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          )}
        </div>
      </main>
    );

  const oneTimeSelected = config.oneTimeOptions.filter((option) =>
    state.selections.oneTimeOptionIds.includes(option.id),
  );
  const recurringSelected = config.recurringOptions.filter((option) =>
    state.selections.recurringOptionIds.includes(option.id),
  );

  return (
    <main className="proposal-shell min-h-screen">
      <div className="proposal-topbar">
        <a
          href="#"
          className="flex items-center gap-3 font-bold tracking-tight"
        >
          <span className="proposal-monogram">
            {config.senderName
              .split(" ")
              .map((name) => name[0])
              .slice(0, 2)
              .join("")}
          </span>
          {config.senderName}
          <span className="hidden font-normal text-brand-900/40 sm:inline">
            / Proposals
          </span>
        </a>
          <span className="flex items-center gap-2 text-sm text-brand-900/70">
          <LockKeyhole className="h-3.5 w-3.5" />
          Private collaboration
        </span>
      </div>
      <div className="mx-auto max-w-[1320px] px-5 pb-16 pt-8 sm:px-10">
        {review?.toolbar}
        <header className="proposal-hero">
          <div className="relative z-10">
            <p className="proposal-eyebrow text-highlight-300">
              Prepared for {config.clientName}
            </p>
            <h1>{config.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-100/85">
              {config.introduction}
            </p>
            <a
              href="#scope"
              className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-highlight-200"
            >
              Review the plan <ArrowDown className="h-4 w-4" />
            </a>
          </div>
          <div className="proposal-hero-note" aria-hidden="true">
            <PencilLine className="mb-5 h-6 w-6" />
            <p>
              This is a draft for
              <br />
              <strong>{config.clientName}</strong>
              <br />
              built to be marked up.
            </p>
            <span>Not an invoice</span>
          </div>
        </header>

        <div
          className="proposal-guide"
          aria-label="How to review your proposal"
        >
          {[
            {
              icon: CheckCheck,
              title: "Choose what fits",
              text: "Select the work you want included.",
            },
            {
              icon: PencilLine,
              title: "Mark or note",
              text: "Sketch directly on the plan.",
            },
            {
              icon: Send,
              title: "Send it back",
              text: "Share your feedback with Ryan.",
            },
          ].map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="flex items-center gap-3">
              <span className="proposal-guide-icon">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold">
                  <span className="mr-2 text-brand-600/50">0{index + 1}</span>
                  {title}
                </p>
                <p className="mt-1 text-sm text-brand-900/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
        {!review && (
          <div
            className="mb-7 flex flex-wrap items-center justify-between gap-3 text-sm text-brand-900/60"
            role="status"
            aria-live="polite"
          >
            <span className="flex items-center gap-2">
              {saveStatus === "saving" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${saveStatus === "error" ? "bg-danger-500" : "bg-success-500"}`}
                />
              )}
              {saveStatus === "error"
                ? saveMessage
                : saveStatus === "saving"
                  ? "Saving your changes…"
                  : !previewToken
                    ? "Opening shared proposal…"
                    : !editable
                      ? "This proposal is read-only."
                      : saveStatus === "saved"
                        ? "All changes saved"
                        : "Your changes save automatically"}
            </span>
            {saveStatus === "error" && editable && (
              <button
                className="font-bold text-danger-700 underline"
                onClick={() => void saveState(state).catch(() => {})}
              >
                Retry save
              </button>
            )}
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 font-semibold"
              disabled={!previewToken}
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        )}

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-12">
            <section id="scope" className="scroll-mt-8">
              <div className="proposal-section-heading">
                <div>
                  <p className="proposal-eyebrow">01 / The foundation</p>
                  <h2>{config.baseOption.label}</h2>
                </div>
                <span className="proposal-price">
                  {formatMoney(config.baseOption.price)}
                  <small>one time</small>
                </span>
              </div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-brand-200 bg-brand-50/60 p-6">
                <p className="max-w-xl text-sm leading-relaxed text-brand-900/70">
                  {config.baseOption.summary}
                </p>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
                  <input
                    type="checkbox"
                    disabled={!editable}
                    checked={state.selections.baseSelected}
                    onChange={(event) =>
                      updateSelections((previous) => ({
                        ...previous,
                        baseSelected: event.target.checked,
                      }))
                    }
                    className="h-5 w-5 accent-brand-600"
                  />
                  Include in plan
                </label>
                {config.baseOption.includes.length > 0 && (
                  <ul className="grid w-full gap-2 text-sm text-brand-900/75 sm:grid-cols-2">
                    {config.baseOption.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="grid items-start gap-6 md:grid-cols-2">
                {config.sections.map((section) => (
                  <ProposalSectionCard
                    key={section.id}
                    {...markup}
                    section={section}
                    feedback={
                      state.selections.sectionFeedback[section.id] ?? {
                        comment: "",
                        status: "",
                      }
                    }
                    onFeedback={
                      editable
                        ? (patch) => setSectionFeedback(section.id, patch)
                        : undefined
                    }
                  />
                ))}
              </div>
            </section>

            {config.oneTimeOptions.length > 0 && (
              <section id="options">
                <div className="proposal-section-heading">
                  <div>
                    <p className="proposal-eyebrow">
                      02 / Optional additions
                    </p>
                    <h2>Add-ons you can choose.</h2>
                    <p>
                      Select anything you’d like to add to the project.
                    </p>
                  </div>
                  <span className="proposal-count">
                    {oneTimeSelected.length} selected
                  </span>
                </div>
                <div className="grid items-start gap-6 md:grid-cols-2">
                  {config.oneTimeOptions.map((option) => (
                    <ProposalOptionCard
                      key={option.id}
                      {...markup}
                      option={option}
                      selected={state.selections.oneTimeOptionIds.includes(
                        option.id,
                      )}
                      onSelect={
                        editable
                          ? (selected) =>
                              updateSelections((previous) => ({
                                ...previous,
                                oneTimeOptionIds: toggleArrayItem(
                                  previous.oneTimeOptionIds,
                                  option.id,
                                  selected,
                                ),
                              }))
                          : undefined
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {config.previewImage && (
              <section>
                <div className="proposal-section-heading">
                  <div>
                    <p className="proposal-eyebrow">Visual direction</p>
                    <h2>Here’s the working visual.</h2>
                    <p>{config.previewCaption}</p>
                  </div>
                </div>
                <ProposalMarkup
                  {...markup}
                  targetId="proposal-preview"
                  title="design preview"
                >
                  <img
                    src={config.previewImage}
                    alt={config.previewCaption || "Proposal design preview"}
                    className="block h-auto w-full rounded-2xl border border-brand-200"
                  />
                </ProposalMarkup>
              </section>
            )}

            {config.recurringOptions.length > 0 && (
              <section>
                <div className="proposal-section-heading">
                  <div>
                    <p className="proposal-eyebrow">Ongoing support</p>
                    <h2>Ongoing support, billed separately.</h2>
                    <p>Choose the support that fits your schedule.</p>
                  </div>
                </div>
                <div className="grid items-start gap-6 md:grid-cols-2">
                  {config.recurringOptions.map((option) => (
                    <ProposalRecurringCard
                      key={option.id}
                      {...markup}
                      option={option}
                      selected={state.selections.recurringOptionIds.includes(
                        option.id,
                      )}
                      onSelect={
                        editable
                          ? (selected) =>
                              updateSelections((previous) => ({
                                ...previous,
                                recurringOptionIds: toggleArrayItem(
                                  previous.recurringOptionIds,
                                  option.id,
                                  selected,
                                ),
                              }))
                          : undefined
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="min-w-0 space-y-6 xl:sticky xl:top-6">
            <div className="proposal-summary">
              <p className="proposal-eyebrow">Current selection</p>
              <h2 className="mt-3 text-2xl font-bold">One-time total</h2>
              <div className="my-8 border-y border-brand-200/60 py-8">
                <p className="text-sm text-brand-900/60">One-time investment</p>
                <p className="mt-2 text-5xl font-semibold tracking-tight">
                  {formatMoney(totals.oneTime)}
                </p>
                <p className="mt-2 text-sm text-brand-900/50">
                  {state.selections.baseSelected
                    ? "Foundation"
                    : "No foundation"}
                  {oneTimeSelected.length
                    ? ` + ${oneTimeSelected.length} addition${oneTimeSelected.length === 1 ? "" : "s"}`
                    : " · no additions selected"}
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span>{config.baseOption.label}</span>
                  <span className="shrink-0 font-semibold">
                    {state.selections.baseSelected
                      ? formatMoney(config.baseOption.price)
                      : "—"}
                  </span>
                </div>
                {oneTimeSelected.map((option) => (
                  <div
                    key={option.id}
                    className="flex justify-between gap-4 text-brand-900/65"
                  >
                    <span>{option.label}</span>
                    <span className="shrink-0">
                      {formatMoney(option.price)}
                    </span>
                  </div>
                ))}
              </div>
              {recurringSelected.length > 0 && (
              <div className="mt-8 space-y-4 border-t border-brand-200/60 pt-6">
                  <p className="proposal-eyebrow">Ongoing, billed separately</p>
                  {recurringSelected.map((option) => (
                    <div
                      key={option.id}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span>{option.label}</span>
                      <span className="shrink-0 font-semibold">
                        {formatMoney(option.price)} / {option.period}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {config.thirdPartyCosts.length > 0 && (
                <details className="mt-8 border-t border-brand-200/60 pt-6 text-sm text-brand-900/60">
                  <summary className="cursor-pointer font-semibold">
                    Other costs to keep in mind
                  </summary>
                  {config.thirdPartyCosts.map((cost) => (
                    <p key={cost.id} className="mt-3 leading-relaxed">
                      <strong>{cost.label}.</strong> {cost.detail}
                    </p>
                  ))}
                </details>
              )}
            </div>
            {review ? (
              review.response
            ) : (
              <div id="send-feedback" className="proposal-panel">
                <MessageSquare className="mb-5 h-6 w-6 text-brand-600" />
                <h2 className="text-xl font-bold">Send Ryan your feedback</h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-900/65">
                  {config.closingNote}
                </p>
                <label
                  htmlFor="displayName"
                    className="mt-6 block text-sm font-bold"
                >
                  Your name{" "}
                  <span className="font-normal text-brand-900/50">
                    (optional)
                  </span>
                </label>
                <input
                  id="displayName"
                  disabled={!editable}
                  value={state.selections.displayName}
                  onChange={(event) =>
                    updateSelections((previous) => ({
                      ...previous,
                      displayName: event.target.value,
                    }))
                  }
                  placeholder={config.clientNames.join(" or ") || "First name"}
                  maxLength={40}
                  className="proposal-input mt-3"
                />
                <button
                  type="button"
                  onClick={submitFeedback}
                  disabled={
                    !editable ||
                    submitStatus === "sending" ||
                    submitStatus === "sent"
                  }
                  className="proposal-button mt-6 w-full"
                >
                  {submitStatus === "sending" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : submitStatus === "sent" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {submitStatus === "sent"
                    ? "Feedback sent"
                    : `Send feedback to ${config.senderName.split(" ")[0]}`}
                </button>
                <div role="status" aria-live="polite">
                  {submitStatus === "sent" && (
                    <p className="mt-3 text-sm text-success-700">
                      Thank you! Your response is ready for{" "}
                      {config.senderName.split(" ")[0]} to review.
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p className="mt-3 text-sm text-danger-700">
                      Could not send feedback. Your edits are still here; please
                      try again.
                    </p>
                  )}
                </div>
                <p className="mt-6 text-center text-sm leading-relaxed text-brand-900/50">
                  This is a proposal, not an invoice or commitment.
                </p>
              </div>
            )}
            <a
              href={`mailto:${config.senderEmail}`}
              className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-brand-900/60"
            >
              Prefer to talk it through? Email {config.senderName.split(" ")[0]}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </aside>
        </div>
        <footer className="mt-16 flex flex-wrap justify-between gap-3 border-t border-brand-200/50 pt-6 text-sm text-brand-900/45">
          <span>Prepared with care by {config.senderName}.</span>
          <span>A proposal for {config.clientName}.</span>
        </footer>
      </div>
    </main>
  );
}
