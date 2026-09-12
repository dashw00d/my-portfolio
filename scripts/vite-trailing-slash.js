const SKIP_PREFIXES = ["/@", "/node_modules", "/api/"];
const HAS_EXTENSION = /\.[a-zA-Z0-9]+$/;

function isHtmlNavigation(req) {
  const accept = req.headers.accept || "";
  return accept.includes("text/html");
}

const middleware = (req, res, next) => {
  const method = req.method || "GET";
  if (method !== "GET" && method !== "HEAD") {
    next();
    return;
  }

  if (!req.url || !isHtmlNavigation(req)) {
    next();
    return;
  }

  const queryIndex = req.url.indexOf("?");
  const rawPath = queryIndex === -1 ? req.url : req.url.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : req.url.slice(queryIndex);
  if (rawPath === "/" || rawPath.endsWith("/")) {
    next();
    return;
  }

  if (SKIP_PREFIXES.some((prefix) => rawPath.startsWith(prefix))) {
    next();
    return;
  }

  if (HAS_EXTENSION.test(rawPath)) {
    next();
    return;
  }

  res.statusCode = 302;
  res.setHeader("Location", `${rawPath}/${query}`);
  res.end();
};

export function trailingSlashRedirectPlugin() {
  return {
    name: "trailing-slash-redirect",
    enforce: "post",
    configureServer(server) {
      // Astro prepends its slash validation in a post-configure hook.
      // Run after that hook and place the redirect ahead of the validation.
      return () => {
        server.middlewares.stack.unshift({ route: "", handle: middleware });
      };
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
