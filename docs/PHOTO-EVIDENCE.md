# Optional visual support evidence

Eight illustrative stages: clarify → review records → optional photo → review visual findings → self-service history → prior contact → human handoff → follow-up. They are not a verified map of Paytm's internal process and are never mandatory gates.

## Data flow
1. Merchant chooses a JPEG/PNG/WebP (up to 4 MB) or uses the mobile file picker's camera.
2. Browser decodes/resizes the image to at most 1280px on its long side and redraws it to canvas, excluding original file metadata.
3. Merchant drags rectangles to cover private details. Covering clears the prior draft and consent.
4. With explicit consent, the redacted JPEG is POSTed to `/api/evidence`. Manual notes need no external image upload.
5. Server checks origin, consent, streamed byte limit and image signature. It uses a 30-second bounded Gemini request and a strict response schema; image content is treated as untrusted data.
6. Merchant edits the provisional note, then saves it. Only note, kind, timestamp, source turn and digest are retained. Raw image/canvas is discarded. Draft photos disappear when leaving the panel or refreshing.
7. Retained notes appear in the source transcript and internal handoff. Anonymized exports omit them. Any addition, redaction or removal invalidates earlier export approvals.

No image authenticity checking, forensic verification, bank validation or device diagnosis is performed. Covering is manual; there is no claim of complete automatic PII removal. Text scrubbing is best effort and image-model instructions are not a guarantee that all sensitive text is excluded. The public-demo rate cap (20/minute per server instance) is a basic demo bound, not a production abuse-control system. Google processes the transmitted image under the user's provider terms; MerchantLens does not persist raw image bytes or log them deliberately.

Tests cover validation, schema bounds, approval invalidation, provenance, anonymized-export omission, redaction and removal. Synthetic live-provider QA is a functionality check, not an OCR accuracy or privacy benchmark.
