import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react";

import { PROPOSAL_CONFIG, type ProposalConfig } from "@/lib/proposal/config";
import type {
  ProposalState,
  SubmittedResponseSnapshot,
} from "@/lib/proposal/types";
import ProposalPage from "./ProposalPage";

interface ReviewData {
  config: ProposalConfig | null;
  clientPath: string;
  state: ProposalState;
  clientToken: string | null;
  submissions: SubmittedResponseSnapshot[];
  status: "active" | "read_only" | "revoked";
  isExpired: boolean;
}

function tokenFromInput(value: string) {
  const trimmed = value.trim().replace(/[).,]+$/, "");
  try {
    return new URL(trimmed).searchParams.get("admin") ?? trimmed;
  } catch {
    return trimmed;
  }
}

export default function ProposalReviewPage() {
  const [adminToken, setAdminToken] = useState("");
  const [tokenDraft, setTokenDraft] = useState("");
  const [data, setData] = useState<ReviewData | null>(null);
  const [snapshotId, setSnapshotId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setAdminToken(
      tokenFromInput(
        new URLSearchParams(window.location.search).get("admin") ?? "",
      ),
    );
  }, []);

  useEffect(() => {
    if (!adminToken) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    async function refresh() {
      setLoading(true);
      try {
        const response = await fetch("/proposal/api.php/review", {
          headers: { "X-Proposal-Admin": adminToken },
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result?.error ?? "Unable to load the proposal.");
        if (controller.signal.aborted) return;
        setData(result);
        setError("");
      } catch (error) {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error
              ? error.message
              : "Connection lost. Retrying…",
          );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          timer = setTimeout(() => {
            void refresh();
          }, 4000);
        }
      }
    }
    void refresh();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [adminToken, refreshKey]);

  async function setProposalStatus(status: ReviewData["status"]) {
    setSaving(true);
    try {
      const response = await fetch(
        "/proposal/api.php/admin?action=set_status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Proposal-Admin": adminToken,
          },
          body: JSON.stringify({ status }),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result?.error ?? "Unable to change access.");
      setRefreshKey((previous) => previous + 1);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to change access.",
      );
    } finally {
      setSaving(false);
    }
  }

  const snapshot = data?.submissions.find(
    (submission) => submission.id === snapshotId,
  );
  const clientUrl = data?.clientToken
    ? `${data.clientPath ?? "/p/southern-star/"}?token=${encodeURIComponent(data.clientToken)}`
    : "";
  const buttonClass =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-900 hover:bg-brand-50 disabled:opacity-50";

  async function copyClientLink() {
    try {
      await navigator.clipboard.writeText(
        new URL(clientUrl, window.location.origin).href,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy. Use Open client view to get the link.");
    }
  }

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-brand-50 px-5 text-brand-950">
        <form
          className="proposal-panel w-full max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            setAdminToken(tokenFromInput(tokenDraft));
            setRefreshKey((previous) => previous + 1);
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Proposal studio
          </p>
          <h1 className="mt-4 text-3xl font-bold">Open a proposal</h1>
          {loading && !error ? (
            <p className="mt-6 flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Opening the client’s proposal…
            </p>
          ) : (
            <>
              <label
                htmlFor="review-token"
                className="mt-7 block text-sm font-semibold"
              >
                Admin link or access token
              </label>
              <input
                id="review-token"
                type="password"
                value={tokenDraft}
                onChange={(event) => setTokenDraft(event.target.value)}
                required
                className="proposal-input mt-3"
              />
              <button type="submit" className={`${buttonClass} mt-6 w-full`}>
                Open review
              </button>
            </>
          )}
          {error && (
            <p role="alert" className="mt-4 text-sm text-danger-700">
              {error}
            </p>
          )}
        </form>
      </main>
    );
  }

  return (
    <ProposalPage
      initialConfig={snapshot?.config ?? data.config ?? PROPOSAL_CONFIG}
      review={{
        clientPath: data.clientPath ?? "/p/southern-star/",
        state: snapshot?.state ?? data.state,
        clientToken: data.clientToken ?? "",
        toolbar: (
          <section
            aria-label="Review controls"
            className="proposal-workspace mb-8 rounded-2xl border border-brand-800 p-6 text-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">
                  Proposal studio
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm">
                  <span
                    className={`h-2 w-2 rounded-full ${error ? "bg-warning-500" : "bg-success-500"}`}
                  />
                  {snapshot
                    ? "Submitted proposal"
                    : error
                      ? "Reconnecting to the client’s proposal"
                      : "Live · follows the client’s changes"}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/proposal/new/?admin=${encodeURIComponent(adminToken)}`}
                  className={buttonClass}
                >
                  <Plus className="h-4 w-4" />
                  New proposal
                </a>
                <button
                  type="button"
                  onClick={() => setRefreshKey((previous) => previous + 1)}
                  className={buttonClass}
                  aria-label="Refresh proposal"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => void copyClientLink()}
                  disabled={!clientUrl}
                  className={buttonClass}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Client link"}
                </button>
                {clientUrl && (
                  <a
                    href={clientUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonClass}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open client view
                  </a>
                )}
              </div>
            </div>
            {error && (
              <p role="alert" className="mt-3 text-sm text-warning-200">
                {error} Showing the last saved proposal.
              </p>
            )}
            {snapshot && (
              <button
                type="button"
                onClick={() => setSnapshotId("")}
                className="mt-3 text-sm font-semibold underline underline-offset-4"
              >
                Return to live proposal
              </button>
            )}
          </section>
        ),
        response: (
          <section className="proposal-panel">
            <h2 className="text-xl font-bold text-brand-950">
              Client responses
            </h2>
            {(snapshot?.displayName || data.state.selections.displayName) && (
              <p className="mt-3 text-sm text-brand-700">
                From{" "}
                {snapshot
                  ? snapshot.displayName || "the client"
                  : data.state.selections.displayName}
              </p>
            )}
            <label
              htmlFor="proposal-version"
              className="mt-6 block text-sm font-semibold text-brand-700"
            >
              Viewing
            </label>
            <select
              id="proposal-version"
              value={snapshot?.id ?? ""}
              onChange={(event) => setSnapshotId(event.target.value)}
              className="proposal-input mt-3"
            >
              <option value="">Live proposal</option>
              {data.submissions.map((submission) => (
                <option key={submission.id} value={submission.id}>
                  {submission.displayName || "Client"} ·{" "}
                  {new Date(submission.submittedAt).toLocaleString()}
                </option>
              ))}
            </select>
            <p className="mt-4 text-sm text-brand-900/75">
              {data.submissions.length
                ? `${data.submissions.length} submitted response${data.submissions.length === 1 ? "" : "s"}. Choose one to see the proposal exactly as submitted.`
                : "No response submitted yet. Saved choices and drawings appear here as the client makes them."}
            </p>
            <details className="mt-6 border-t border-brand-100 pt-6">
              <summary className="cursor-pointer text-sm font-semibold text-brand-900">
                Link access ·{" "}
                {data.isExpired ? "expired" : data.status.replace("_", " ")}
              </summary>
              <div className="mt-4 grid gap-3">
                {(
                  [
                    ["active", "Reopen"],
                    ["read_only", "Make read-only"],
                    ["revoked", "Revoke link"],
                  ] as const
                ).map(([status, label]) => (
                  <button
                    key={status}
                    type="button"
                    disabled={saving || data.status === status}
                    onClick={() => void setProposalStatus(status)}
                    className={buttonClass}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </details>
          </section>
        ),
      }}
    />
  );
}
