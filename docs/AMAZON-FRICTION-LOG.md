# MerchantLens friction log

These observations concern tools actually used, not untested Amazon SDKs. Severity is qualitative; timings are individual observations, not benchmarks.

| Task and steps | Expected versus observed | Severity | Workaround | Suggested improvement |
|---|---|---|---|---|
| Conduct a browser voice interview: enable recording and speak an answer | Expected an editable transcript; earlier demos returned browser no-speech/network errors | Critical for voice demo | Consented server transcription, editable transcript, manual Stop and typed fallback | Explicit provider diagnostics and a reproducible multilingual/noisy-shop voice test harness |
| Hear interviewer after refreshing the app | Expected spoken questions; playback preference could be off | Important | Persist playback preference and expose a visible audio toggle | Make playback status and recovery explicit |
| Process a synthetic answer through extractor, critic and planner | Expected a responsive follow-up; one three-call test took 26,094 ms | Important | Bounded calls and guided fallback; disclose waiting time | Optimize serial latency while keeping source checks and observable role outputs |
| Inspect a locally covered synthetic payment screenshot | Expected useful provisional observations; returned labels were useful but still required merchant review and could not establish settlement/authenticity | Important | Require review/edit before retaining a source-linked note; no raw image in exports | Per-field evidence grounding and uncertainty controls |
| Build and deploy dynamic API routes using Vinext | Expected static classification to describe runtime routes fully; build warned about dynamic API classification | Important | Type checks, tests, production build and deployed smoke checks | Clearer dynamic-route diagnostics and deployment guidance |
| Create Devpost project, then save details and open Additional info | Expected editor navigation; reCAPTCHA timed out, then Cloudflare verification stopped navigation | Important | User completed verification in Chrome; draft workflow resumed | Preserve draft state and offer clearer verification timeout recovery |

Physical mobile-camera and noisy-shop microphone evaluation remain outstanding. No firsthand Amazon developer-tool onboarding or device-performance feedback is claimed.
