# Cloud Run deployment

This target runs the same interview graph and UI on a Node 24 standalone server. The Sites target continues to use its Cloudflare Worker and D1. Cloud Run uses a dedicated private Cloud Storage bucket for checkpoints; generation preconditions reject concurrent writes. It does not migrate existing Sites or browser snapshots automatically.

## Deploy

Authenticate the requested account first, then select a project with billing enabled:

```sh
gcloud auth login [deployment account omitted]
node scripts/deploy-cloudrun.mjs PROJECT_ID
```

The script creates a dedicated runtime service account, private bucket and Secret Manager secret. It reads the Gemini key from ignored `.env.local` and sends it to Secret Manager through stdin. The key never enters the image or Cloud Build source archive. The Cloud Run revision pins the secret version. The runtime account receives secret access on that secret and object access on that bucket. Cloud Build also needs its normal source-deployment build permissions in the chosen project.

The service `merchantlens-paytm` deploys in Mumbai (`asia-south1`), with zero minimum instances and at most two instances. The default script mode requires authentication. All authorized invokers share one private workspace in that mode; this is not a public multi-user identity system.

## Current production access

Open **https://merchantlens-paytm-412542191970.asia-south1.run.app**. The demo is public and requires no Google account or sign-in.

To redeploy the public demo:

```sh
node scripts/deploy-cloudrun.mjs billing-dashboard-505116 --public-demo
```

The script first deploys a ready revision with `PUBLIC_DEMO=true` behind authentication, then disables IAP and applies Cloud Run's public-access setting (`--no-invoker-iam-check`). This is Google's documented method for projects with domain-restricted sharing; adding an `allUsers` IAM binding is blocked in this project. Organization policy is not modified.

In public mode, interview drafts stay in each visitor's browser and approved briefs can be exported. Private cloud checkpoint reads and writes return HTTP 403, even if a private owner or bucket remains configured. The public revision omits those private environment bindings. Existing Cloud Storage checkpoint objects are retained privately and the bucket's public-access prevention remains in place. The public UI replaces cloud checkpoint controls with browser-local persistence guidance.

Anonymous checks confirmed home/provider HTTP 200, private checkpoint read/write HTTP 403, and a live Gemini interview HTTP 200. IAP browser sign-in was used for the earlier private deployment and is now disabled at the user's request. The local Cloud Run proxy is unnecessary for this public deployment. Google Cloud costs follow usage; no minimum instance is kept running.

## Local validation

```sh
MERCHANTLENS_TARGET=cloudrun node node_modules/vinext/dist/cli.js build
PORT=8080 HOST=127.0.0.1 node dist/standalone/server.js
docker build -t merchantlens-cloudrun:local .
```

Local standalone runs do not grant a checkpoint identity. Real checkpoint access requires the authenticated Cloud Run service, its service account and bucket. The deployment script checks provider status for IAM-only access, or the login redirect and account policy for IAP, and rejects successful unauthenticated access. Full Gemini interview quality and latency require a separate live test; a successful deployment does not establish those results.
