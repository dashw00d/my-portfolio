import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.STATIC_ROOT || path.join(here, "out");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

function cacheControl(filePath) {
  const ext = path.extname(filePath);
  if (filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`)) {
    return "public, max-age=31536000, immutable";
  }
  if ([".css", ".js", ".mjs", ".woff", ".woff2", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico"].includes(ext)) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = path.posix.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "");
  const relative = clean === "/" ? "index.html" : clean.replace(/^\//, "");
  const candidates = [
    path.join(root, relative),
    path.join(root, relative, "index.html"),
    path.join(root, `${relative}.html`),
  ];

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (!resolved.startsWith(path.resolve(root))) {
      continue;
    }
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      return resolved;
    }
  }

  return null;
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function missingMailConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env;
  return !SMTP_HOST || !SMTP_PORT || !(SMTP_USER && SMTP_PASS) || !(CONTACT_TO || CONTACT_FROM || SMTP_USER);
}

async function handleContact(req, res) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
    if (Buffer.concat(chunks).length > 32_000) {
      sendJson(res, 413, { success: false, message: "Payload too large." });
      return;
    }
  }

  let formData;
  try {
    formData = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    sendJson(res, 400, { success: false, message: "Invalid JSON." });
    return;
  }

  const { name, email, company, project, timeline } = formData;
  if (!name || !email || !project) {
    sendJson(res, 422, {
      success: false,
      message: "Name, email, and project details are required.",
    });
    return;
  }

  if (missingMailConfig()) {
    console.warn("SMTP is not fully configured. Contact form submission was logged instead.");
    console.info({ name, email, company, project, timeline, submittedAt: new Date().toISOString() });
    sendJson(res, 200, {
      success: true,
      message: "Message received locally. Configure SMTP to forward it.",
    });
    return;
  }

  const defaultContactEmail = "ryan@dashwood.net";
  const recipient = process.env.CONTACT_TO || process.env.CONTACT_FROM || process.env.SMTP_USER || defaultContactEmail;
  const fromAddress = process.env.CONTACT_FROM || process.env.SMTP_USER || defaultContactEmail;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      bcc: process.env.CONTACT_BCC,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company ?? "--"}\nTimeline: ${timeline ?? "--"}\n\nProject details:\n${project}\n`,
      html: `<h2>New inquiry</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Company:</strong> ${company ?? "—"}</p><p><strong>Timeline:</strong> ${timeline ?? "—"}</p><p>${String(project).replace(/</g, "&lt;")}</p>`,
    });

    sendJson(res, 200, { success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact form mail error:", error);
    sendJson(res, 500, { success: false, message: "Failed to send email." });
  }
}

const server = http.createServer(async (req, res) => {
  const url = req.url || "/";

  if (req.method === "POST" && url.split("?")[0] === "/api/contact") {
    await handleContact(req, res);
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD, POST" });
    res.end();
    return;
  }

  const filePath = resolveFile(url);
  if (!filePath) {
    const fallback = resolveFile("/404") || resolveFile("/404.html");
    if (fallback) {
      const body = fs.readFileSync(fallback);
      res.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Length": body.length,
      });
      res.end(req.method === "HEAD" ? undefined : body);
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const body = fs.readFileSync(filePath);
  res.writeHead(200, {
    "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
    "Cache-Control": cacheControl(filePath),
    "Content-Length": body.length,
  });
  res.end(req.method === "HEAD" ? undefined : body);
});

server.listen(port, host, () => {
  console.log(`dashwood static server listening on ${host}:${port} from ${root}`);
});
