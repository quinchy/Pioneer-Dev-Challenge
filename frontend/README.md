## Restaurant Finder – Frontend (Next.js)

This is the frontend UI for the **Restaurant Finder Coding Challenge**.  
It consumes the backend `GET /api/execute?message=<your_query>&code=pioneerdevai` endpoint and presents a simple, focused interface for searching restaurants via natural‑language input.

---

## Setup and local development

### Requirements

- Bun (used for package scripts)
- Node.js (for the Next.js runtime)

### Install dependencies

```bash
cd frontend
bun install
```

### Environment variables

The frontend needs to know where the backend API is and what `code` to send.

Create a `.env` file in `frontend/` (or copy from `.env.example`) with:

- `NEXT_PUBLIC_API_URL` – base URL of the backend API  
  For local dev, this should match the backend default port: `http://localhost:3001`
- `NEXT_PUBLIC_API_CODE` – shared API code; must match the backend’s expected code  
  For this challenge: `pioneerdevai`

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_CODE=pioneerdevai
```

### Run the dev server

```bash
cd frontend
bun run dev
```

Then open `http://localhost:3000` in your browser.

---

## How to interact with the app

The home page provides all the UI pieces required by the challenge:

- **Text input / textarea**: A large textarea where the user can type a free‑form restaurant request (e.g. “Find me a cheap sushi restaurant in downtown Los Angeles that is open now.”).
- **Submit button**: A single primary “Search Restaurants” button that triggers the search.
- **Loading state**: While the backend request is in flight, a loading view is rendered in the results area.
- **Error handling in the UI**: If the backend returns an error, the results area shows:
  - The backend `message` as a title.
  - The backend `error.detail` (when present) as a description.
- **Results view**:
  - Renders a list of restaurants with name, categories, address, distance, phone, and website where available.
  - Shows a clear **“initial”** state before any search.
  - Shows a distinct **“no results”** message when a search returns an empty list.

All calls go through the backend `GET /api/execute` route; the frontend never talks to Foursquare directly.

---

## Architecture and design choices

- **Feature-based folder structure**
  - The main domain logic lives under `src/features/restaurant-finder/` (types, API client, components).
  - This keeps behavior related to the restaurant search experience cohesive and easier to maintain.

- **Design system with shadcn/ui**
  - UI components such as `card`, `button`, `textarea`, and field helpers are composed from `shadcn/ui`, giving a consistent and easily reusable design system across the app.

- **Zustand for state management**
  - Zustand is used to manage shared UI state (e.g. results and loading) between the search form and the list, so each component can keep a single, focused responsibility while still coordinating via a clean store.

- **Server-rendered page**
  - The home route (`app/page.tsx`) is rendered on the server by Next.js, while the core `RestaurantFinder` feature is implemented as a client component that handles interactions and state. This keeps the entry route fast and SEO‑friendly while still allowing rich client behavior.

- **Result state rendering**
  - A reusable `StateRenderer`/fallback provider handles the four main visual states for the results area:
    - **Loading UI** – when waiting on the backend.
    - **Error UI** – when the backend returns an error.
    - **Initial UI** – before any search has been submitted.
    - **No‑data UI** – when a search succeeds but returns an empty list.
    - **Data UI** – when there are restaurants to display.

---

## How the frontend calls the backend

- The frontend always hits the challenge’s required route on the backend:

```text
GET /api/execute?message=<your_query>&code=pioneerdevai
```

- `message` is taken from the textarea input.
- `code` is read from `NEXT_PUBLIC_API_CODE` (which must be set to `pioneerdevai` to satisfy the spec).
- The `restaurant-finder` API client:
  - Parses the JSON response into typed structures.
  - On success, returns the `restaurants` array for rendering.
  - On error, throws an error object with both `message` and `detail` so the UI can show meaningful feedback.

---

## Testing notes (frontend)

- The challenge only **requires automated tests for the backend** and core parsing/validation/transformation logic.
- Accordingly, this frontend does not ship its own test suite; instead, test coverage is focused on the backend services, middleware, and validation schemas.
- Assumptions:
  - The backend enforces the `code` gate and returns a consistent JSON shape (`success`, `message`, `error.code`, `error.detail`).
  - The deployed backend and UI URLs are documented at the project root for easy manual testing.
