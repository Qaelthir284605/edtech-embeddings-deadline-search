import assert from "node:assert/strict";
import { handleSearch } from "./deadline_search.js";

const input = {
  learnerId: "learner-7",
  query: "week two reading",
  documents: [
    { id: "late", title: "Week two notes", body: "reading", deadline: "2026-09-10T09:00:00.000Z" },
    { id: "soon", title: "Week one notes", body: "reading", deadline: "2026-08-25T09:00:00.000Z" }
  ]
};

const ranked = await handleSearch(input, () => [0.99, 0.20]);
assert.deepEqual(ranked.map((document) => document.id), ["soon", "late"]);
console.log("deadline ordering: ok");
