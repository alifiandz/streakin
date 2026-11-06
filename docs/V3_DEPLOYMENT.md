# V3 review and deployment workflow

The user's V3 brief says: “Do not overwrite the live version without confirming the intended deployment workflow.” No V3 deployment or source push has been made.

- Live V2 remains: https://streakin-prototype-v2.smalhi2025.chatgpt.site
- Existing Sites project identity is retained in .openai/hosting.json.
- V3 is built on local branch `streakin-v3`. The review archive contains the static production build and the delivery notes.
- Option A, after explicit confirmation: push the reviewed V3 source to the existing Site's configured branch, package the matching build, save a version and publish privately while preserving its current access.
- Option B, after confirmation: create a separate private V3 preview Site, bind its own identity/source and publish there, retaining V2 for comparison. Do not reuse the V2 project ID for a new Site.
- Jagoan Hosting/Webuzo and streakin.my.id are the eventual production target. They have not been configured or changed. Confirm the plan's Node/database support before using the server enforcement adapter.

The static review build is a working local prototype; it is not a paid production service. Deploying the SQLite module requires a verified authentication/API adapter, durable private storage and a compatible server runtime. AI/billing/cloud synchronization remain disabled until their integrations are implemented.
