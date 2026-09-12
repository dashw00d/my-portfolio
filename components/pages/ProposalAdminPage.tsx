import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Loader2,
  LogOut,
  PawPrint,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { PROPOSAL_CONFIG } from "@/lib/proposal/config";
import { proposalToken } from "@/lib/proposal/template";
import { saveWorkspaceAccess, workspaceAccess } from "@/lib/proposal/workspace";
import type { ProposalListItem } from "@/lib/proposal/workspace";

const statusNames = {
  active: "Active",
  read_only: "Read-only",
  expired: "Expired",
  revoked: "Revoked",
};
function statusOf(proposal: ProposalListItem): keyof typeof statusNames {
  return proposal.status === "revoked"
    ? "revoked"
    : proposal.isExpired
      ? "expired"
      : proposal.status;
}
function proposalName(proposal: ProposalListItem) {
  const legacy = proposal.id === PROPOSAL_CONFIG.id;
  return {
    title:
      proposal.title ?? (legacy ? PROPOSAL_CONFIG.title : "Untitled proposal"),
    client:
      proposal.clientName ??
      (legacy ? PROPOSAL_CONFIG.clientName : "Client not set"),
  };
}
function DateStamp({ value }: { value: string }) {
  const date = new Date(value);
  return (
    <time dateTime={value} title={date.toLocaleString()}>
      {date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </time>
  );
}

export default function ProposalAdminPage() {
  const [items, setItems] = useState<ProposalListItem[] | null>(null);
  const [access, setAccess] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("created");
  const [copied, setCopied] = useState("");
  const [manualLink, setManualLink] = useState("");
  const requestId = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  async function load(token: string) {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const request = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/proposal/api.php/admin?action=list", {
        headers: { "X-Proposal-Admin": token },
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 && request === requestId.current) {
          setItems(null);
          setAccess("");
          saveWorkspaceAccess("");
        }
        throw new Error(data.error ?? "Could not load proposals. Try again.");
      }
      if (request !== requestId.current) return;
      setItems(data.proposals);
      setAccess(token);
      saveWorkspaceAccess(token);
      const url = new URL(window.location.href);
      if (url.searchParams.has("admin")) {
        url.searchParams.delete("admin");
        window.history.replaceState(null, "", url);
      }
    } catch (error) {
      if (request === requestId.current && !controller.signal.aborted)
        setError(
          error instanceof Error
            ? error.message
            : "Could not load proposals. Try again.",
        );
    } finally {
      if (request === requestId.current) {
        setLoading(false);
        activeRequest.current = null;
      }
    }
  }

  useEffect(() => {
    const token = proposalToken(
      new URLSearchParams(window.location.search).get("admin") ??
        workspaceAccess(),
    );
    if (token) void load(token);
    else setLoading(false);
    return () => {
      requestId.current++;
      activeRequest.current?.abort();
      clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!access) return;
    const refresh = () => {
      if (!document.hidden && !activeRequest.current) void load(access);
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [access]);

  const visible = useMemo(
    () =>
      (items ?? [])
        .filter((proposal) => {
          const name = proposalName(proposal);
          return (
            (filter === "all" || statusOf(proposal) === filter) &&
            `${name.title} ${name.client}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())
          );
        })
        .sort((a, b) =>
          sort === "client"
            ? proposalName(a).client.localeCompare(proposalName(b).client)
            : Date.parse(sort === "activity" ? b.lastActivityAt : b.createdAt) -
              Date.parse(sort === "activity" ? a.lastActivityAt : a.createdAt),
        ),
    [items, query, filter, sort],
  );

  async function copy(path: string, key: string) {
    const url = new URL(path, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(key);
      setManualLink("");
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(""), 2000);
    } catch {
      setManualLink(url);
    }
  }

  return (
    <main className="proposal-shell proposal-admin min-h-screen">
      <nav className="proposal-topbar" aria-label="Proposal workspace">
        <a href="/proposal/" className="flex items-center gap-3 font-semibold">
          <PawPrint className="h-6 w-6 text-brand-600" />
          Ryan Stefan
        </a>
        {items !== null && (
          <button
            type="button"
            className="proposal-admin-text-action"
            onClick={() => {
              requestId.current++;
              activeRequest.current?.abort();
              activeRequest.current = null;
              saveWorkspaceAccess("");
              setAccess("");
              setDraft("");
              setItems(null);
              setError("");
              setManualLink("");
              setLoading(false);
            }}
          >
            <LogOut className="h-4 w-4" />
            Lock
          </button>
        )}
      </nav>
      <div className="proposal-admin-body">
        <header className="proposal-admin-heading">
          <h1>
            Proposals
            {items !== null && (
              <span className="ml-3 text-lg font-normal text-brand-700">
                {items.length}
              </span>
            )}
          </h1>
          {items !== null && (
            <a href="/proposal/new/?fresh=1" className="proposal-button">
              <Plus className="h-4 w-4" />
              New proposal
            </a>
          )}
        </header>
        {items === null ? (
          <form
            className="proposal-admin-access"
            onSubmit={(event) => {
              event.preventDefault();
              void load(proposalToken(draft));
            }}
          >
            <label
              htmlFor="workspace-access"
              className="mb-2 block text-sm font-semibold"
            >
              Owner admin link or access token
            </label>
            <input
              id="workspace-access"
              type="password"
              className="proposal-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              required
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="proposal-button mt-4"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Opening…" : "Open proposals"}
            </button>
            {error && (
              <p role="alert" className="mt-4 text-sm text-danger-700">
                {error}
              </p>
            )}
          </form>
        ) : (
          <>
            <div className="proposal-admin-filters">
              <label className="proposal-admin-search">
                <Search className="h-4 w-4" />
                <span className="sr-only">Find a proposal</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find a client or proposal"
                />
              </label>
              <label>
                <span className="sr-only">Status</span>
                <select
                  aria-label="Status"
                  className="proposal-input"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  <option value="all">All statuses</option>
                  {Object.entries(statusNames).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Sort proposals</span>
                <select
                  aria-label="Sort proposals"
                  className="proposal-input"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="created">Newest first</option>
                  <option value="activity">Recently active</option>
                  <option value="client">Client name</option>
                </select>
              </label>
              <button
                type="button"
                aria-label="Refresh proposals"
                className="proposal-admin-text-action"
                disabled={loading}
                onClick={() => void load(access)}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="proposal-admin-refresh-label">Refresh</span>
              </button>
            </div>
            {error && (
              <p role="alert" className="mb-5 text-sm text-danger-700">
                {error} The previous list is still shown.
              </p>
            )}
            {manualLink && (
              <label className="mb-5 block text-sm">
                Copy this link
                <input
                  className="proposal-input mt-2"
                  readOnly
                  value={manualLink}
                  onFocus={(event) => event.target.select()}
                />
              </label>
            )}
            <p className="sr-only" role="status">
              {visible.length} proposals shown{copied ? ". Link copied." : ""}
            </p>
            <div className="proposal-register-head" aria-hidden="true">
              <span>Client / proposal</span>
              <span>Status</span>
              <span>Created</span>
              <span>Latest activity</span>
              <span>Links</span>
            </div>
            <ul className="proposal-register" aria-label="Proposals">
              {visible.map((proposal) => {
                const name = proposalName(proposal);
                const status = statusOf(proposal);
                return (
                  <li className="proposal-register-row" key={proposal.id}>
                    <div className="proposal-register-name">
                      <a href={proposal.reviewUrl}>{name.client}</a>
                      <span>{name.title}</span>
                    </div>
                    <div>
                      <span
                        className={`proposal-register-status proposal-register-status--${status}`}
                        title={
                          proposal.expiresAt
                            ? `Link expires ${new Date(proposal.expiresAt).toLocaleString()}`
                            : undefined
                        }
                      >
                        {statusNames[status]}
                      </span>
                    </div>
                    <div className="proposal-register-date">
                      <span className="proposal-register-mobile-label">
                        Created
                      </span>
                      <DateStamp value={proposal.createdAt} />
                    </div>
                    <div className="proposal-register-date">
                      <span className="proposal-register-mobile-label">
                        Latest activity
                      </span>
                      <DateStamp value={proposal.lastActivityAt} />
                      <span
                        className="proposal-register-response"
                        title={
                          proposal.lastSubmittedAt
                            ? `Last response ${new Date(proposal.lastSubmittedAt).toLocaleString()}`
                            : undefined
                        }
                      >
                        {proposal.responseCount
                          ? `${proposal.responseCount} response${proposal.responseCount === 1 ? "" : "s"}`
                          : "No response yet"}
                      </span>
                    </div>
                    <div className="proposal-register-links">
                      <a
                        href={`/proposal/edit/?proposal=${encodeURIComponent(proposal.id)}`}
                        className="proposal-admin-text-action proposal-edit-link"
                      >
                        Edit copy
                      </a>
                      <a
                        href={proposal.reviewUrl}
                        className="proposal-admin-text-action"
                      >
                        Review
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        className="proposal-admin-copy"
                        onClick={() =>
                          void copy(proposal.reviewUrl, `${proposal.id}-review`)
                        }
                        aria-label={`Copy review link for ${name.client}`}
                        title="Copy review link (owner access required)"
                      >
                        {copied === `${proposal.id}-review` ? (
                          <Check />
                        ) : (
                          <Copy />
                        )}
                      </button>
                      {proposal.clientUrl ? (
                        <>
                          <a
                            href={proposal.clientUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="proposal-admin-text-action"
                          >
                            Client
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            className="proposal-admin-copy"
                            onClick={() =>
                              void copy(
                                proposal.clientUrl!,
                                `${proposal.id}-client`,
                              )
                            }
                            aria-label={`Copy client link for ${name.client}`}
                            title="Copy client link"
                          >
                            {copied === `${proposal.id}-client` ? (
                              <Check />
                            ) : (
                              <Copy />
                            )}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-brand-700">
                          Client link unavailable
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            {visible.length === 0 && (
              <div className="proposal-register-empty">
                <p>
                  {items.length
                    ? "No proposals match your search."
                    : "Your first proposal starts here."}
                </p>
                {items.length > 0 ? (
                  <button
                    type="button"
                    className="proposal-admin-text-action mt-3"
                    onClick={() => {
                      setQuery("");
                      setFilter("all");
                    }}
                  >
                    Clear filters
                  </button>
                ) : (
                  <a
                    className="proposal-button mt-4"
                    href="/proposal/new/?fresh=1"
                  >
                    New proposal
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
