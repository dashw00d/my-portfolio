import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";

import { PROPOSAL_CONFIG, type ProposalConfig } from "@/lib/proposal/config";
import { proposalToken } from "@/lib/proposal/template";
import type { ProposalState } from "@/lib/proposal/types";
import { workspaceAccess } from "@/lib/proposal/workspace";
import ProposalPage from "./ProposalPage";

function CopyField({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
  maxLength = 180,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
  maxLength?: number;
  type?: string;
}) {
  const id = useId();
  const textarea = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const field = textarea.current;
    if (!field) return;
    const fit = () => {
      if (!field.clientWidth) return;
      field.style.height = "auto";
      field.style.height = `${field.scrollHeight + 2}px`;
    };
    let width = field.clientWidth;
    const observer = new ResizeObserver(() => {
      if (field.clientWidth !== width) {
        width = field.clientWidth;
        fit();
      }
    });
    observer.observe(field);
    fit();
    return () => observer.disconnect();
  }, [value, multiline]);
  const props = {
    id,
    "aria-labelledby": `${id}-label`,
    className: "proposal-input",
    value,
    required,
    maxLength,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
  };
  return (
    <label
      htmlFor={id}
      className="block min-w-0 text-sm font-semibold text-brand-800"
    >
      <span id={`${id}-label`} className="mb-2 block">
        {label}
      </span>
      {multiline ? (
        <textarea
          ref={textarea}
          {...props}
          rows={Math.min(8, Math.max(3, value.split("\n").length))}
        />
      ) : (
        <input {...props} type={type} />
      )}
    </label>
  );
}

