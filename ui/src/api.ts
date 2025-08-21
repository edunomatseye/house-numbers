const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"; //

interface Snippet {
  id: string;
  text: string;
  summary: string;
}

export async function createSnippet(text: string): Promise<Snippet> {
  const response = await fetch(`${API_BASE_URL}/snippets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create snippet");
  }
  return response.json();
}

export async function fetchSnippets(): Promise<Snippet[]> {
  const response = await fetch(`${API_BASE_URL}/snippets`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch snippets");
  }
  return response.json();
}

export async function fetchSnippetById(id: string): Promise<Snippet> {
  const response = await fetch(`${API_BASE_URL}/snippets/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch snippet by ID");
  }
  return response.json();
}
