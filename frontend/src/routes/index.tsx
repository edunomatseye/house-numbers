import React, { useState, useEffect } from "react";
import { createSnippet, fetchSnippets } from "../api";

interface Snippet {
  id: string;
  text: string;
  summary: string;
}

function Index() {
  const [text, setText] = useState("");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSnippets = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedSnippets = await fetchSnippets();
      setSnippets(fetchedSnippets);
    } catch (err) {
      console.error("Failed to fetch snippets:", err);
      setError("Failed to load snippets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnippets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Text cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createSnippet(text);
      setText(""); // Clear the textarea
      await loadSnippets(); // Reload snippets to show the new one
    } catch (err: any) {
      console.error("Failed to create snippet:", err);
      setError(err.message || "Failed to create snippet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Snippet</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your raw text (blog draft, transcript, etc.) here..."
          rows={10}
        />
        <div>
          <button type="submit" disabled={loading || !text.trim()}>
            {loading ? "Summarizing..." : "Generate Summary & Save Snippet"}
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <h2>All Snippets</h2>
      {loading && snippets.length === 0 && <p>Loading snippets...</p>}
      {snippets.length === 0 && !loading && (
        <p>No snippets found. Create one above!</p>
      )}
      <ul>
        {snippets.map((snippet) => (
          <li key={snippet.id}>
            <strong>Summary:</strong> {snippet.summary}
            <br />
            <div>
              <strong>Original Text:</strong>
              <pre>{snippet.text}</pre>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Index;