export default function ProposalCopyEditorPage() {
  const [admin, setAdmin] = useState("");
  const [tokenDraft, setTokenDraft] = useState("");
  const [proposalId, setProposalId] = useState("");
  const [config, setConfig] = useState<ProposalConfig | null>(null);
  const [savedConfig, setSavedConfig] = useState<ProposalConfig | null>(null);
  const [version, setVersion] = useState(0);
  const [client, setClient] = useState({ path: "", token: "" });
  const [state, setState] = useState<ProposalState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const dirty = JSON.stringify(config) !== JSON.stringify(savedConfig);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = proposalToken(params.get("admin") ?? workspaceAccess());
    setProposalId(params.get("proposal") ?? "");
    setAdmin(token);
    setTokenDraft(token);
    if (!token) setLoading(false);
  }, []);

  useEffect(() => {
    if (!admin) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void fetch(
      `/proposal/api.php/review${proposalId ? `?proposal=${encodeURIComponent(proposalId)}` : ""}`,
      {
        headers: { "X-Proposal-Admin": admin },
        signal: controller.signal,
      },
    )
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error ?? "Could not open this proposal.");
        if (controller.signal.aborted) return;
        const content =
          result.config ??
          (result.clientPath === "/p/southern-star/" ? PROPOSAL_CONFIG : null);
        if (!content) throw new Error("Proposal content is unavailable.");
        setConfig(content);
        setSavedConfig(content);
        setVersion(result.configVersion);
        setState(result.state);
        setClient({ path: result.clientPath, token: result.clientToken ?? "" });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error
              ? error.message
              : "Could not open this proposal.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [admin, proposalId, loadAttempt]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(patch: Partial<ProposalConfig>) {
    setConfig((previous) => (previous ? { ...previous, ...patch } : previous));
    setSaved(false);
  }

  async function save() {
    if (!config || saving) return;
    setSaving(true);
    setSaved(false);
    setError("");
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
    try {
      const response = await fetch(
        `/proposal/api.php/admin?action=update_copy${proposalId ? `&proposal=${encodeURIComponent(proposalId)}` : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Proposal-Admin": admin,
          },
          body: JSON.stringify({ config: clean, configVersion: version }),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error ?? "Could not save. Your changes are still here.",
        );
      setConfig(result.config);
      setSavedConfig(result.config);
      setVersion(result.configVersion);
      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save. Your changes are still here.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (preview && config && state)
    return (
      <ProposalPage
        initialConfig={config}
        review={{
          state,
          clientPath: client.path,
          clientToken: client.token,
          toolbar: (
            <button
              className="proposal-button proposal-button--secondary mb-6"
              onClick={() => setPreview(false)}
            >
              <ArrowLeft className="h-4 w-4" /> Back to editing
            </button>
          ),
          response: (
            <button
              className="proposal-button"
              onClick={() => setPreview(false)}
            >
              Back to editing
            </button>
          ),
        }}
      />
    );

  return (
    <main className="proposal-shell proposal-copy-editor min-h-screen">
      <div className="proposal-topbar">
        <a href="/proposal/" className="flex items-center gap-2 font-semibold">
          <ArrowLeft className="h-4 w-4" /> All proposals
        </a>
      </div>
      <div className="mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        {!config ? (
          <div className="py-10">
            <h1 className="mb-6 text-2xl font-semibold">
              {loading ? "Opening proposal…" : "Edit proposal copy"}
            </h1>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-label="Loading" />
            ) : (
              <form
                className="max-w-md space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setAdmin(proposalToken(tokenDraft));
                  setLoadAttempt((value) => value + 1);
                }}
              >
                <CopyField
                  label="Admin link or access key"
                  type="password"
                  value={tokenDraft}
                  onChange={setTokenDraft}
                  required
                  maxLength={2000}
                />
                <button className="proposal-button">Open editor</button>
              </form>
            )}
            {error && (
              <p role="alert" className="mt-4 text-sm text-danger-700">
                {error}
              </p>
            )}
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
            onInvalid={(event) => {
              const details = (event.target as HTMLElement).closest("details");
              if (details) details.open = true;
            }}
          >
            <div className="proposal-copy-actions">
              <div>
                <h1 className="text-2xl font-semibold">Edit copy</h1>
                <p className="mt-1 text-sm text-brand-700" role="status">
                  {saving
                    ? "Saving…"
                    : dirty
                      ? "Unsaved changes"
                      : saved
                        ? "Saved to the client link"
                        : config.clientName}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setPreview(true)}
                  className="proposal-button proposal-button--secondary"
                >
                  <Eye className="h-4 w-4" /> Preview
                </button>
                <button disabled={saving || !dirty} className="proposal-button">
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
            {error && (
              <p role="alert" className="mb-5 text-sm text-danger-700">
                {error}
              </p>
            )}
            <fieldset disabled={saving}>
              <div className="space-y-5 pb-3">
                <CopyField
                  label="Proposal title"
                  value={config.title}
                  onChange={(title) => update({ title })}
                  required
                />
                <CopyField
                  label="Introduction"
                  value={config.introduction}
                  onChange={(introduction) => update({ introduction })}
                  multiline
                  maxLength={2000}
                />
              </div>
              <details className="proposal-copy-section">
                <summary>Client and sender</summary>
                <div>
                  <CopyField
                    label="Client or business name"
                    value={config.clientName}
                    onChange={(clientName) => update({ clientName })}
                    required
                  />
                  <CopyField
                    label="Client first names (comma separated)"
                    value={config.clientNames.join(",")}
                    onChange={(value) =>
                      update({ clientNames: value.split(",") })
                    }
                    maxLength={2000}
                  />
                  <CopyField
                    label="Your name"
                    value={config.senderName}
                    onChange={(senderName) => update({ senderName })}
                    required
                  />
                  <CopyField
                    label="Your email"
                    value={config.senderEmail}
                    onChange={(senderEmail) => update({ senderEmail })}
                    type="email"
                    required
                  />
                </div>
              </details>
              <details className="proposal-copy-section">
                <summary>{config.baseOption.label}</summary>
                <div>
                  <CopyField
                    label="Service name"
                    value={config.baseOption.label}
                    onChange={(label) =>
                      update({ baseOption: { ...config.baseOption, label } })
                    }
                    required
                  />
                  <CopyField
                    label="Summary"
                    value={config.baseOption.summary}
                    onChange={(summary) =>
                      update({ baseOption: { ...config.baseOption, summary } })
                    }
                    multiline
                    maxLength={1200}
                  />
                  <CopyField
                    label="Includes (one per line)"
                    value={config.baseOption.includes.join("\n")}
                    onChange={(value) =>
                      update({
                        baseOption: {
                          ...config.baseOption,
                          includes: value.split("\n"),
                        },
                      })
                    }
                    multiline
                    maxLength={10020}
                  />
                </div>
              </details>
              {config.sections.map((section, index) => {
                const change = (patch: Partial<typeof section>) =>
                  update({
                    sections: config.sections.map((item, i) =>
                      i === index ? { ...item, ...patch } : item,
                    ),
                  });
                return (
                  <details key={section.id} className="proposal-copy-section">
                    <summary>{section.title}</summary>
                    <div>
                      <CopyField
                        label="Section title"
                        value={section.title}
                        onChange={(title) => change({ title })}
                        required
                      />
                      <CopyField
                        label="Summary"
                        value={section.summary}
                        onChange={(summary) => change({ summary })}
                        multiline
                        maxLength={1200}
                      />
                      <CopyField
                        label="Details (one per line)"
                        value={section.bullets.join("\n")}
                        onChange={(value) =>
                          change({ bullets: value.split("\n") })
                        }
                        multiline
                        maxLength={10020}
                      />
                    </div>
                  </details>
                );
              })}
              {config.oneTimeOptions.map((option, index) => {
                const change = (patch: Partial<typeof option>) =>
                  update({
                    oneTimeOptions: config.oneTimeOptions.map((item, i) =>
                      i === index ? { ...item, ...patch } : item,
                    ),
                  });
                return (
                  <details key={option.id} className="proposal-copy-section">
                    <summary>{option.label}</summary>
                    <div>
                      <CopyField
                        label="Option name"
                        value={option.label}
                        onChange={(label) => change({ label })}
                        required
                      />
                      <CopyField
                        label="Summary"
                        value={option.summary}
                        onChange={(summary) => change({ summary })}
                        multiline
                        maxLength={1200}
                      />
                      <CopyField
                        label="Includes (one per line)"
                        value={option.includes.join("\n")}
                        onChange={(value) =>
                          change({ includes: value.split("\n") })
                        }
                        multiline
                        maxLength={10020}
                      />
                    </div>
                  </details>
                );
              })}
              {config.recurringOptions.map((option, index) => {
                const change = (patch: Partial<typeof option>) =>
                  update({
                    recurringOptions: config.recurringOptions.map((item, i) =>
                      i === index ? { ...item, ...patch } : item,
                    ),
                  });
                return (
                  <details key={option.id} className="proposal-copy-section">
                    <summary>{option.label}</summary>
                    <div>
                      <CopyField
                        label="Service name"
                        value={option.label}
                        onChange={(label) => change({ label })}
                        required
                      />
                      <CopyField
                        label="Summary"
                        value={option.summary}
                        onChange={(summary) => change({ summary })}
                        multiline
                        maxLength={1200}
                      />
                    </div>
                  </details>
                );
              })}
              {config.thirdPartyCosts.map((cost, index) => {
                const change = (patch: Partial<typeof cost>) =>
                  update({
                    thirdPartyCosts: config.thirdPartyCosts.map((item, i) =>
                      i === index ? { ...item, ...patch } : item,
                    ),
                  });
                return (
                  <details key={cost.id} className="proposal-copy-section">
                    <summary>{cost.label}</summary>
                    <div>
                      <CopyField
                        label="Cost name"
                        value={cost.label}
                        onChange={(label) => change({ label })}
                        required
                      />
                      <CopyField
                        label="Details"
                        value={cost.detail}
                        onChange={(detail) => change({ detail })}
                        multiline
                        maxLength={1200}
                        required
                      />
                    </div>
                  </details>
                );
              })}
              <details className="proposal-copy-section">
                <summary>
                  Closing note{config.previewImage ? " and image caption" : ""}
                </summary>
                <div>
                  <CopyField
                    label="Closing note"
                    value={config.closingNote}
                    onChange={(closingNote) => update({ closingNote })}
                    multiline
                    maxLength={2000}
                  />
                  {config.previewImage && (
                    <CopyField
                      label="Image caption"
                      value={config.previewCaption}
                      onChange={(previewCaption) => update({ previewCaption })}
                      multiline
                      maxLength={2000}
                    />
                  )}
                </div>
              </details>
            </fieldset>
          </form>
        )}
      </div>
    </main>
  );
}
