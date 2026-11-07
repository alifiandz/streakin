# StreakIn Google accounts

## Current status

The application now includes a Supabase Auth adapter using Google's authorization-code flow with PKCE, validated sessions, logout, error handling and safe workout return links. **Google login is not activated:** the dedicated StreakIn project is connected, but its Google provider is disabled and a Google OAuth client still needs configuration. `public/auth-config.json` deliberately keeps `googleEnabled: false`. The Google button is shown only when that configuration is valid and enabled.

Verified project: `xnxczexshsxpqymhbdzx`, name `StreakIn`, organization `dyfxahydireejfcbwtjw`, region Tokyo, status `ACTIVE_HEALTHY`. Reuse this existing project. Its public Auth settings report `external.google: false`. The application configuration now contains its real project URL and publishable key, with Google deliberately disabled until provider setup is complete. Do not reuse the MyWay project.

## 1. Create the dedicated Supabase project

This step is complete: reuse the existing StreakIn project. No new project or organization needs to be created.

No training-data schema is needed to enable this account adapter. It authenticates through Supabase Auth; training records remain browser-local and must not be advertised as synchronized or secured by a production API. Do not turn on server-paid entitlements based on the browser's Pro test setting.

## 2. Configure Google

Open [Google Auth Platform](https://console.cloud.google.com/auth/overview), using a Google Cloud project owned by the user:

1. Set the app name to `StreakIn`, and select the user's actual support/developer email.
2. Choose the appropriate audience. For an external app in testing, add the Google accounts that will test login. Publishing the app publicly requires the appropriate branding, working legal URLs and any Google verification requirements; do not fabricate URLs or accept policies for the user.
3. Request only `openid`, `email` and `profile`. No Drive, Gmail, Calendar or offline Google access is needed.
4. Create a **Web application** OAuth client.
5. Set the Google **Authorized redirect URI** to the callback shown by Supabase's Google provider settings, normally:

   `https://xnxczexshsxpqymhbdzx.supabase.co/auth/v1/callback`

   Use the actual returned project reference. **This replaces the old planned `streakin.my.id/api/auth/google/callback` address.** Google redirects to Supabase, which exchanges the Google authorization code and returns the browser to StreakIn. Do not add a `/#/` fragment to Google's callback.
6. Enter the Google client ID and client secret directly into **Supabase → Authentication → Sign In / Providers → Google**. Enable the provider. Keep the secret out of chat, source, Sites public files and browser environment variables. The app uses Supabase's hosted authorize endpoint, so no Google browser SDK origin is needed for this flow.

The available Supabase connector does not expose provider configuration or Google OAuth client creation. These steps require the account owner or an authorized browser session.

## 3. Configure return URLs in Supabase

Under **Authentication → URL Configuration**, set the Site URL to the current working StreakIn origin and allow this exact additional redirect URL:

`https://streakin-prototype-v2.smalhi2025.chatgpt.site/?auth_callback=1`

For the final deployment, add this only when that domain serves the app:

`https://streakin.my.id/?auth_callback=1`

Use exact origins; do not use unrestricted wildcard redirects. Sites' private access boundary remains in place; app Google login does not grant someone access to an owner-private Site.

The frontend SDK exchanges Supabase's code with the PKCE verifier saved in the same browser. It verifies the resulting user with `auth.getUser()`, removes the code/error from the address bar, and returns to an allowlisted application path. Consent cancellation, a missing/expired code, network errors and an expired session must not create an account locally.

## 4. Activate the application configuration

After Google and the Supabase redirect URLs are configured, obtain the project's **publishable** key. Update `public/auth-config.json` with only:

```json
{
  "supabaseUrl": "https://xnxczexshsxpqymhbdzx.supabase.co",
  "publishableKey": "<actual-sb_publishable-key>",
  "googleEnabled": true
}
```

This is intentionally public configuration, not a secret store. Secret/service-role keys are rejected. Never put Google's client secret or a Supabase secret/service-role key here. Rebuild, test and publish the existing Site; do not create a second Site or change its audience.

## Account and training behavior

- Google identity uses Supabase's stable user ID, with a `supabase_` namespace for the device-local training profile. Display name and email do not determine authorization.
- Existing device accounts, passwords, workouts, history, routines and reminders stay intact. Matching email addresses do **not** automatically merge profiles or copy local records into a Google account.
- A first Google visit enters onboarding. Returning users with saved onboarding preferences resume their chosen destination.
- Users can explicitly export a local training backup and restore it after signing into Google. This remains a browser-local import, not an upload or server synchronization.
- Browser persistence uses the SDK's dedicated session key and refresh behavior. The client verifies persisted credentials with the auth service; a cached profile cannot substitute for a valid Google session.
- Logout signs out the current browser's Supabase session and clears the app's active account only after success. It does not sign the user out of Google globally or delete training history.
- Password forms are explicitly **device accounts**. They have not become cloud email/password accounts, and no password-recovery email service is claimed.

## Activation acceptance checks

Automated tests use a mocked external provider, not fake live Google authentication. They cover PKCE exchange/cleanup, safe return paths, cancelled consent, expired codes, unverified/expired identity, sign-out, account isolation and return-visit persistence. Existing workout journeys run separately.

Before marking Google login operational, manually verify with an actual configured Google client:

1. New Google login → onboarding → selected workout → completion → history.
2. Reload → sign out → sign back in → same device-local training profile.
3. Returning user skips onboarding; selected workout link survives the provider round trip.
4. Cancel consent, retry an expired link, and deny an expired session without losing training data.
5. Existing device accounts remain available; same-email profiles are separate; backup import is explicit.
6. Another device signs into the same verified account but sees only its own local training until real synchronization is implemented.

References: [Supabase Google login](https://supabase.com/docs/guides/auth/social-sign-in/auth-google), [PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow), [getUser](https://supabase.com/docs/reference/javascript/auth-getuser).

## Direct setup links for the connected project

- [Google provider settings](https://supabase.com/dashboard/project/xnxczexshsxpqymhbdzx/auth/providers): enter the Google client ID and secret, then enable Google.
- [Supabase return URL settings](https://supabase.com/dashboard/project/xnxczexshsxpqymhbdzx/auth/url-configuration): use the exact current Sites callback above.
- [Google OAuth clients](https://console.cloud.google.com/auth/clients): create the Web application client and register `https://xnxczexshsxpqymhbdzx.supabase.co/auth/v1/callback`.

Do not send the Google client secret in chat. After the owner configures the provider and return URL, recheck `/auth/v1/settings`, verify the actual OAuth redirect, enable the existing app configuration, publish and test a real user login.
