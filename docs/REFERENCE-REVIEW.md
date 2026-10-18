# Reference review: architecture patterns, not borrowed win claims

Reviewed on 18 October 2026. This is a focused source/documentation review, not a security or performance audit of these projects. No reference implementation was executed locally, and no reference benchmark is attributed to MerchantLens.

## Sanjay Prasad H S — sanjuhs

Profile supplied by the user: https://github.com/sanjuhs

Relevant repositories inspected:

- https://github.com/sanjuhs/lvl — explicit provenance, epistemic status, contradiction checks and source-removal simulation. LVL describes itself as experimental. MerchantLens adapts the distinction between a sourced claim and a proven proposition and adds a source-dependency explorer; it does not implement LVL's language or legal inference engine.
- https://github.com/sanjuhs/productivity-browser-openai-hackathon — repository documentation presents an operational productivity agent. Relevant lesson: expose tool boundaries and observable behavior instead of relying on a single chat response.
- https://github.com/sanjuhs/minicpm-voice-live — voice-oriented project reference. MerchantLens does not claim to run MiniCPM or copy its audio stack.
- https://github.com/sanjuhs/build-enterprise-RAG — retrieval-oriented project reference. MerchantLens uses a small curated context corpus and explicitly does not claim enterprise-scale RAG.

No prize status was established for these individual repositories. They are architectural references, not verified winners in this report.

## Verified winners from Microsoft's AI Agents Hackathon 2025

Organizer winner list: https://github.com/microsoft/AI_Agents_Hackathon/blob/main/docs/winners.md

- **Apollo — Best C# Agent.** Repo: https://github.com/manasseh-zw/apollo . Organizer confirmation: https://github.com/microsoft/AI_Agents_Hackathon/issues/681 . Relevant patterns: coordinator/reviewer separation, bounded knowledge-gap loops, explicit workflow state, and cited synthesis. MerchantLens applies role separation and stateful questioning; it does not replicate Apollo's broad research pipeline.
- **ModelProof — Best JavaScript/TypeScript Agent.** Repo: https://github.com/hgenix20/modelproof . Organizer confirmation: https://github.com/microsoft/AI_Agents_Hackathon/issues/517 . Relevant pattern: reviewing proposed model output before presentation. MerchantLens adds an independent critic prompt and code gates. It does not claim dual-model consensus; its live roles use the configured Gemini model.

A winner's architecture is a source of design ideas, not evidence that those ideas will win a different event.

## Wispr capability check

Official dictation explanation: https://docs.wisprflow.ai/articles/2772472373-what-is-flow
Official read-only MCP documentation: https://docs.wisprflow.ai/articles/9551372685-connect-an-mcp-client-to-wispr-flow-remote-mcp-server

Wispr can insert dictation into the answer field. The available connector exposes recorded meeting/note retrieval and does not provide live reasoning or an interactive microphone stream to this application.

## Remaining competition risks

- Real, unscripted voice quality and intelligent follow-ups matter more than the number of agent labels.
- The business benefit still needs merchant and investigator validation.
- The live model path must be evaluated with real credentials, rather than inferred from contract tests.
- Private hosting is useful for development but must be intentionally shared with judges before an external demo.
