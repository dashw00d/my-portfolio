import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Eye,
  FilePlus2,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import {
  PROPOSAL_CONFIG,
  type ProposalConfig,
  type ProposalOption,
} from "@/lib/proposal/config";
import { newProposalTemplate, proposalToken } from "@/lib/proposal/template";
import type { ProposalState } from "@/lib/proposal/types";
import ProposalPage from "./ProposalPage";

const LINKS_KEY = "proposal-studio-created-links-v1";
const DRAFT_KEY = "proposal-studio-draft-v1";
const lines = (value: string) => value.split("\n");
const newId = () => crypto.randomUUID();

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block min-w-0 text-sm font-bold text-brand-800">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}

export default function ProposalBuilderPage() {
  const [config, setConfig] = useState<ProposalConfig>(newProposalTemplate);
  const [admin, setAdmin] = useState("");
  const [ready, setReady] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [links, setLinks] = useState<{
    clientUrl: string;
    reviewUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setAdmin(new URLSearchParams(window.location.search).get("admin") ?? "");
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
      if (
        draft?.id === "draft" &&
        Array.isArray(draft.sections) &&
        Array.isArray(draft.oneTimeOptions) &&
        Array.isArray(draft.recurringOptions) &&
        Array.isArray(draft.thirdPartyCosts) &&
        draft.baseOption &&
        Array.isArray(draft.clientNames)
      )
        setConfig(draft);
    } catch {
      /* Start fresh when browser storage is unavailable. */
    }
    try {
      const created = JSON.parse(sessionStorage.getItem(LINKS_KEY) ?? "null");
      if (
        typeof created?.clientUrl === "string" &&
        created.clientUrl.startsWith("/p/proposal/?token=") &&
        typeof created?.reviewUrl === "string" &&
        created.reviewUrl.startsWith("/proposal/review/?admin=")
      )
        setLinks(created);
    } catch {
      /* Link recovery is optional when session storage is unavailable. */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || links) return;
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(config));
        setDraftStatus("Draft saved on this device");
      } catch {
        setDraftStatus("Browser storage is unavailable. Keep this tab open.");
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [config, ready, links]);

  function update(patch: Partial<ProposalConfig>) {
    setConfig((previous) => ({ ...previous, ...patch }));
    setDraftStatus("Saving draft…");
  }
  function updateBase(patch: Partial<ProposalOption>) {
    update({ baseOption: { ...config.baseOption, ...patch } });
  }

  async function duplicate() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/proposal/api.php/review", {
        headers: { "X-Proposal-Admin": proposalToken(admin) },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not open that proposal.");
      const source: ProposalConfig = result.config ?? PROPOSAL_CONFIG;
      update({
        ...source,
        id: "draft",
        title: `${source.title} — copy`,
        clientName: "",
        clientNames: [],
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load the proposal.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    setBusy(true);
    setError("");
    try {
      const cleanLines = (items: string[]) =>
        items.map((item) => item.trim()).filter(Boolean);
      const clean = {
        ...config,
        clientNames: cleanLines(config.clientNames),
        baseOption: {
          ...config.baseOption,
          includes: cleanLines(config.baseOption.includes),
        },
        sections: config.sections.map((section) => ({
          ...section,
          bullets: cleanLines(section.bullets),
        })),
        oneTimeOptions: config.oneTimeOptions.map((option) => ({
          ...option,
          includes: cleanLines(option.includes),
        })),
      };
      const response = await fetch("/proposal/api.php/admin?action=create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Proposal-Admin": proposalToken(admin),
        },
        body: JSON.stringify({ config: clean }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? "Could not create the proposal.");
      setLinks(result);
      try {
        sessionStorage.setItem(
          LINKS_KEY,
          JSON.stringify({
            clientUrl: result.clientUrl,
            reviewUrl: result.reviewUrl,
          }),
        );
      } catch {
        /* The links remain visible for manual saving. */
      }
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* Creation succeeded even if local storage is unavailable. */
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not create the proposal. Your draft is still here.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copy(value: string, kind: string) {
    try {
      await navigator.clipboard.writeText(
        new URL(value, window.location.origin).href,
      );
      setCopied(kind);
    } catch {
      setError("Could not copy automatically. Select and copy the link below.");
    }
  }

  if (preview) {
    const state: ProposalState = {
      selections: {
        baseSelected: config.baseOption.selectedByDefault ?? true,
        oneTimeOptionIds: config.oneTimeOptions
          .filter((option) => option.selectedByDefault)
          .map((option) => option.id),
        recurringOptionIds: config.recurringOptions
          .filter((option) => option.selectedByDefault)
          .map((option) => option.id),
        sectionFeedback: {},
        displayName: "",
        updatedAt: "",
      },
      doodles: [],
      threads: [],
      pins: [],
    };
    return (
      <ProposalPage
        initialConfig={{
          ...config,
          title: config.title || "Your next chapter.",
          clientName: config.clientName || "Your client",
        }}
        review={{
          state,
          clientToken: "",
          clientPath: "/p/proposal/",
          toolbar: (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setPreview(false)}
                className="proposal-button proposal-button--secondary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to editing
              </button>
              <p className="text-sm text-brand-700">
                Design preview · choices and drawing activate in the client link
              </p>
            </div>
          ),
          response: (
            <div className="proposal-panel">
              <h2 className="font-bold">Looking good?</h2>
              <p className="my-3 text-sm text-brand-900/65">
                Return to the editor to create your client and review links.
              </p>
              <button
                onClick={() => setPreview(false)}
                className="proposal-button"
              >
                Back to editing
              </button>
            </div>
          ),
        }}
      />
    );
  }

  return (
    <main className="proposal-shell min-h-screen">
      <div className="proposal-topbar">
        <a
          href="/proposal/review/"
          className="flex items-center gap-3 font-bold"
        >
          <span className="proposal-monogram">RS</span>Proposal studio
        </a>
        <span className="text-sm text-brand-700">
          Owner workspace
        </span>
      </div>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-10">
        <p className="proposal-eyebrow text-brand-600">New proposal</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Draft a client proposal.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-900/65">
          Add your client, shape the scope, and make it personal. We’ll give you
          a private link where they can choose, comment, and draw.
        </p>
        {links ? (
          <section className="proposal-panel mt-8" aria-live="polite">
            <Check className="mb-4 h-8 w-8 text-success-600" />
            <h2 className="text-3xl font-bold">Proposal created.</h2>
            <p className="mb-6 mt-3 text-sm text-brand-900/65">
              Your proposal is created. Share the client link when you’re ready,
              and keep the review link for yourself.
            </p>
            {(
              [
                ["clientUrl", "Client link", "Share this with your client."],
                [
                  "reviewUrl",
                  "Private review link",
                  "Save this link. It gives you access to responses and link controls.",
                ],
              ] as const
            ).map(([key, label, help]) => (
              <div key={key} className="mt-6">
                <Field label={label}>
                  <input
                    readOnly
                    className="proposal-input"
                    value={new URL(links[key], window.location.origin).href}
                    onFocus={(event) => event.target.select()}
                  />
                </Field>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-brand-900/60">{help}</p>
                  <button
                    className="proposal-button proposal-button--secondary"
                    onClick={() => void copy(links[key], key)}
                  >
                    {copied === key ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied === key ? "Copied" : "Copy link"}
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="proposal-button" href={links.reviewUrl}>
                Open review <ArrowRight className="h-4 w-4" />
              </a>
              <a
                className="proposal-button proposal-button--secondary"
                href={links.clientUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open client view
              </a>
              <button
                className="proposal-button proposal-button--secondary"
                onClick={() => {
                  try {
                    sessionStorage.removeItem(LINKS_KEY);
                  } catch {
                    /* Continue with a new draft. */
                  }
                  setLinks(null);
                  setConfig(newProposalTemplate());
                  setCopied("");
                  setError("");
                }}
              >
                Create another
              </button>
            </div>
          </section>
        ) : (
          <form
            className="mt-12 space-y-8"
            onSubmit={(event) => {
              event.preventDefault();
              void create();
            }}
          >
            <section className="proposal-panel">
              <div className="mb-7 flex items-start justify-between gap-5">
                <div>
                  <h2 className="text-lg font-bold">
                    Start with the essentials
                  </h2>
                  <p className="mt-1 text-sm text-brand-900/60">
                    Your existing review link unlocks creation.
                  </p>
                </div>
                <FilePlus2 className="h-6 w-6 text-brand-500" />
              </div>
              <Field label="Admin link or access token">
                <input
                  type="password"
                  required
                  autoComplete="off"
                  className="proposal-input"
                  value={admin}
                  onChange={(event) => setAdmin(event.target.value)}
                  placeholder="Paste a proposal review link"
                />
              </Field>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={!admin.trim() || busy}
                  onClick={() => void duplicate()}
                  className="proposal-button proposal-button--secondary"
                >
                  <Copy className="h-4 w-4" />
                  Use that proposal as a template
                </button>
                <span className="text-sm text-brand-900/50">
                  Copies the content into this draft. Starts with fresh
                  feedback.
                </span>
              </div>
            </section>
            <section className="proposal-panel">
              <h2 className="mb-7 text-xl font-bold">01 / Make it personal</h2>
              <div className="grid gap-7 sm:grid-cols-2">
                <Field label="Client or business name">
                  <input
                    required
                    maxLength={180}
                    className="proposal-input"
                    placeholder="e.g. Willow & Co."
                    value={config.clientName}
                    onChange={(event) =>
                      update({ clientName: event.target.value })
                    }
                  />
                </Field>
                <Field label="Client first names (comma separated)">
                  <input
                    className="proposal-input"
                    placeholder="e.g. Alex, Jamie"
                    value={config.clientNames.join(",")}
                    onChange={(event) =>
                      update({ clientNames: event.target.value.split(",") })
                    }
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Proposal title">
                    <input
                      required
                      maxLength={180}
                      className="proposal-input"
                      placeholder="Website redesign and rollout."
                      value={config.title}
                      onChange={(event) =>
                        update({ title: event.target.value })
                      }
                    />
                  </Field>
                </div>
                <Field label="Your name">
                  <input
                    required
                    maxLength={180}
                    className="proposal-input"
                    value={config.senderName}
                    onChange={(event) =>
                      update({ senderName: event.target.value })
                    }
                  />
                </Field>
                <Field label="Your email">
                  <input
                    required
                    type="email"
                    maxLength={180}
                    className="proposal-input"
                    value={config.senderEmail}
                    onChange={(event) =>
                      update({ senderEmail: event.target.value })
                    }
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Personal introduction">
                    <textarea
                      rows={3}
                      maxLength={2000}
                      className="proposal-input"
                      value={config.introduction}
                      onChange={(event) =>
                        update({ introduction: event.target.value })
                      }
                    />
                  </Field>
                </div>
              </div>
            </section>
            <section className="proposal-panel">
              <h2 className="mb-7 text-xl font-bold">02 / The foundation</h2>
              <div className="grid gap-7 sm:grid-cols-[1fr_180px]">
                <Field label="Core service">
                  <input
                    required
                    maxLength={180}
                    className="proposal-input"
                    value={config.baseOption.label}
                    onChange={(event) =>
                      updateBase({ label: event.target.value })
                    }
                  />
                </Field>
                <Field label="One-time price ($)">
                  <input
                    type="number"
                    required
                    min="0"
                    max="1000000"
                    step="0.01"
                    className="proposal-input"
                    value={config.baseOption.price}
                    onChange={(event) =>
                      updateBase({ price: Number(event.target.value) })
                    }
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Summary">
                    <textarea
                      rows={2}
                      maxLength={1200}
                      className="proposal-input"
                      value={config.baseOption.summary}
                      onChange={(event) =>
                        updateBase({ summary: event.target.value })
                      }
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Included deliverables (one per line)">
                    <textarea
                      rows={3}
                      className="proposal-input"
                      value={config.baseOption.includes.join("\n")}
                      onChange={(event) =>
                        updateBase({ includes: lines(event.target.value) })
                      }
                    />
                  </Field>
                </div>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={config.baseOption.selectedByDefault ?? true}
                  onChange={(event) =>
                    updateBase({ selectedByDefault: event.target.checked })
                  }
                  className="h-4 w-4 accent-brand-600"
                />
                Start with the foundation selected
              </label>
              <div className="mt-9 space-y-6">
                {config.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="rounded-2xl border border-brand-200/60 p-6"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-sm font-bold">
                        Scope card {index + 1}
                      </h3>
                      <button
                        type="button"
                        className="p-2 text-danger-600"
                        aria-label={`Remove scope card ${index + 1}`}
                        onClick={() =>
                          update({
                            sections: config.sections.filter(
                              (item) => item.id !== section.id,
                            ),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-6">
                      <Field label="Heading">
                        <input
                          required
                          maxLength={180}
                          className="proposal-input"
                          value={section.title}
                          onChange={(event) =>
                            update({
                              sections: config.sections.map((item) =>
                                item.id === section.id
                                  ? { ...item, title: event.target.value }
                                  : item,
                              ),
                            })
                          }
                        />
                      </Field>
                      <Field label="Short description">
                        <input
                          maxLength={1200}
                          className="proposal-input"
                          value={section.summary}
                          onChange={(event) =>
                            update({
                              sections: config.sections.map((item) =>
                                item.id === section.id
                                  ? { ...item, summary: event.target.value }
                                  : item,
                              ),
                            })
                          }
                        />
                      </Field>
                      <Field label="Details (one per line)">
                        <textarea
                          rows={3}
                          className="proposal-input"
                          value={section.bullets.join("\n")}
                          onChange={(event) =>
                            update({
                              sections: config.sections.map((item) =>
                                item.id === section.id
                                  ? {
                                      ...item,
                                      bullets: lines(event.target.value),
                                    }
                                  : item,
                              ),
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled={config.sections.length >= 12}
                className="proposal-button proposal-button--secondary mt-4"
                onClick={() =>
                  update({
                    sections: [
                      ...config.sections,
                      { id: newId(), title: "", summary: "", bullets: [] },
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Add scope card
              </button>
            </section>
            <section className="proposal-panel">
              <h2 className="text-lg font-bold">03 / Optional additions</h2>
              <p className="mt-1 text-sm text-brand-900/60">
                Let your client build the plan that suits them.
              </p>
              <div className="mt-7 space-y-6">
                {config.oneTimeOptions.map((option, index) => {
                  const patch = (value: Partial<ProposalOption>) =>
                    update({
                      oneTimeOptions: config.oneTimeOptions.map((item) =>
                        item.id === option.id ? { ...item, ...value } : item,
                      ),
                    });
                  return (
                    <div
                      key={option.id}
                      className="rounded-2xl border border-brand-200/60 p-6"
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-sm font-bold">
                          Addition {index + 1}
                        </h3>
                        <button
                          type="button"
                          aria-label={`Remove addition ${index + 1}`}
                          className="p-2 text-danger-600"
                          onClick={() =>
                            update({
                              oneTimeOptions: config.oneTimeOptions.filter(
                                (item) => item.id !== option.id,
                              ),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-[1fr_160px]">
                        <Field label="Name">
                          <input
                            required
                            maxLength={180}
                            className="proposal-input"
                            value={option.label}
                            onChange={(event) =>
                              patch({ label: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="Price ($)">
                          <input
                            required
                            type="number"
                            min="0"
                            max="1000000"
                            step="0.01"
                            className="proposal-input"
                            value={option.price}
                            onChange={(event) =>
                              patch({ price: Number(event.target.value) })
                            }
                          />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Summary">
                            <textarea
                              rows={2}
                              maxLength={1200}
                              className="proposal-input"
                              value={option.summary}
                              onChange={(event) =>
                                patch({ summary: event.target.value })
                              }
                            />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Deliverables (one per line)">
                            <textarea
                              rows={3}
                              className="proposal-input"
                              value={option.includes.join("\n")}
                              onChange={(event) =>
                                patch({ includes: lines(event.target.value) })
                              }
                            />
                          </Field>
                        </div>
                      </div>
                      <label className="mt-3 flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={option.selectedByDefault ?? false}
                          onChange={(event) =>
                            patch({ selectedByDefault: event.target.checked })
                          }
                          className="accent-brand-600"
                        />
                        Selected by default
                      </label>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={config.oneTimeOptions.length >= 20}
                className="proposal-button proposal-button--secondary mt-4"
                onClick={() =>
                  update({
                    oneTimeOptions: [
                      ...config.oneTimeOptions,
                      {
                        id: newId(),
                        label: "",
                        summary: "",
                        includes: [],
                        price: 0,
                        effort: "Low",
                      },
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Add an option
              </button>
            </section>
            <section className="proposal-panel">
              <h2 className="mb-7 text-xl font-bold">04 / Ongoing support</h2>
              <div className="space-y-6">
                {config.recurringOptions.map((option, index) => {
                  const patch = (value: Partial<typeof option>) =>
                    update({
                      recurringOptions: config.recurringOptions.map((item) =>
                        item.id === option.id ? { ...item, ...value } : item,
                      ),
                    });
                  return (
                    <div
                      key={option.id}
                      className="rounded-2xl border border-brand-200/60 p-6"
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-sm font-bold">
                          Service {index + 1}
                        </h3>
                        <button
                          type="button"
                          aria-label={`Remove service ${index + 1}`}
                          className="p-2 text-danger-600"
                          onClick={() =>
                            update({
                              recurringOptions: config.recurringOptions.filter(
                                (item) => item.id !== option.id,
                              ),
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Service name">
                          <input
                            required
                            maxLength={180}
                            className="proposal-input"
                            value={option.label}
                            onChange={(event) =>
                              patch({ label: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="Price ($)">
                          <input
                            required
                            type="number"
                            min="0"
                            max="1000000"
                            step="0.01"
                            className="proposal-input"
                            value={option.price}
                            onChange={(event) =>
                              patch({ price: Number(event.target.value) })
                            }
                          />
                        </Field>
                        <Field label="Billed per">
                          <select
                            className="proposal-input"
                            value={option.period}
                            onChange={(event) =>
                              patch({
                                period: event.target
                                  .value as typeof option.period,
                              })
                            }
                          >
                            <option value="month">Month</option>
                            <option value="batch">Batch</option>
                            <option value="event">Event</option>
                          </select>
                        </Field>
                        <Field label="Summary">
                          <input
                            maxLength={1200}
                            className="proposal-input"
                            value={option.summary}
                            onChange={(event) =>
                              patch({ summary: event.target.value })
                            }
                          />
                        </Field>
                      </div>
                      <label className="mt-3 flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={option.selectedByDefault ?? false}
                          onChange={(event) =>
                            patch({ selectedByDefault: event.target.checked })
                          }
                          className="accent-brand-600"
                        />
                        Selected by default
                      </label>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                disabled={config.recurringOptions.length >= 20}
                className="proposal-button proposal-button--secondary mt-4"
                onClick={() =>
                  update({
                    recurringOptions: [
                      ...config.recurringOptions,
                      {
                        id: newId(),
                        label: "",
                        summary: "",
                        price: 0,
                        period: "month",
                      },
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Add ongoing service
              </button>
            </section>
            <section className="proposal-panel">
              <h2 className="mb-7 text-xl font-bold">
                05 / The finishing touches
              </h2>
              <div className="space-y-7">
                <Field label="Closing note">
                  <textarea
                    maxLength={2000}
                    rows={3}
                    className="proposal-input"
                    value={config.closingNote}
                    onChange={(event) =>
                      update({ closingNote: event.target.value })
                    }
                  />
                </Field>
                <Field label="Preview image (optional site path)">
                  <input
                    className="proposal-input"
                    maxLength={1000}
                    placeholder="/images/your-mockup.jpg"
                    value={config.previewImage ?? ""}
                    onChange={(event) =>
                      update({ previewImage: event.target.value || null })
                    }
                  />
                </Field>
                <Field label="Preview caption">
                  <input
                    maxLength={2000}
                    className="proposal-input"
                    value={config.previewCaption}
                    onChange={(event) =>
                      update({ previewCaption: event.target.value })
                    }
                  />
                </Field>
              </div>
              <p className="mt-2 text-sm text-brand-900/50">
                Use an image already on your site. Clients can draw directly on
                it.
              </p>
              <div className="mt-8 space-y-6">
                {config.thirdPartyCosts.map((cost, index) => (
                  <div
                    key={cost.id}
                    className="rounded-2xl border border-brand-200/60 p-6"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-sm font-bold">
                        Separate cost {index + 1}
                      </h3>
                      <button
                        type="button"
                        aria-label={`Remove cost ${index + 1}`}
                        className="p-2 text-danger-600"
                        onClick={() =>
                          update({
                            thirdPartyCosts: config.thirdPartyCosts.filter(
                              (item) => item.id !== cost.id,
                            ),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <Field label="Label">
                        <input
                          required
                          maxLength={180}
                          className="proposal-input"
                          value={cost.label}
                          onChange={(event) =>
                            update({
                              thirdPartyCosts: config.thirdPartyCosts.map(
                                (item) =>
                                  item.id === cost.id
                                    ? { ...item, label: event.target.value }
                                    : item,
                              ),
                            })
                          }
                        />
                      </Field>
                      <Field label="Details">
                        <textarea
                          required
                          rows={2}
                          maxLength={1200}
                          className="proposal-input"
                          value={cost.detail}
                          onChange={(event) =>
                            update({
                              thirdPartyCosts: config.thirdPartyCosts.map(
                                (item) =>
                                  item.id === cost.id
                                    ? { ...item, detail: event.target.value }
                                    : item,
                              ),
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled={config.thirdPartyCosts.length >= 12}
                className="proposal-button proposal-button--secondary mt-4"
                onClick={() =>
                  update({
                    thirdPartyCosts: [
                      ...config.thirdPartyCosts,
                      { id: newId(), label: "", detail: "" },
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Add a separate cost
              </button>
            </section>
            <div className="sticky bottom-6 z-20 rounded-2xl border border-brand-200 bg-highlight-50/95 p-6 shadow-lg backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p
                  role="status"
                  className="flex items-center gap-2 text-sm text-brand-700"
                >
                  <Save className="h-3.5 w-3.5" />
                  {draftStatus || "Preparing your draft…"}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={busy}
                    className="proposal-button proposal-button--secondary"
                    onClick={() => setPreview(true)}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  <button
                    type="submit"
                    disabled={busy || !ready}
                    className="proposal-button"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Create proposal
                  </button>
                </div>
              </div>
              {error && (
                <p role="alert" className="mt-3 text-sm text-danger-700">
                  {error}
                </p>
              )}
            </div>
          </form>
        )}
        {links && error && (
          <p role="alert" className="mt-4 text-sm text-danger-700">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
