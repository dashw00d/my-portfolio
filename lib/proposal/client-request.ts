declare global {
  interface Window {
    __proposalPreload?: {
      token: string;
      controller: AbortController;
      response: Promise<Response | null>;
    };
  }
}

export async function requestClientProposal(token: string, signal: AbortSignal): Promise<Response> {
  const preload = window.__proposalPreload;
  delete window.__proposalPreload;
  if (preload?.token === token) {
    const abort = () => preload.controller.abort();
    signal.addEventListener("abort", abort, { once: true });
    try {
      signal.throwIfAborted();
      const response = await preload.response;
      signal.throwIfAborted();
      if (response) return response;
    } finally {
      signal.removeEventListener("abort", abort);
    }
  } else {
    preload?.controller.abort();
  }
  return fetch(`/proposal/api.php?token=${encodeURIComponent(token)}`, { signal });
}
