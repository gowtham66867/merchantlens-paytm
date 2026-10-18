# Voice upgrade — 18 October 2026

The active voice provider is Gemini. The OpenAI key could list `gpt-live-1`, but an actual audio transcription request returned HTTP 429 `credit_balance_exhausted`. GPT-Live is not connected to the browser. Model listing access must not be presented as a successful voice session.

## Working flow

Microphone → echo cancellation / noise suppression / automatic gain control (browser permitting) → local energy-based voice activity detection → stop after a selected pause → Gemini transcription → editable transcript → explicit Send → existing evidence/approval harness.

- Pause options: 1.2 seconds, 2 seconds (default), 3.5 seconds for thinking time.
- Continuous speech is needed for 200ms to ignore short clicks. Ten seconds with no detected speech discards the recording locally. Maximum recording length remains 45 seconds.
- Automatic stopping can be turned off; Stop is always available while recording. Energy detection is not a neural or semantic VAD. Noise and other speakers can affect it.
- Recording ends and mic tracks are released before transcription. Changing interviews/views cancels stale recordings and transcription updates.
- Gemini `gemini-3.8-flash-lite-tts` reads interviewer questions using the Kore voice and separate delivery metadata. The text is not a voice instruction prompt.
- Device playback remains selectable and is the fallback when cloud playback fails. Stop playback, opening another interview, or starting the microphone cancels pending/active speech.
- The public speech endpoint is same-origin, consent marked, bounded to 1,200 characters with an 18-second provider timeout and a 20 requests/minute/instance demo budget. This is not distributed production abuse protection.
- Credentials stay server side. MerchantLens does not persist raw recordings or generated playback audio. Google processes audio/text according to its service policies.

## Validation

56 automated tests pass, including pause/resume/no-speech/click rejection, output WAV validation, and existing evidence/approval checks. TypeScript passes.

Actual API smoke tests with synthetic recordings:

| Test | Result |
| --- | --- |
| English transcription | HTTP success; approximately 2.2s |
| Hindi transcription | HTTP success; approximately 2.9s |
| Kannada transcription | HTTP success; approximately 1.6s |
| English question TTS | WAV returned; approximately 3.7s |
| Hindi question TTS | WAV returned; approximately 2.9s; transcription round trip matched supplied question |
| Kannada question TTS | WAV returned; approximately 3.3s; transcription round trip matched supplied question |
| OpenAI audio transcription | Blocked by exhausted credit balance |

These are synthetic smoke tests, not human listening scores, word error rate measurements, or noisy-shop benchmarks. TTS generation latency precedes playback; Device voice is faster. The implementation is turn-based with transcript review, not a full-duplex speech-to-speech session.

References: [Gemini speech generation](https://ai.google.dev/gemini-api/docs/generate-content/speech-generation), [OpenAI file transcription](https://developers.openai.com/api/docs/guides/speech-to-text).
