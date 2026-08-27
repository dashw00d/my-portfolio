import { useCallback, useEffect, useState } from "react";

export interface QueryMap {
  q: string;
  tag: string;
  page: string;
}

function readQuery(): QueryMap {
  if (typeof window === "undefined") {
    return { q: "", tag: "", page: "" };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get("q") || "",
    tag: params.get("tag") || "",
    page: params.get("page") || "",
  };
}

export function useShallowQuery() {
  const [query, setQuery] = useState<QueryMap>({ q: "", tag: "", page: "" });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setQuery(readQuery());
    setIsReady(true);

    const onPop = () => setQuery(readQuery());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const replaceQuery = useCallback((next: Partial<QueryMap>) => {
    const params = new URLSearchParams();
    (["q", "tag", "page"] as const).forEach((key) => {
      const value = next[key] || "";
      if (value) params.set(key, value);
    });

    const qs = params.toString();
    const path = window.location.pathname;
    const url = qs ? `${path}?${qs}` : path;
    const current = `${path}${window.location.search}`;
    if (url === current) return;

    window.history.replaceState(null, "", url);
    setQuery({
      q: params.get("q") || "",
      tag: params.get("tag") || "",
      page: params.get("page") || "",
    });
  }, []);

  return { query, isReady, replaceQuery };
}
