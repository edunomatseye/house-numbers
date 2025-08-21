CREATE TABLE IF NOT EXISTS "snippets" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"summary" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
