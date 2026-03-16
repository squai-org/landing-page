import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { google } from "googleapis";
import { CALENDAR_SCOPE } from "./env.js";
import type { OAuthConfig } from "../types/index.js";

/** Reads Google OAuth2 credentials from environment variables. */
export function getOAuthConfig(): OAuthConfig {
  return {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() ?? "",
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() ?? "",
    refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim() ?? "",
    redirectBaseUrl: process.env.GOOGLE_OAUTH_REDIRECT_BASE_URL?.trim() ?? "",
    stateSecret:
      process.env.GOOGLE_OAUTH_STATE_SECRET?.trim() ??
      process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() ??
      "",
  };
}

/** Constructs the full OAuth callback URL from a base URL. */
export function getOAuthRedirectUri(baseUrl: string): string {
  const base = new URL(baseUrl);
  return new URL("/api/oauth/google/callback", base).toString();
}

/** Creates a Google OAuth2 client. Returns `null` if credentials are missing. */
export function createOAuthClient(options?: {
  includeRefreshToken?: boolean;
  requireRefreshToken?: boolean;
}) {
  const { clientId, clientSecret, refreshToken, redirectBaseUrl } = getOAuthConfig();

  if (!clientId || !clientSecret) return null;
  if (options?.requireRefreshToken && !refreshToken) return null;

  const client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    getOAuthRedirectUri(redirectBaseUrl),
  );

  if (options?.includeRefreshToken && refreshToken) {
    client.setCredentials({ refresh_token: refreshToken });
  }

  return client;
}

/** Creates an HMAC-signed state token for OAuth CSRF protection (15-min expiry). */
export function createSignedState(): string {
  const { stateSecret } = getOAuthConfig();
  if (!stateSecret) {
    throw new Error("GOOGLE_OAUTH_STATE_SECRET (or GOOGLE_OAUTH_CLIENT_SECRET) is required");
  }

  const payload = JSON.stringify({
    n: randomBytes(12).toString("hex"),
    iat: Date.now(),
  });
  const encodedPayload = Buffer.from(payload, "utf8").toString("base64url");
  const signature = createHmac("sha256", stateSecret)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

/** Verifies an OAuth state token's HMAC signature and checks it hasn't expired. */
export function verifySignedState(state: string | undefined): boolean {
  if (!state) return false;
  const { stateSecret } = getOAuthConfig();
  if (!stateSecret) return false;

  const parts = state.split(".");
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  const expected = createHmac("sha256", stateSecret)
    .update(encodedPayload)
    .digest("base64url");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as { iat?: number };
    if (typeof payload.iat !== "number") return false;
    const maxAgeMs = 15 * 60 * 1000;
    return Date.now() - payload.iat <= maxAgeMs;
  } catch {
    return false;
  }
}

function getServiceAccountCalendarClient() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const impersonateUser = process.env.GOOGLE_CALENDAR_IMPERSONATE_USER?.trim();

  if (!keyPath && !keyJson) {
    throw new Error("Set GOOGLE_SERVICE_ACCOUNT_KEY_FILE or GOOGLE_SERVICE_ACCOUNT_KEY");
  }

  let credentials: Record<string, unknown>;
  try {
    credentials = keyPath
      ? JSON.parse(readFileSync(resolve(keyPath), "utf-8"))
      : JSON.parse(keyJson as string);
  } catch (e) {
    throw new Error(
      `Failed to parse service account JSON: ${e instanceof Error ? e.message : e}`,
    );
  }

  if (typeof credentials.private_key === "string") {
    credentials.private_key = credentials.private_key.replaceAll(
      String.raw`\n`,
      String.raw`
`,
    );
  }

  const scopes = [CALENDAR_SCOPE];
  let auth;

  if (impersonateUser) {
    const clientEmail = credentials.client_email;
    const privateKey = credentials.private_key;

    if (typeof clientEmail !== "string" || typeof privateKey !== "string") {
      throw new TypeError(
        "Service account JSON must include client_email and private_key",
      );
    }

    auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes,
      subject: impersonateUser,
    });
  } else {
    auth = new google.auth.GoogleAuth({ credentials, scopes });
  }

  return google.calendar({ version: "v3", auth });
}

/** Returns a Google Calendar API client, preferring OAuth over service account. */
export function getCalendarClient() {
  const oauthClient = createOAuthClient({
    includeRefreshToken: true,
    requireRefreshToken: true,
  });
  if (oauthClient) {
    return google.calendar({ version: "v3", auth: oauthClient });
  }
  return getServiceAccountCalendarClient();
}
