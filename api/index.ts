import type { IncomingMessage, ServerResponse } from "node:http";
import app from "./_lib/app.js";

console.log("[api] Function module loaded");

/**
 * Vercel Serverless Function handler.
 * Manually converts Node.js IncomingMessage → Web Request → Hono → Web Response → ServerResponse.
 * This avoids body-stream issues with the @hono/node-server/vercel adapter.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", `https://${req.headers.host ?? "localhost"}`);

  // Buffer body for methods that may have one
  let body: Buffer | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Buffer));
    }
    body = Buffer.concat(chunks);
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body,
  });

  const response = await app.fetch(request);

  const respHeaders: Record<string, string> = {};
  response.headers.forEach((v, k) => { respHeaders[k] = v; });
  res.writeHead(response.status, respHeaders);

  if (response.body) {
    res.end(Buffer.from(await response.arrayBuffer()));
  } else {
    res.end();
  }
}
