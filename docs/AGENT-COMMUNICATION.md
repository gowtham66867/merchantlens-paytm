# Communication between interview roles

MerchantLens uses **orchestrator-mediated structured data**, rather than direct agent-to-agent conversations. In Gemini mode, the extractor, critic and planner are separately scoped requests to the configured Gemini model. The orchestrator in [`lib/agents/graph.ts`](../lib/agents/graph.ts) passes their outputs through typed state, validates them and decides what the next stage may see. Guided mode uses deterministic adapters instead of model inference.

No A2A protocol, message broker, autonomous agent network or cross-agent audio stream is implemented. The model roles use the same backend and can share correlated errors. Audio codecs apply to merchant input and spoken playback; role-to-role information is JSON.

## Data flow

```mermaid
sequenceDiagram
    participant UI as Browser
    participant H as Orchestrator
    participant E as Extractor
    participant V as Code verifier
    participant C as Critic
    participant T as Read-only tools
    participant P as Planner
    participant G as Code policy gate
    UI->>H: Reviewed answer, turns, existing facts, language, mode
    H->>E: Transcript, previous claims, language and output schema
    E-->>H: Proposed claims and tool requests (JSON)
    H->>V: Claims, exact quotes and source turn IDs
    V-->>H: Valid sources or rejection
    par Critique branch
        H->>C: Transcript, proposed claims and existing challenges
        C-->>H: Rejected topics, challenges and concise summary
    and Context branch
        H->>T: Allowlisted coverage, evidence and context requests
        T-->>H: Structured results and source context
    end
    Note over H: Remove rejected claims; rank remaining gaps and challenges
    H->>P: Ranked candidates, tool results, critic summary and language
    P-->>H: Proposed topic, question and operational reason
    H->>G: Candidate selection, constraints, budgets and language
    G-->>H: Validated question, safe override or review transition
    H-->>UI: Response, observations, readiness and run trace
    Note over UI: Merchant corrects, redacts and approves before export
```

The critic and tools run in parallel **after** source validation. Tools do not receive the critic's later rejections: the two branches start from the same source-validated proposals. Once both branches complete, the orchestrator removes rejected topics, records challenges and ranks candidate questions before calling the planner. The planner receives the ranked candidates, tool outputs and concise critic summary; it does not receive another model's private reasoning.

## Role contracts

| Stage | Receives | Returns / enforces |
| --- | --- | --- |
| Extractor | `language`, `transcript`, `previousClaims` | `claims[]`, `tool_requests[]`; claims include `topic`, `value`, `quote`, `turn_id`, `estimated` |
| Source verifier | Proposed claims and received merchant turns | Rejects missing source turns, mismatched quotes, duplicate topics and claims of independent verification |
| Critic | `transcript`, `proposals`, `existingChallenges` | `rejected_topics[]`, `challenges[]`, `summary`; challenge source IDs must exist |
| Read-only dispatcher | Requested tool name, proposed facts and relevant interview context | Coverage, evidence inspection and curated context; only `get_coverage`, `inspect_evidence`, `retrieve_context` |
| Ranker | Turns, surviving observations, challenges and language | Candidate topics with heuristic scores and clarification priority |
| Planner | `language`, `outputLanguage`, `candidates`, `toolResults`, `criticSummary`, `merchantTurns` | `topic`, `question`, `reason` |
| Policy gate | Plan, candidates, ambiguity priority, language and turn state | Safe candidate question, clarification or review; approval is never delegated to a role |

Type contracts are defined in [`types.ts`](../lib/agents/types.ts); JSON and Zod output schemas are in [`graph.ts`](../lib/agents/graph.ts). The model client serializes request data as JSON and asks Gemini for schema-constrained JSON output. Runtime checks still apply after inference.

## Illustrative exchange

These are illustrative JSON payloads consistent with the role schemas, not a saved production trace. Assume merchant turn `m-1` contains exactly: `My Soundbox was silent. I think I lost ₹2,400.`

