import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../server/app.js";

async function bufferBody(req: IncomingMessage): Promise<Uint8Array | undefined> {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Buffer));
  }
  return new Uint8Array(Buffer.concat(chunks));
}

function buildHeaders(raw: IncomingMessage["headers"]): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(raw)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  return headers;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", `https://${req.headers.host ?? "localhost"}`);
  const body = await bufferBody(req);

  const request = new Request(url.toString(), {
    method: req.method,
    headers: buildHeaders(req.headers),
    body: body as BodyInit | undefined,
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
