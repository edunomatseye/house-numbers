export type Snippet = {
  id: string;
  text: string;
  summary: string;
  createdAt: Date;
};

export type NewSnippet = Omit<Snippet, "id" | "createdAt">;
