# Snippet Summarizer Service

This project implements a small service to create, read, and list text snippets. Each snippet is stored in a PostgreSQL database with a short, AI-generated summary.

The service is split into two main components:

1. **Backend API:** Built with Express.js and TypeScript, using Drizzle ORM for PostgreSQL.
2. **Frontend UI:** A React application powered by Vite and TanStack Router.

## Features

- **Create Snippet:** Accepts raw text, generates a summary using OpenAI, and stores it.
- **Read Snippet:** Retrieve a single snippet by its ID.
- **List Snippets:** Fetch all stored snippets.
- **Tech Stack:** Node.js 20+, TypeScript, Express, Drizzle ORM, PostgreSQL, React, TanStack Router.
- **Testing:** Backend uses Vitest and Supertest for TDD.
- **Containerization:** Docker and Docker Compose for easy setup and deployment.
- **Environment Management:** API keys and database credentials managed via environment variables.

## Prerequisites

### Local Development

- Node.js 20+
- npm or yarn
- Docker and Docker Compose (highly recommended for unified environment)
- A running PostgreSQL instance (or use Docker Compose)
- An [OpenAI API Key](https://platform.openai.com/account/api-keys)

## Setup

1. **Clone the repository:**

   ```bash
   git clone [YOUR_REPO_URL]
   cd snippet-summarizer
   ```

2. **Environment Variables:**
   Copy the example environment file and fill in your details:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file:

   - `OPENAI_API_KEY`: Your OpenAI API key (e.g., `sk-xxxxxxxxxxxxxxxxxxxx`).
   - `DATABASE_URL`: Connection string for your PostgreSQL database (e.g., `postgresql://user:password@localhost:5432/snippets_db` for local, or `postgresql://user:password@db:5432/snippets_db` for Docker Compose).

## Running the Application

### 1. With Docker Compose (Recommended)

This method sets up the PostgreSQL database, backend API, and frontend UI in isolated containers. Tests are run automatically during backend container startup.

```bash
docker compose up --build
```

- The `api` service will run `npm test` during its build process. If tests pass, the API server will start on `http://localhost:3000`.
- The `web` service will start the frontend development server on `http://localhost:3030`.

### 2. Local Development (without Docker Compose)

#### 2.1. Start PostgreSQL Database

Ensure you have a PostgreSQL server running. You can use Docker for this:

```bash
docker run --name some-postgres -p 5432:5432 -e POSTGRES_DB=snippets_db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -d postgres:16-alpine
```

#### 2.2. Backend Setup

```bash
cd backend
npm install # or yarn install
npm run migrate # Run Drizzle migrations to create tables
npm run dev
```

The API server will be available at `http://localhost:3000`.

#### 2.3. Frontend Setup

```bash
cd frontend
npm install # or yarn install
npm run dev
```

The frontend UI will be available at `http://localhost:3030`.

## API Endpoints

The backend API runs on `http://localhost:3000`.

### 1. Create a Snippet

**POST** `/snippets`

```json
{
  "text": "This is a very long blog draft about the history of artificial intelligence and its impact on modern society. It covers early concepts like automata, the Turing test, and the Dartmouth workshop, leading up to neural networks and large language models. The summary should be concise."
}
```

**Example `curl` request:**

```bash
curl -X POST \
  http://localhost:3000/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a very long blog draft about the history of artificial intelligence and its impact on modern society. It covers early concepts like automata, the Turing test, and the Dartmouth workshop, leading up to neural networks and large language models. The summary should be concise."
  }'
```

**Example Response (201 Created):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "text": "This is a very long blog draft...",
  "summary": "AI history from automata to LLMs, covering Turing test and neural networks."
}
```

### 2. List All Snippets

**GET** `/snippets`

**Example `curl` request:**

```bash
curl http://localhost:3000/snippets
```

**Example Response (200 OK):**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "text": "...",
    "summary": "..."
  },
  {
    "id": "f5e4d3c2-b1a0-9876-5432-10fedcba9876",
    "text": "...",
    "summary": "..."
  }
]
```

### 3. Get a Single Snippet by ID

**GET** `/snippets/:id`

**Example `curl` request:**

```bash
curl http://localhost:3000/snippets/a1b2c3d4-e5f6-7890-1234-567890abcdef
```

**Example Response (200 OK):**

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "text": "This is a very long blog draft...",
  "summary": "AI history from automata to LLMs, covering Turing test and neural networks."
}
```

## Testing

### Backend Tests

Backend tests are written with Vitest and use Supertest for API integration.
They utilize a real PostgreSQL connection (via `DATABASE_URL` env var) and mock the OpenAI API.

- **Local:**

  ```bash
  cd backend
  npm test
  ```

- **Docker:**
  Tests are executed automatically when the `api` service starts via `docker compose up`. If tests fail, the container will exit.

## Post-challenge Reflection

### What I'd Improve with More Time

1. **Robust Error Handling & Logging:** Implement a more comprehensive error handling middleware in Express, differentiating between operational errors and programmer errors. Integrate a structured logger (e.g., Winston, Pino) for better observability.
2. **API Versioning:** For future changes, consider API versioning (e.g., `/v1/snippets`).
3. **Authentication & Authorization (Stretch Goal):** Implement JWT-based authentication for user management and role-based access control to snippets.
4. **Rate Limiting & Caching:** Add rate limiting to prevent abuse and consider caching mechanisms (e.g., Redis) for frequently accessed data to improve performance.
5. **Streaming AI Summary (Stretch Goal):** Implement Server-Sent Events (SSE) to stream the AI summary as it's generated, improving perceived performance for the user.
6. **Advanced Frontend Features:**
   - Better UX for long texts (e.g., character count, responsive layout).
   - Search/filter functionality for snippets.
   - Client-side form validation feedback.
7. **CI/CD Pipeline (Stretch Goal):** Set up GitHub Actions or similar to lint, test, build Docker images, and potentially deploy automatically.
8. **Database Migrations:** Implement a more robust Drizzle migration strategy beyond simple `drizzle-kit push` for production-grade schema evolution.
9. **OpenAPI/Swagger Documentation:** Auto-generate API documentation for easy consumption by other teams.
10. **Smaller Docker Images:** Utilize multi-stage builds in Dockerfiles to reduce final image size.

### Trade-offs Made

1. **Simplified AI Prompt:** The prompt for OpenAI is intentionally simple ("Summarize in ≤ 30 words") as per the requirement. In a real application, more sophisticated prompts, few-shot examples, or fine-tuning might be used for better summary quality and control.
2. **Synchronous AI Call:** The AI summary generation is a blocking call within the `POST /snippets` endpoint. For very long or high-volume summaries, this could be offloaded to a background queue (e.g., with RabbitMQ/Redis BullMQ) to keep the API responsive.
3. **Minimal Frontend Styling:** The frontend is functionally complete but has minimal styling to focus on core functionality and framework usage.
4. **No Drizzle Migrations in Docker-Compose:** For simplicity, the `docker-compose.yml` doesn't explicitly run Drizzle migrations. In a production setup, a separate `init` script or a dedicated migration step would be needed to ensure the database schema is up-to-date. (This is addressed with `npm run migrate` in local instructions).
5. **Basic Error Handling:** Error handling is present but relatively basic (500 for most server errors, 400 for validation). More specific error codes and messages could be provided.
6. **No CORS Configuration:** For Docker Compose setup, direct communication between `web` and `api` containers works. For independent local runs, the frontend might need specific CORS headers allowed on the backend for development. This is implicit when calling `http://api:3000` from `http://web:3030` internally in Docker, but `http://localhost:3000` from `http://localhost:3030` locally could require it.
