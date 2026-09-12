import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Loader2, Lock, Send, ShieldCheck } from "lucide-react";

import { PROPOSAL_CONFIG as config } from "@/lib/proposal/config";
import type { ProposalState, SubmittedResponseSnapshot } from "@/lib/proposal/types";

type ReviewStatus = "loading" | "ready" | "error";

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function ProposalReviewPage() {
  const [adminToken, setAdminToken] = useState("");
  const [state, setState] = useState<ProposalState | null>(null);
  const [revision, setRevision] = useState(1);
  const [submissions, setSubmissions] = useState<SubmittedResponseSnapshot[]>([]);
  const [status, setStatus] = useState<ReviewStatus>("loading");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadReview = async (token: string) => {
    setStatus("loading");
    const response = await fetch(`/proposal/api.php/review?admin=${encodeURIComponent(token)}`);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setMessage(result?.error ?? "Unable to load proposal.");
      return;
    }
    setState({ ...result.state });
    setRevision(result.revision ?? 1);
    setSubmissions(result.submissions ?? []);
    setStatus("ready");
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("admin");
    if (token) {
      setAdminToken(token);
      void loadReview(token);
    } else {
      setStatus("ready");
    }
  }, []);

  const selectedOneTime = useMemo(
    () => config.oneTimeOptions.filter((option) => state?.selections.oneTimeOptionIds.includes(option.id) ?? false),
    [state]
  );
  const selectedRecurring = useMemo(
    () => config.recurringOptions.filter((option) => state?.selections.recurringOptionIds.includes(option.id) ?? false),
    [state]
  );

  const oneTimeTotal =
    (state?.selections.baseSelected ? config.baseOption.price : 0) +
    selectedOneTime.reduce((sum, option) => sum + option.price, 0);

  async function setProposalStatus(nextStatus: "active" | "read_only" | "revoked") {
    if (!adminToken) {
      setMessage("Enter the admin token first.");
      return;
    }
    setSaving(true);
    const response = await fetch(`/proposal/api.php/admin?admin=${encodeURIComponent(adminToken)}&action=set_status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const result = await response.json().catch(() => ({}));
    setSaving(false);
    setMessage(response.ok ? `Proposal is now ${nextStatus.replace("_", " ")}.` : result?.error ?? "Unable to update.");
  }

  async function replyToThread(threadId: string) {
    if (!state || !adminToken) return;
    const body = window.prompt("Reply to this note:");
    if (!body?.trim()) return;

    const nextState: ProposalState = {
      ...state,
      threads: state.threads.map((thread) =>
        thread.id === threadId
          ? { ...thread, replies: [...thread.replies, { author: "ryan", body: body.trim(), createdAt: new Date().toISOString(), resolved: false }] }
          : thread
      ),
    };

    setSaving(true);
    const response = await fetch(`/proposal/api.php/review?admin=${encodeURIComponent(adminToken)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revision, state: nextState }),
    });
    const result = await response.json().catch(() => ({}));
    setSaving(false);
    if (response.ok) {
      setState(nextState);
      setRevision(result.revision ?? revision + 1);
      setMessage("Reply saved.");
    } else {
      setMessage(result?.error ?? "Unable to save reply.");
    }
  }

  function copyClientLink() {
    const token = "default-client-token";
    const url = `${window.location.origin}/p/southern-star/?token=${encodeURIComponent(token)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-200"><ShieldCheck className="h-4 w-4" />Protected review</p>
            <h1 className="mt-2 text-3xl font-bold">Southern Star proposal</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              value={adminToken}
              onChange={(event) => setAdminToken(event.target.value)}
              placeholder="Admin token"
              className="w-56 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm"
            />
            <button type="button" onClick={() => void loadReview(adminToken)} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white">Load</button>
            <button type="button" onClick={copyClientLink} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold"><Copy className="h-4 w-4" />Client link</button>
          </div>
        </div>

        {copied && <p className="mt-3 text-sm text-success-300">Client link copied.</p>}
        {message && <p className="mt-4 rounded-xl border border-brand-500/40 bg-brand-500/10 px-4 py-3 text-sm text-brand-100">{message}</p>}

        {status === "loading" && <p className="mt-8 flex items-center gap-2 text-brand-200"><Loader2 className="h-5 w-5 animate-spin" />Loading proposal…</p>}
        {status === "error" && <p className="mt-8 rounded-2xl border border-danger-500/40 bg-danger-500/10 p-5 text-danger-100">{message}</p>}

        {status === "ready" && (
          <>
            {state ? (
              <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section className="space-y-6">
                  <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-bold">Current selections</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white/5 p-5">
                        <p className="text-sm font-semibold text-brand-200">One-time total</p>
                        <p className="mt-2 text-3xl font-black">{formatMoney(oneTimeTotal)}</p>
                        <p className="mt-2 text-sm text-zinc-400">{state.selections.baseSelected ? "Core rebuild included" : "Core rebuild off"}</p>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-5">
                        <p className="text-sm font-semibold text-brand-200">Optional recurring</p>
                        <p className="mt-2 text-3xl font-black">{formatMoney(selectedRecurring.reduce((sum, option) => sum + option.price, 0))}</p>
                        <p className="mt-2 text-sm text-zinc-400">{selectedRecurring.length} selected</p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                      {selectedOneTime.map((option) => (
                        <span key={option.id} className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-brand-100">{option.label} · {formatMoney(option.price)}</span>
                      ))}
                      {selectedRecurring.map((option) => (
                        <span key={option.id} className="rounded-full border border-highlight-500/30 bg-highlight-500/10 px-3 py-1.5 text-highlight-100">{option.label} · {formatMoney(option.price)}</span>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-bold">Client notes</h2>
                    {Object.entries(state.selections.sectionFeedback).filter(([, value]) => value.comment.trim() || value.status).length === 0 && (
                      <p className="mt-4 text-sm text-zinc-400">No section notes yet.</p>
                    )}
                    <div className="mt-5 space-y-4">
                      {Object.entries(state.selections.sectionFeedback).filter(([, value]) => value.comment.trim() || value.status).map(([sectionId, value]) => {
                        const section = config.sections.find((item) => item.id === sectionId);
                        return (
                          <div key={sectionId} className="rounded-2xl bg-white/5 p-5">
                            <p className="text-sm font-semibold text-brand-200">{section?.title ?? sectionId}</p>
                            <p className="mt-2 text-sm text-zinc-200">{value.comment || "No comment"}</p>
                            {value.status && <p className="mt-2 text-xs uppercase tracking-wide text-success-300">{value.status.replace("_", " ")}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </article>

                  <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-bold">Submitted responses</h2>
                    {submissions.length === 0 && <p className="mt-4 text-sm text-zinc-400">No snapshots submitted yet.</p>}
                    <div className="mt-5 space-y-4">
                      {submissions.map((submission) => (
                        <div key={submission.id} className="rounded-2xl bg-white/5 p-5">
                          <p className="text-sm font-semibold text-brand-200">{submission.displayName || "Unnamed"} · {formatDate(submission.submittedAt)}</p>
                          <p className="mt-2 text-xs text-zinc-400">Proposal version {submission.configVersion}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>

                <aside className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-lg font-bold">Link controls</h2>
                    <div className="mt-4 space-y-3">
                      <button type="button" disabled={saving} onClick={() => void setProposalStatus("active")} className="w-full rounded-xl bg-success-600 px-4 py-2.5 text-sm font-semibold">Reopen</button>
                      <button type="button" disabled={saving} onClick={() => void setProposalStatus("read_only")} className="w-full rounded-xl bg-warning-600 px-4 py-2.5 text-sm font-semibold">Make read-only</button>
                      <button type="button" disabled={saving} onClick={() => void setProposalStatus("revoked")} className="w-full rounded-xl bg-danger-600 px-4 py-2.5 text-sm font-semibold">Revoke</button>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-lg font-bold">Notes</h2>
                    <p className="mt-3 text-sm text-zinc-400">Replies and status controls are server-side. The client link stays revocable.</p>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-300">
                <Lock className="h-6 w-6" />
                <p className="mt-4 text-sm">Enter the admin token and press Load.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
