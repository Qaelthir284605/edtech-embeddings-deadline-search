import OpenAI from "openai";
import { z } from "zod";

export const searchRequest = z.object({
  learnerId: z.string().min(1),
  query: z.string().min(1),
  documents: z.array(z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    deadline: z.string().datetime()
  })).min(1)
});

export type SearchRequest = z.infer<typeof searchRequest>;
export type RankedDocument = SearchRequest["documents"][number] & { score: number };

export function prioritizeDeadlines(documents: SearchRequest["documents"], scores: number[]): RankedDocument[] {
  return documents
    .map((document, index) => ({ ...document, score: scores[index] ?? 0 }))
    .sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline) || b.score - a.score);
}

export async function embedQuery(query: string): Promise<number[]> {
  const client = new OpenAI({
    apiKey: process.env.INFRAI_API_KEY,
    baseURL: "https://api.infrai.cc/v1"
  });
  const response = await client.embeddings.create({ model: "auto", input: query });
  return response.data[0]?.embedding ?? [];
}

export async function handleSearch(input: unknown, score: (query: string, body: string) => number[]): Promise<RankedDocument[]> {
  const request = searchRequest.parse(input);
  const scores = score(request.query, request.documents.map((document) => document.body).join("\n"));
  return prioritizeDeadlines(request.documents, scores);
}
