# Google sign-in for StreakIn

Status: setup specification prepared; Google sign-in is **not enabled**. No OAuth client has been registered, and the current Sites prototype stores profiles and training data on the device. This document targets the final Jagoan Hosting / Webuzo deployment, not a second login system inside Sites.

## 1. Register the Google application

In [Google Cloud Console](https://console.cloud.google.com/), create or select a project dedicated to StreakIn. Open **Google Auth Platform**:

1. Branding: application name `StreakIn`; choose your support email and developer contact. Use public, working homepage, privacy-policy and terms URLs on `https://streakin.my.id` before making the consent screen public. Do not invent policy URLs that return 404.
2. Audience: External, unless intentionally restricted to a Google Workspace organization. While testing, add the Google accounts that will test login.
3. Data Access: request only `openid`, `email`, and `profile`. Signing in does not require Drive, Gmail, Calendar, or offline access.
4. Clients: create an OAuth client with application type **Web application**, named `StreakIn production`.
5. For the planned server authorization-code flow, add this exact **Authorized redirect URI**:

   `https://streakin.my.id/api/auth/google/callback`

   The callback is a future server endpoint; it does not exist in the static prototype yet. No `/#/` fragment belongs in an OAuth callback. Only add `https://streakin.my.id` as an Authorized JavaScript origin if the chosen integration uses Google's browser SDK; the server redirect flow alone does not require it. Add `www` or staging origins only when those hosts actually serve the app, with matching explicit callbacks.
6. Save the public Client ID. Put the client secret directly into the server's environment settings; never send it in chat or commit it. Use a separate client for local development, with the actual development server's callback, rather than adding arbitrary localhost URLs to production.

## 2. Server environment on Webuzo

Confirm the hosting plan supports a persistent Node.js application (or choose an equivalent supported server stack) and HTTPS before implementing the callback. Uploading the current `dist/` files alone cannot implement secure Google sign-in.

| Server variable | Intended value |
| --- | --- |
| `APP_ORIGIN` | `https://streakin.my.id` |
| `GOOGLE_CLIENT_ID` | Client ID from Google Console |
| `GOOGLE_CLIENT_SECRET` | Server-only client secret from Google Console |
| `GOOGLE_REDIRECT_URI` | `https://streakin.my.id/api/auth/google/callback` |
| `SESSION_SECRET` | Cryptographically random server-only session signing secret |

These are planned configuration names, not variables read by the current Vite prototype. Do not prefix secrets with `VITE_`, place them in public assets, or expose them through an API. Store production sessions and user-owned training records in the server database.

## 3. Required application behavior

- `GET /api/auth/google/start`: generate short-lived, single-use state, nonce, and PKCE verifier; keep them bound to a secure browser session. Redirect to Google using the registered callback and minimal scopes. Only accept allowlisted same-origin return paths.
- `GET /api/auth/google/callback`: handle refusal and expired requests; compare state, exchange the code on the server, and verify the ID token's signature, issuer, audience, expiry and nonce through Google's maintained library. Require verified email if email verification is part of account policy. Use Google's stable `sub` identifier as the provider identity; email alone must not trigger automatic account linking.
- Create or find the associated StreakIn user, rotate the session, and issue a `Secure`, `HttpOnly`, `SameSite=Lax` session cookie. Return to `/home` in the deployed application's routing scheme. Never put access tokens or client secrets in localStorage or redirect URLs.
- Authorize every library, progress and workout request by the authenticated server user. Remove or explicitly disable the prototype's local API interception in the production build; otherwise it would bypass the real backend.
- Offer importing device-local training records only after login and explicit user choice. Validate imported records server-side and make repeated imports idempotent. A local password/profile is not proof of ownership of a cloud account.
- Make logout invalidate the server session. Do not request or store Google refresh tokens merely to sign in.
- Show the Google sign-in button only after the backend reports the provider is configured. Account pages must explain errors without silently creating a local profile or pretending Google authentication succeeded.

## 4. Acceptance checks before enabling the button

- HTTPS and the exact callback resolve to the backend; no static fallback or hash-route collision.
- A new Google account can sign in, reload, save training progress, sign out, and sign back in with the same records.
- Two Google accounts cannot read or change each other's records.
- Refused consent, stale/replayed state, invalid tokens, provider failure, and expired sessions fail safely with a retry path.
- Logout removes access to protected endpoints; local API emulation is absent from the production bundle.
- Consent branding and published policy links are correct; testing restrictions are understood or the Google app is moved to production as appropriate.
- Existing local records remain available until an explicitly approved import completes.

## Current Sites prototype

The prototype remains at https://streakin-prototype-v2.smalhi2025.chatgpt.site with its existing access policy. Sites manages its own hosted visitor authentication. Do not register the final-domain callback against this static prototype or add an unsupported external provider to Sites. The Google configuration above will be activated on the final hosting backend after a real OAuth client and server implementation exist.

Official references: [Google web-server OAuth](https://developers.google.com/identity/protocols/oauth2/web-server), [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect), [ID token verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
