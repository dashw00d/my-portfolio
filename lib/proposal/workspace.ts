const ACCESS_KEY = "proposal-workspace-access-v1";

export function workspaceAccess(): string {
  try {
    return sessionStorage.getItem(ACCESS_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveWorkspaceAccess(token: string): void {
  try {
    if (token) sessionStorage.setItem(ACCESS_KEY, token);
    else sessionStorage.removeItem(ACCESS_KEY);
  } catch {
    // Access still works in this view when browser storage is unavailable.
  }
}

export interface ProposalListItem {
  id: string;
  title: string | null;
  clientName: string | null;
  status: "active" | "read_only" | "revoked";
  isExpired: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  lastSubmittedAt: string | null;
  expiresAt: string | null;
  responseCount: number;
  clientUrl: string | null;
  reviewUrl: string;
}