Extractor proposal:

```json
{
  "claims": [
    {
      "topic": "affected_value",
      "value": "Merchant suspects a loss of ₹2,400; amount meaning requires clarification",
      "quote": "I think I lost ₹2,400.",
      "turn_id": "m-1",
      "estimated": false
    }
  ],
  "tool_requests": ["get_coverage", "inspect_evidence"]
}
```

`estimated: false` does **not** mean verified. The orchestrator stores this as a merchant-reported observation. The amount's interpretation is still uncertain. A report that the merchant suspects a loss can be faithfully quoted without establishing that a loss occurred.

If a proposed value instead asserts a confirmed loss, the critic can reject that topic and request clarification:

```json
{
  "rejected_topics": ["affected_value"],
  "challenges": [
    {
      "topic": "affected_value",
      "summary": "The merchant's suspicion does not establish confirmed financial loss.",
      "question": "Was ₹2,400 the value of affected payments or a financial loss you confirmed?",
      "turn_ids": ["m-1"]
    }
  ],
  "summary": "Clarify the amount before treating it as a loss."
}
```

After candidate ranking, the planner may return:

```json
{
  "topic": "affected_value",
  "question": "Was ₹2,400 the value of affected payments or a financial loss you confirmed?",
  "reason": "Amount ambiguity takes priority over routine field collection."
}
```

The policy gate can override this proposal if it violates a critical clarification priority, allowed topic, language/script rule, response length or supported safety check. A matching source quote alone does not prove semantic support or financial truth.

## Harness limits and failure behavior

- At most four total model calls and three read-only tool calls per interview turn, with a 55-second graph deadline.
- At most one shared schema/source repair across extractor, critic and planner; the repair consumes the same call budget. It is not one retry per role.
- At most fourteen merchant turns before handing an incomplete draft back for review. Explicit stop requests also end the interview with unknowns preserved.
- Participant and tool content are untrusted data. Neither can grant approval, call payment/refund APIs or silently change the selected provider.
- A failed provider or validation step returns an error; the browser retains the pending answer and prior committed interview state.
- The returned trace includes observed stage durations, tool summaries, model-call/token counts, candidate selection and a source dependency fingerprint. The fingerprint is not a cryptographic signature or a cloud database write.
- Corrections/redaction create a new content version and invalidate approvals. Internal and anonymized exports each require approval of that version.

## Codecs versus role communication

| Path | Encoding / format | Qualification |
| --- | --- | --- |
| Preferred microphone capture | Opus codec in a WebM container: `audio/webm;codecs=opus` | Selected only if `MediaRecorder.isTypeSupported` reports support |
| Recording fallbacks | Browser-supported `audio/mp4`, then Opus in Ogg; otherwise the browser default | An MP4 container does not identify its codec; the app does not force AAC or a sample rate |
| Local pause detection | Float32 time-domain samples from an AudioContext analyser | Local signal analysis, not the uploaded audio codec; energy heuristic, not semantic VAD |
| Audio upload | Bounded recorded clip over the same-origin transcription API | Audio goes to Gemini after consent; transcript is reviewed before Send |
| Role / server communication | Structured JSON over HTTPS to Gemini; typed in-process state between stages | No Opus, WAV, A2A or audio exchange between the model roles |
| Gemini playback | WAV container; tested output was `pcm_s16le`, 24,000 Hz, mono, 16 bit | App validates WAV framing; these PCM parameters were observed in the tested output, not negotiated for every response |
| Device playback fallback | Browser/OS speech synthesis | Encoding and voice implementation depend on the device |

See [voice implementation and tests](VOICE-UPGRADE.md), [architecture](ARCHITECTURE.md), [`workspace.tsx`](../components/workspace.tsx) and [`speech.ts`](../lib/speech.ts). There is no full-duplex WebRTC voice session in the current prototype.
