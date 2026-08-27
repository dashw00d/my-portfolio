import { spawn } from "node:child_process";
import path from "node:path";

const CONTACT_PATHS = new Set(["/api/contact.php", "/api/contact.php/"]);

function attachPhpContact(server, root) {
  const script = path.join(root, "public/api/contact.php");

  server.middlewares.use((req, res, next) => {
    const url = (req.url || "").split("?")[0];
    if (!CONTACT_PATHS.has(url)) {
      next();
      return;
    }

    const chunks = [];
    let total = 0;

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > 32_000) {
        res.statusCode = 413;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ success: false, message: "Payload too large." }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      const body = Buffer.concat(chunks);
      const child = spawn("php", [script], {
        env: {
          ...process.env,
          REQUEST_METHOD: req.method || "GET",
          CONTENT_TYPE: req.headers["content-type"] || "application/json",
          CONTENT_LENGTH: String(body.length),
          REMOTE_ADDR: req.socket?.remoteAddress || "127.0.0.1",
        },
      });

      const stdout = [];
      child.stdout.on("data", (data) => stdout.push(data));
      child.stderr.on("data", (data) => process.stderr.write(data));
      child.stdin.end(body);

      child.on("error", (error) => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(
          JSON.stringify({
            success: false,
            message: `PHP is not available (${error.message}).`,
          })
        );
      });

      child.on("close", () => {
        const raw = Buffer.concat(stdout).toString("utf8");
        const match = raw.match(/^HTTP (\d+)\n([\s\S]*)$/);
        const status = match ? Number(match[1]) : 200;
        const payload = match ? match[2] : raw || '{"success":false,"message":"Empty PHP response."}';
        res.statusCode = Number.isFinite(status) ? status : 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(payload);
      });
    });
  });
}

export function phpContactPlugin(root) {
  return {
    name: "php-contact",
    configureServer(server) {
      attachPhpContact(server, root);
    },
    configurePreviewServer(server) {
      attachPhpContact(server, root);
    },
  };
}
