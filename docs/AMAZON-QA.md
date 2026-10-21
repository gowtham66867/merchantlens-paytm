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
