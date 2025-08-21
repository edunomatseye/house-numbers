import request from "supertest";
import { createApp } from "../src/app";
import { db } from "../src/db";
import { snippets } from "../src/db/schema";
import * as aiService from "../src/services/ai"; // Import AI service for mocking
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";

const app = createApp(); // Get the app instance
let testSnippetId: string; // To store a created snippet ID for testing reads

describe("Snippets API", () => {
  // Mock the AI service for predictable test results and to avoid actual API calls
  beforeEach(() => {
    vi.spyOn(aiService, "generateSummary").mockImplementation(
      async (text: string) => {
        // Create a deterministic summary mock
        const words = text.split(" ");
        return `MOCKED_SUMMARY: ${words.slice(0, 5).join(" ")}${
          words.length > 5 ? "..." : ""
        }`;
      }
    );
  });

  afterEach(async () => {
    // Clean up database after each test
    await db.delete(snippets);
    vi.clearAllMocks();
  });

  it("POST /snippets should create a new snippet with summary", async () => {
    const rawText =
      "This is a test document that needs to be summarized by the AI service.";
    const expectedSummary = "MOCKED_SUMMARY: This is a test document..."; // Based on mock logic

    const res = await request(app)
      .post("/snippets")
      .send({ text: rawText })
      .expect(201)
      .expect("Content-Type", /json/);

    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.id).toBe("string");
    expect(res.body.text).toBe(rawText);
    expect(res.body.summary).toBe(expectedSummary);

    // Verify it's in the database
    const dbSnippet = await db.query.snippets.findFirst({
      where: (s, { eq }) => eq(s.id, res.body.id),
    });
    expect(dbSnippet).toBeDefined();
    expect(dbSnippet?.text).toBe(rawText);
    expect(dbSnippet?.summary).toBe(expectedSummary);

    testSnippetId = res.body.id; // Store for subsequent tests
  });

  it("POST /snippets should return 400 for missing text", async () => {
    await request(app)
      .post("/snippets")
      .send({})
      .expect(400)
      .expect("Content-Type", /json/);
  });

  it("POST /snippets should return 400 for empty text", async () => {
    await request(app)
      .post("/snippets")
      .send({ text: "   " })
      .expect(400)
      .expect("Content-Type", /json/);
  });

  it("GET /snippets should return an empty array if no snippets exist", async () => {
    const res = await request(app)
      .get("/snippets")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body).toEqual([]);
  });

  it("GET /snippets should return a list of all snippets", async () => {
    // Create some snippets first
    await request(app).post("/snippets").send({ text: "Snippet One text." });
    await request(app).post("/snippets").send({ text: "Snippet Two text." });

    const res = await request(app)
      .get("/snippets")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("text");
    expect(res.body[0]).toHaveProperty("summary");
    expect(res.body[0]).not.toHaveProperty("createdAt"); // Ensure createdAt is not returned
  });

  it("GET /snippets/:id should return a specific snippet", async () => {
    const resPost = await request(app)
      .post("/snippets")
      .send({ text: "A unique snippet to be found by ID." });

    const id = resPost.body.id;

    const resGet = await request(app)
      .get(`/snippets/${id}`)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(resGet.body).toEqual({
      id: id,
      text: "A unique snippet to be found by ID.",
      summary: "MOCKED_SUMMARY: A unique snippet to be...",
    });
  });

  it("GET /snippets/:id should return 404 if snippet not found", async () => {
    await request(app)
      .get("/snippets/non-existent-id-123")
      .expect(404)
      .expect("Content-Type", /json/);
  });

  it("GET /snippets/:id should return 400 for invalid ID format (non-string)", async () => {
    // Assuming UUID validation is implicit or handled by DB driver if not a string
    // Supertest might not catch this early, but the route should be robust
    await request(app)
      .get("/snippets/123") // Example of a non-UUID that might fail findOne
      .expect(404); // Or 400 if explicit validation is added
  });
});
