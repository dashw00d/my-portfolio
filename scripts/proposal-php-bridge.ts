import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";

async function availablePort(): Promise<number> {
  const server = createServer();
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not allocate the proposal PHP port."));
        return;
      }
      server.close((error) => error ? reject(error) : resolve(address.port));
    });
  });
}

// Keep the local PHP runtime warm instead of loading every extension per save.
// Production continues to use the host's PHP-FPM pool.
export function createProposalPhpBridge(root: string) {
  let worker: ChildProcess | null = null;
  let starting: Promise<number> | null = null;
  let closed = false;

  async function start(): Promise<number> {
    const port = await availablePort();
    if (closed) throw new Error("Proposal PHP server is closed.");
    return new Promise((resolve, reject) => {
      const child = spawn("php", ["-S", `127.0.0.1:${port}`, path.join(root, "public/proposal/api.php")], {
        cwd: root,
        env: process.env,
        stdio: ["ignore", "ignore", "pipe"],
      });
      worker = child;
      let output = "";
      const timeout = setTimeout(() => {
        child.kill();
        reject(new Error("The local proposal PHP server did not start."));
      }, 30_000);
      child.stderr?.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        output = (output + text).slice(-8000);
        if (/Development Server .* started/.test(output)) {
          clearTimeout(timeout);
          resolve(port);
        }
        if (/PHP (?:Warning|Fatal error|Parse error)/.test(text)) process.stderr.write(text);
      });
      child.once("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      child.once("exit", () => {
        clearTimeout(timeout);
        if (worker === child) {
          worker = null;
          starting = null;
        }
        reject(new Error("The local proposal PHP server stopped."));
      });
    });
  }

  function ready(): Promise<number> {
    if (closed) return Promise.reject(new Error("Proposal PHP server is closed."));
    if (!starting) {
      const pending = start();
      starting = pending;
      void pending.catch(() => { if (starting === pending) starting = null; });
    }
    return starting;
  }

  // Start alongside Vite so the first page request rarely needs to wait for PHP.
  void ready().catch(() => {});
  return {
    ready,
    close() {
      closed = true;
      worker?.kill();
      worker = null;
    },
  };
}
