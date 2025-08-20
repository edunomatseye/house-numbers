import { Router } from "express";
import { db } from "../db";
import { snippets } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { generateSummary } from "../services/ai";
import { NewSnippet } from "../types/snippet";

const router = Router();

// Create Snippet
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        error: "Text content is required and must be a non-empty string.",
      });
    }

    const summary = await generateSummary(text);

    const newSnippetData: NewSnippet = {
      text: text.trim(),
      summary,
    };

    const insertedSnippets = await db
      .insert(snippets)
      .values(newSnippetData)
      .returning();

    if (insertedSnippets.length === 0) {
      throw new Error("Failed to insert snippet into database.");
    }

    const insertedSnippet = insertedSnippets[0];

    // Exclude createdAt for consistency with requirements example (though useful to keep)
    const {
      id,
      text: returnedText,
      summary: returnedSummary,
    } = insertedSnippet;

    return res
      .status(201)
      .json({ id, text: returnedText, summary: returnedSummary });
  } catch (error: any) {
    console.error("Error creating snippet:", error);
    return res
      .status(500)
      .json({ error: "Internal server error. Could not create snippet." });
  }
});

// List All Snippets
router.get("/", async (req, res) => {
  try {
    const allSnippets = await db.query.snippets.findMany({
      orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
    });

    // Remove createdAt for consistency with requirements
    const formattedSnippets = allSnippets.map(({ id, text, summary }) => ({
      id,
      text,
      summary,
    }));

    return res.status(200).json(formattedSnippets);
  } catch (error: any) {
    console.error("Error fetching snippets:", error);
    return res
      .status(500)
      .json({ error: "Internal server error. Could not retrieve snippets." });
  }
});

// Get Single Snippet
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Snippet ID is required." });
    }

    const snippet = await db.query.snippets.findFirst({
      where: eq(snippets.id, id),
    });

    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found." });
    }

    // Exclude createdAt for consistency
    const { text, summary } = snippet;
    return res.status(200).json({ id, text, summary });
  } catch (error: any) {
    console.error("Error fetching snippet by ID:", error);
    return res
      .status(500)
      .json({ error: "Internal server error. Could not retrieve snippet." });
  }
});

export default router;
