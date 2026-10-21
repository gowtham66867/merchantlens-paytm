# Devpost entry copy — ready for review

## Project title
MerchantLens — Every detail, carried forward

## Tagline
A simulated Alexa+ support assistant that carries a shopkeeper's conversation, reviewed photo notes and previous troubleshooting into a human-reviewed handoff.

## Inspiration
A silent payment-announcement device is not the same as a missing app transaction or an unsettled bank payment. Merchants often describe these together and repeat their story across support touchpoints. We wanted a voice interface that asks the next useful question and preserves the distinction between a report, a visual observation and independently verified evidence.

## What it does
The independent Alexa+ web simulation interviews a merchant using reviewed voice or text input, then responds with a context-aware follow-up. The shared support journey has eight optional stages, including device/app photos, review of visual findings, prior contact and outcome follow-up. A merchant can cover private areas locally before consenting to Google image processing, edit the provisional findings, and retain only a source-linked note. The raw image is discarded. Two unresolved recorded attempts recommend human review; a human-help flag is available immediately. Internal and anonymized handoffs have separate, version-bound approval gates.

## How we built it
React/TypeScript and Vinext run the web simulation. Node API routes use bounded Gemini calls for separate extraction, critique and planning roles, plus optional image inspection, transcription and speech generation. Code verifies source references and enforces tool/call budgets. Reviewed notes and previous attempts share one browser-local session. Docker/Cloud Run hosts the public prototype. No AWS runtime, Alexa SDK, MCP server, Echo connection or Paytm API is claimed: the entry uses the rules' alternate simulated-experience route.

## Challenges and lessons
Browser speech recognition could stop without recognizing an answer, and spoken replies could silently be disabled after refresh. The revised recording path uses a consented upload, review-before-send transcription and manual Stop by default. Playback preference survives refresh. Model observations remain provisional, and image notes need their own review because a screenshot cannot establish real settlement or authenticity.

## New work for this entry
A dedicated Alexa+ simulation surface with real execution receipts; eight-stage optional support; mobile photo/file input; local rectangle covering and metadata-free image preparation; bounded Gemini image analysis; reviewed image-note provenance, removal and redaction; internal/public export integration; six new regression tests. The earlier foundation came from the Paytm-office voice buildathon and is disclosed, not presented as a wholly new project.

## Validation
67 automated tests, TypeScript and production build pass. A synthetic browser test executed three real interview-model calls, a live Gemini image request, a reviewed note, two unresolved attempts, and separate approved internal/anonymized JSON exports. The new production revision is merchantlens-paytm-00017-bfw. These are functional checks, not performance, privacy or noisy-shop accuracy benchmarks. Physical microphone and mobile-camera validation remain outstanding for this extension.

## Product feedback based on tools actually used
- **Gemini structured generation:** separate role schemas make outputs inspectable, but schema validity alone does not establish factual support. We retained code-based source checks and one bounded repair. A tested turn took 26,094 ms across three calls; this single observation suggests a need to optimize serial latency, not a benchmark.
- **Gemini vision:** the tested redacted synthetic screenshot returned useful visible-status labels and uncertainties. Suggestions still needed human correction and review. Per-field source grounding and clearer uncertainty controls would improve this workflow. We did not measure OCR accuracy or complete PII removal.
- **Gemini transcription/TTS and browser audio:** server-generated playback and editable transcripts provide useful recovery options. Browser-only speech failed with no-speech/network errors in prior demos; explicit connection status, manual Stop and persistent playback controls made the application easier to diagnose. No claim of full-duplex realtime voice is made.
- **React/Vinext:** shared typed session state let the simulator, evidence UI and support journey reuse one workflow. Vinext's build warns that dynamic API usage cannot always be statically classified; deployment and runtime smoke tests remain necessary.
- **Amazon developer tools:** no gated Alexa+ toolkit or Amazon SDK was used. This is an own-tools web simulation under the alternate submission route; we cannot give firsthand feedback about SDKs we did not use.

## Supporting links
Live simulation: https://merchantlens-paytm-412542191970.asia-south1.run.app/?view=alexa
Support journey: https://merchantlens-paytm-412542191970.asia-south1.run.app/?view=support
Source: https://github.com/gowtham66867/merchantlens-paytm
QA: https://github.com/gowtham66867/merchantlens-paytm/blob/main/docs/AMAZON-QA.md
Photo safeguards: https://github.com/gowtham66867/merchantlens-paytm/blob/main/docs/PHOTO-EVIDENCE.md

## Video
The 2:55 narrated walkthrough uses actual UI captures and synthetic merchant text. It is not a continuous human voice recording. Local/source copy: [merchantlens-alexa-walkthrough.mp4](merchantlens-alexa-walkthrough.mp4).

YouTube/Vimeo URL: **pending account identity verification and upload**. The GitHub MP4 is a backup/review copy, not a substitute for the required YouTube/Vimeo URL.
