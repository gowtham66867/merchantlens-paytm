# MerchantLens v2 architecture

## Scope

MerchantLens is an interviewer for recurring merchant payment-confirmation problems. Its business outcome is a merchant-approved, evidence-linked problem brief. It does not verify payments or make financial decisions.

The v2 runtime is a typed, bounded agent graph. In guided mode, its roles execute deterministic code. In Gemini mode, extraction, independent critique, and planning execute separately scoped model requests. Calling these roles separate does not imply independent models or immunity from correlated error.

```mermaid
flowchart TD
    Input[Merchant voice / Wispr dictation / typed text] --> Prepare[Privacy and input boundary]
    Prepare --> Extract[Evidence extractor]
    Extract --> Verify[Code provenance verifier]
    Verify --> Tools[Read-only tool dispatcher]
    Verify --> Critic[Independent evidence critic]
    Tools --> Plan[Question planner]
    Critic --> Plan
    Plan --> Gate[Code budget and response gate]
    Gate -->|Ask or clarify| Input
    Gate -->|Ready, stopped, or turn budget reached| Review[Merchant correction and review]
    Gate --> Trace[Inspectable turn checkpoint and run trace]
    Trace -->|Explicit Save checkpoint| D1[(Account-owned D1 snapshot)]
    D1 -->|Explicit Restore| Input
    Review --> Approve[Version-bound audience approval]
    Approve --> Internal[Internal evidence-linked brief]
    Approve --> Public[Conservative anonymized brief]
```

## Boundaries and responsibilities

| Component | Responsibility | It cannot do |
|---|---|---|
| Prepare | Mask common secrets; reject ambiguous duplicate turn IDs | Guarantee complete PII removal |
| Extractor | Propose topic claims with exact quotes and source turn IDs | Declare independent transaction verification |
| Provenance verifier | Check sources exist, quotes match, topic uniqueness, trust boundary | Prove semantic entailment solely from a string match |
| Read-only tools | Inspect evidence, read coverage, retrieve curated source context | Browse arbitrary URLs, access bank accounts, send tickets or payments |
| Critic | Challenge semantic support and consequential contradictions | Approve output or independently authenticate merchant reports |
| Planner | Select a question from candidate topics and rephrase naturally | Ignore critical ambiguity or grant approval |
| Code gate | Enforce topic constraints, call and turn budgets, safe response form | Establish factual truth |
| Reviewer | Correct, redact and approve a version for an audience | Convert a merchant account into independent verification |
| D1 checkpoint store | Save and restore an account-owned turn-boundary snapshot | Provide an autonomous cross-account memory or team sharing |

## What is agentic here

1. **Plan and execute:** extraction produces explicit state; planning chooses the next action from currently relevant questions, rather than advancing a fixed questionnaire.
2. **Separate reviewer role:** a second prompt reviews semantic support before candidate claims are used. Unsupported claims are removed and become gaps for further questioning.
3. **Conditional control:** unresolved money ambiguity or contradictory payment accounts preempt routine field collection. A code gate can override a model's unsafe topic selection.
4. **Bounded tool use:** live extraction requests a subset of three typed read-only tools. The dispatcher executes only allowlisted functions. Required coverage inspection is added by code.
5. **Parallel branches:** context retrieval and evidence critique run concurrently after provenance validation. Their outputs join at planning.
6. **Bounded repair:** a source-invalid live extraction gets one repair attempt. Persistent invalidity aborts the run; it does not commit fabricated evidence.
7. **Explicit memory:** typed observations, source dependencies, superseded statements, and audit events preserve the interview state outside model context.
8. **Resumability:** D1 stores explicit account-owned snapshots at completed-turn boundaries. Restore resumes the last completed turn; this is not mid-token/model-call recovery.
9. **Source ablation:** removing a source identifies dependent observations. It is a dependency test, not causal inference or a claim of formal legal reasoning.
10. **Executable evaluation:** seven hand-authored deterministic probes run through the same graph. Model-contract tests use injected fake clients and are labeled separately from live-model evaluation.

## Question ranking

Scores prioritize consequential ambiguity, missing payment signals, operational impact, recurrence, and repeated questions. They are transparent engineering heuristics, not calibrated probabilities, expected entropy reductions, or learned policies. The planner sees a ranked list and chooses a listed topic. An unresolved critical challenge constrains the final choice in code.

## Hard budgets

- Four total model calls per turn, including at most one extraction repair.
- Three read-only tool calls per turn.
- Fourteen merchant turns before returning an incomplete draft for review.
- Fifty-five-second graph deadline; client waits sixty-five seconds.
- Bounded schema sizes, transcript length, and checkpoint payload size.

No autonomous background loops or external writes are available to the model.

## Storage and concurrency

Local interviews remain in browser local storage by default. Only choosing Save checkpoint uploads the current interview and agent trace to the signed-in account's D1 record. The primary key is `(owner_id, session_id)`, and every query is scoped by trusted Sites identity. Private hosting is preserved.

Updates reject older versions, recognize identical retries, and use a conditional database update to detect concurrent changes. Approval-only changes at the same content version require the last observed checkpoint timestamp. A redacted browser interview does not retroactively erase an earlier cloud snapshot: save the new version to replace that snapshot. Existing downloaded copies are outside this control.

The checkpoint fingerprint is a non-cryptographic dependency fingerprint. It is not a signature, authentication token, or tamper-evident ledger. Browser state can be altered by its owner. Formal signed approvals and enterprise audit retention are future production requirements.

## Retrieval and grounding

Five local context cards contain short paraphrases of official Paytm support information and explicit product design rules, reviewed on 18 October 2026. Local lexical matching retrieves up to three cards. This is not a large vector database, a live web-search agent, or proof of a merchant's account. Official-source cards and design rules are labeled separately.

## Voice and Wispr Flow

Browser SpeechRecognition can transcribe when supported. speechSynthesis reads agent turns; activating the microphone interrupts playback. The merchant reviews transcription before sending. Wispr Flow works as an external dictation app writing into the same answer field. No Wispr microphone API or transcription stream is called. Its available connector is read-only access to recorded notes, not an LLM backend. Received text is the evidence source; it may be edited dictation, not a verbatim audio record.

## Deliberate omissions

No decorative framework, autonomous payment execution, unverifiable emotion inference, speculative fraud scoring, or automatic external escalation was added. LangGraph/MCP branding would not make this bounded single-domain graph more reliable. A custom typed graph avoids a separate Python worker and preserves the existing deployment. The tool protocol can later be exposed through MCP if a real interoperability use case appears.

## Deployment

Vinext/React and same-origin APIs run as one Sites Worker. D1 is provisioned by Sites; the tracked Drizzle migration is applied at publication. Gemini credentials are runtime server secrets. The application is currently private. No GCP/Cloud Run deployment is claimed.

## Validation limit

The model roles, retry bounds, critic rejection, gate override and token accounting have deterministic contract tests using injected clients. Actual Gemini output quality, end-to-end live-model latency, Hindi recognition, and microphone playback remain unvalidated without credentials and the demo device. This architecture is materially stronger than v1, but that is not evidence of a guaranteed winning submission.

## Timing interpretation

Trace durations use the runtime clock and exclude browser/network transport. Some Worker runtimes do not advance the clock during code-only work; zero readings are displayed as clock-limited, not as evidence of zero latency. Live-model end-to-end latency still needs measurement.
