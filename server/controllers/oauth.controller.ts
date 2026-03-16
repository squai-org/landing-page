import type { Context } from "hono";
import { CALENDAR_SCOPE } from "../config/env.js";
import {
  getOAuthConfig,
  getOAuthRedirectUri,
  createOAuthClient,
  createSignedState,
  verifySignedState,
} from "../config/google.js";
import { HttpStatus, ErrorCode } from "../config/constants.js";
import { getErrorMessage } from "../utils/index.js";

/** Handles GET /api/oauth/google/start — initiates the OAuth2 consent flow. */
export async function handleOAuthStart(c: Context) {
  try {
    const oauthClient = createOAuthClient();
    if (!oauthClient) {
      return c.json(
        {
          error: ErrorCode.OAUTH_NOT_CONFIGURED,
          message: "Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const authUrl = oauthClient.generateAuthUrl({
      access_type: "offline",
      include_granted_scopes: true,
      prompt: "consent",
      scope: [CALENDAR_SCOPE],
      state: createSignedState(),
    });

    return c.redirect(authUrl, 302);
  } catch (err: unknown) {
    console.error("[oauth-start] Error:", getErrorMessage(err));
    return c.json({ error: ErrorCode.SERVER_ERROR }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/** Handles GET /api/oauth/google/callback — exchanges the authorization code for tokens. */
export async function handleOAuthCallback(c: Context) {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const oauthError = c.req.query("error");

  if (oauthError) {
    return c.json({ error: ErrorCode.OAUTH_ERROR, message: oauthError }, HttpStatus.BAD_REQUEST);
  }
  if (!code) {
    return c.json({ error: ErrorCode.VALIDATION, message: "Missing code" }, HttpStatus.BAD_REQUEST);
  }
  if (!verifySignedState(state)) {
    return c.json({ error: ErrorCode.VALIDATION, message: "Invalid or expired state" }, HttpStatus.BAD_REQUEST);
  }

  try {
    const oauthClient = createOAuthClient();
    if (!oauthClient) {
      return c.json(
        {
          error: ErrorCode.OAUTH_NOT_CONFIGURED,
          message: "Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { tokens } = await oauthClient.getToken(code);
    if (!tokens.refresh_token) {
      return c.json(
        {
          error: ErrorCode.MISSING_REFRESH_TOKEN,
          message:
            "No refresh token returned. Re-run consent with prompt=consent and access_type=offline.",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return c.json({
      success: true,
      message: "Store GOOGLE_OAUTH_REFRESH_TOKEN in your environment.",
      refreshToken: tokens.refresh_token,
      scope: tokens.scope,
      expiryDate: tokens.expiry_date,
    });
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("[oauth-callback] Error:", message);
    return c.json({ error: ErrorCode.OAUTH_EXCHANGE_FAILED, message }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/** Handles GET /api/oauth/google/status — reports current OAuth configuration state. */
export function handleOAuthStatus(c: Context) {
  const { clientId, clientSecret, refreshToken, redirectBaseUrl, stateSecret } =
    getOAuthConfig();
  return c.json({
    oauthClientConfigured: Boolean(clientId && clientSecret),
    oauthRefreshTokenConfigured: Boolean(refreshToken),
    oauthStateConfigured: Boolean(stateSecret),
    redirectUri: getOAuthRedirectUri(redirectBaseUrl),
  });
}
