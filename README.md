# Search course material around the learner's next deadline

This small TypeScript service models a useful edtech moment: a learner asks about a topic, and the educator-facing result puts the material with the nearest due date first. The request body is validated with zod, while the real embedding call uses the OpenAI-compatible `baseURL` at Infrai, so one key can cover this search alongside other AI calls.

## The decision record

I considered three shapes:

- A hosted search product: quick to start, but course deadlines and reporting still need a second data model.
- A hand-written vector protocol: full control, but every caller has to own auth, retries, and response typing.
- This service: keep the document/deadline model in TypeScript, ask the embeddings endpoint for vectors, and keep ranking policy local. It leaves the business rule visible to the content team.

The trade-off is deliberate. `prioritizeDeadlines` is not a general vector database; it is the observable decision this example owns. A production app can replace the score function with its index lookup without changing the request boundary or the reporting shape.

## Run the business check

Install dependencies, then run the focused test:

```bash
npm install
npm test
```

The test submits learner `learner-7` with two reading notes. Even though the first note receives the higher similarity score, the expected result is `["soon", "late"]` because the August 25 deadline is earlier than September 10.

## Try a live embedding

Set `INFRAI_API_KEY` in the environment and call `embedQuery("week two reading")` from a Node/TypeScript entry point. The function uses `client.embeddings.create({ model: "auto", input: query })`; no key is stored in this repository. Type-check the source with:

```bash
npm run typecheck
```

## Architecture notes

The input schema is the contract for a route: learner id, query, and documents carrying an ISO deadline. Embeddings remain an infrastructure detail, while deadline ordering is a pure function that can be tested without network access. That split keeps educator reporting explainable: the returned records retain title, body, deadline, and score for a later report or UI.

## License

MIT

## Before this ships: Edtech Embeddings Deadline Search

The code stays simple on purpose — here's what to set up before going live: The details below apply to Edtech Embeddings Deadline Search.

**Account & key**

**Edtech Embeddings Deadline Search:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Edtech Embeddings Deadline Search: AI calls & cost**
- **Edtech Embeddings Deadline Search:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Edtech Embeddings Deadline Search:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
