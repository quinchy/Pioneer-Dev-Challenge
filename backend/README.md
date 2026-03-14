# Backend – Restaurant Finder

This is the TypeScript/Node backend for the Restaurant Finder challenge.  
It exposes the `GET /api/execute` endpoint used by the frontend to run natural-language restaurant searches.

---

## Setup for local development

**Prerequisites**

- Bun (v1.3+)
- Node.js / TypeScript toolchain

**Install dependencies**

```bash
cd backend
bun install
```

---

## Environment configuration

Create a `.env` file in the `backend` directory (you can start from `.env.example`) and set:

- `PORT` (optional, default `3001`)
- `API_CODE` – shared code required on each request (must match frontend and challenge spec)
- `OPENAI_API_KEY` – OpenAI API key for message parsing
- `OPENAI_MODEL` – OpenAI model name (defaults to `gpt-4.1-mini`)
- `FOURSQUARE_API_KEY` – Foursquare Places API key

Example:

```env
PORT=3001
API_CODE=pioneer
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4.1-mini
FOURSQUARE_API_KEY=fsq-xxx
```

---

## Running the backend locally

Start the HTTP server:

```bash
cd backend
bun run dev
```

The API will listen on `http://localhost:<PORT>` (default `http://localhost:3001`).

---

## API endpoint and how to test it

**API Route**

```text
GET /api/execute?message=<your_query>&code=pioneerdevai
```

**Example local request**

```bash
curl "http://localhost:3001/api/execute?message=Find%20me%20a%20cheap%20sushi%20restaurant%20in%20downtown%20Los%20Angeles%20that%27s%20open%20now&code=pioneer"
```

High-level behavior:

- Validates `code` against `API_CODE` (returns `401 Unauthorized` if it does not match).
- Uses OpenAI to translate the `message` into structured Foursquare search parameters.
- Calls the Foursquare Places Search API with those parameters.
- Returns a JSON payload containing structured restaurant data (name, address, categories, etc.).

**Deployed API endpoint**

When deployed, the backend is exposed at:

- **Base URL**: `<YOUR_DEPLOYED_BACKEND_URL>`
- **Execute route**: `<YOUR_DEPLOYED_BACKEND_URL>/api/execute?message=...&code=pioneerdevai`

(Replace `<YOUR_DEPLOYED_BACKEND_URL>` with the actual deployed URL used in your submission.)

---

## Tests

**Run the test suite**

```bash
cd backend
bun run test
```

The suite focuses on the most important behavior:

- **`validation/execute.test.ts`** – Query validation for `/api/execute`: accepts a valid `message`, rejects empty or missing `message`.
- **`validation/openai.test.ts`** – Schema for parsed search params: valid payloads, price-range rules (e.g. `min_price` cannot exceed `max_price`), and allowed `sort`/`fields`.
- **`validation/env.test.ts`** – Environment config: test fallbacks when `NODE_ENV` is `test`, and use of provided env vars (e.g. `PORT`, `API_CODE`, API keys).
- **`services/foursquare.service.test.ts`** – Foursquare integration: building the correct request (URL, headers, params), mapping the response to the returned array, and error handling when the upstream API fails.
- **`controllers/execute.controller.test.ts`** – Main flow: success path (parse message → call Foursquare → return 200 with restaurant data) and forwarding errors to `next` when parsing or Foursquare fails.

**Filtering / transformation of Foursquare results**

I shape the Foursquare response by using the Places Search API’s `fields` query parameter. In the OpenAI prompt I instruct the model to set `fields` to only the response fields we want: `name`, `location`, `categories`, `distance`, `tel`, `website`. Those are then sent to Foursquare so the API returns only that data (per their docs, if no fields are specified, all Pro fields are returned by default). Furthermore, once we obtain
the data, we will only return the data.restaurants from the findRestaurants service function so on execute api we only return the array of restaurants 

Relevance is further handled by the other search params (query, near, open_now, price range, sort). The Foursquare service tests cover success and error paths and that the response is passed through correctly; they do not assert the exact `fields` list because that is driven by the parsed LLM output and validated by the openai schema tests.

---

## Backend structure (high level)

- **Routes (`routes/`)**: Wire HTTP paths (e.g. `/api/execute`) to middleware and controllers, keeping framework-specific concerns (Express/router) isolated.
- **Controllers (`controllers/`)**: Contain the main request flow logic (e.g. parse message → call Foursquare → send response) without knowing about routing details.
- **Services (`services/`)**: Encapsulate external integrations and core business logic such as OpenAI parsing and Foursquare API calls, making them easier to mock and reason about.
- **Middleware (`middleware/`)**: Reusable request/response cross‑cutting concerns like auth, validation, logging, and centralized error handling; this keeps controllers and services focused on business logic.
- **Utils (`utils/`)**: Small, framework-agnostic helpers such as logging and `sendResponse` that are shared across the backend.
- **Validation (`validation/`)**: Zod schemas for environment variables, query parameters, and parsed OpenAI/Foursquare data, ensuring everything is validated before it reaches services.
- **Types (`types/`, or co-located types)**: Shared TypeScript types for structured search parameters and API responses, so controllers, services, and validation can agree on a single, type‑safe contract.
