# Alexa+ simulation and photo-support QA — 21 October 2026

This is functional QA using synthetic data, not a merchant pilot, image-authenticity test, OCR accuracy benchmark, or production privacy certification.

- TypeScript check and Vinext production build pass.
- 67 automated tests pass (six new image-evidence tests).
- Browser: a newly created synthetic interview was opened in the independent Alexa+ web simulation.
- A real Gemini interview request processed a report of silent Soundbox audio, app success, unknown bank settlement and a failed restart. Three role calls completed in 26,094 ms; the real execution trace was displayed. The assistant asked about operational impact. This single observed duration is not a latency benchmark.
- A labelled synthetic app screenshot was loaded. A rectangle was drawn over its reference area before image-processing consent.
- The real Gemini image response described the visible successful label, missing audio, unchecked settlement and redacted reference, and kept screen authenticity uncertain.
- The note was reviewed and saved. The canvas/raw image disappeared; one note remained with a source turn and digest.
- Two unsuccessful support attempts were recorded. The rules recommendation became human review rather than another troubleshooting loop.
- Returning to the simulation retained one image note and both attempts in the same interview.
- Internal review displayed the image note before approval. Its downloaded JSON, version 6, contained one note, two attempts, ticket_created=false and no raw image data.
- The anonymized review displayed an omission notice. Its separately approved/downloaded JSON excluded photo_evidence and detailed attempts.
- Physical microphone input was not exercised in this QA; it still needs a human/device test. The simulation reuses the existing recording, transcription and playback implementation.
- Mobile camera capture uses the browser/OS file-picker capability; a physical mobile-camera test remains outstanding.

The narrated video uses captured real UI states and synthetic input, not a continuous human voice recording. The old 3:44 Paytm walkthrough must not be submitted as the new Alexa+ demonstration.

## Production smoke test
Revision `merchantlens-paytm-00017-bfw` serves the direct Alexa+ entry URL. The eight stages, mobile/file picker controls and synthetic-photo shortcut were checked in Chrome. A real production Gemini image request returned provisional visible-status observations and uncertainties from the covered synthetic screenshot. Nothing from that production draft was committed to the existing interview.

## Demo artifact
`docs/merchantlens-alexa-walkthrough.mp4`: 175.33 seconds, 1920×1080 H.264/AAC, approximately 4.7 MB. Audio levels were checked and the capture states were visually inspected during QA. This is a narrated sequence of actual UI captures using synthetic merchant input, not continuous microphone footage. YouTube/Vimeo publication is pending account verification.
