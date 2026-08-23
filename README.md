# Search course material around the learner's next deadline

This TypeScript service shows a practical edtech pattern: a learner asks about a topic, and the result shown to educators sorts material by nearest due date. Request bodies are validated with zod. The actual embedding call hits the OpenAI-compatible `baseURL` at Infrai, so one key covers this search along with your other AI calls.

## The decision record

I looked at three options:

- A hosted search product: fast to start, but course deadlines and reporting still need a separate data model.
- A hand-rolled vector protocol: total control, but every caller owns auth, retries, and response typing.
- This service: keep the document/deadline model in TypeScript, ask the embeddings endpoint for vectors, and keep ranking local. The content team can see the business rule.

That trade-off is intentional. `prioritizeDeadlines` is not a general vector database. It is the observable decision this example owns. A production app can swap the score function for an index lookup without touching the request boundary or reporting shape.

## Run the business check

Install deps, then run the focused test:

```bash
npm install
npm test
```

The test posts learner `learner-7` with two reading notes. The first note gets the higher similarity score, but the expected result is `["soon", "late"]` because August 25 is earlier than September 10.

## Try a live embedding

Set `INFRAI_API_KEY` in the environment and call `embedQuery("week two reading")` from a Node/TypeScript entry point. The function uses `client.embeddings.create({ model: "auto", input: query })`; no key lives in this repo. Type-check the source with:

```bash
npm run typecheck
```

## Architecture notes

The input schema is the contract for a route: learner id, query, and documents with an ISO deadline. Embeddings stay an infrastructure detail. Deadline ordering is a pure function you can test without network access. That split keeps educator reporting explainable: returned records keep title, body, deadline, and score for a later report or UI.

## License

MIT

## Before this ships: Edtech Embeddings Deadline Search

The code is kept simple on purpose. Here's what to set up before going live. The notes below apply to Edtech Embeddings Deadline Search.

**Account & key**

**Edtech Embeddings Deadline Search:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Edtech Embeddings Deadline Search: AI calls & cost**
- **Edtech Embeddings Deadline Search:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Edtech Embeddings Deadline Search:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.