# TaskFlow Frontend

React/Vite frontend for the TaskFlow todo app.

## Features

- Display todo list from the backend API
- Create todos with client-side validation
- Edit todos inline
- Delete todos with confirmation dialog
- Toggle complete/incomplete
- Search by title with debounce
- Filter by all, active, and completed
- Loading, empty, no-results, error, retry, and pending states
- Responsive TailwindCSS UI
- Component tests with Vitest and React Testing Library

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Vitest
- React Testing Library
- ESLint + Prettier

## Backend Requirement

This frontend expects the TaskFlow backend API to be running.

Default API URL:

```text
http://localhost:4000/api
```

Start the backend repo first:

```bash
cd ../taskflow-backend
npm install
copy .env.example .env
npx prisma migrate deploy
npm run dev
```

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Open:

```text
http://localhost:5173
```

## Run With Docker

Make sure the backend API is running first at `http://localhost:4000/api`.

From this frontend repo:

```bash
docker compose -f docker-compose.frontend.yml up --build
```

Open:

```text
http://localhost:5173
```

Stop and remove the container:

```bash
docker compose -f docker-compose.frontend.yml down
```

The Docker image bakes `VITE_API_BASE_URL` at build time. To use a different backend URL, edit `docker-compose.frontend.yml`:

```yaml
args:
  VITE_API_BASE_URL: https://your-backend-url/api
```

## Environment Variables

Create `.env` from `.env.example`.

| Variable | Example | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:4000/api` | Backend API base URL |

For production, set `VITE_API_BASE_URL` to the deployed backend URL before building.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production assets |
| `npm run preview` | Preview production build locally |
| `npm test` | Run component tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run format` | Format source files |

## API Contract Used

The frontend calls these backend endpoints:

| Method | Path | UI usage |
|---|---|---|
| `GET` | `/api/todos?search=&status=&page=&limit=` | Load list, search, filter |
| `POST` | `/api/todos` | Create todo |
| `PUT` | `/api/todos/:id` | Edit todo |
| `PATCH` | `/api/todos/:id/toggle` | Toggle completion |
| `DELETE` | `/api/todos/:id` | Delete todo |

Expected list response:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

Expected error response:

```json
{
  "error": {
    "message": "Title cannot be empty",
    "code": "VALIDATION_ERROR",
    "field": "title"
  }
}
```

## Tests

```bash
npm test
```

Current verified result: `6 tests passed`.

## Build

```bash
npm run build
```

The compiled app is written to `dist/`.

Preview the build:

```bash
npm run preview
```

## Deploy Frontend To Vercel

1. Push this frontend folder as its own GitHub repo.
2. Create a new Vercel project from that repo.
3. Set the environment variable:

```env
VITE_API_BASE_URL=https://your-railway-service.up.railway.app/api
```

4. Deploy.

After deployment, update the Railway backend variable:

```env
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

Then redeploy the backend service on Railway.

## Project Structure

```text
src/
  api/                 HTTP client for backend calls
  components/          Todo UI and reusable common components
  context/             TodoProvider and shared state
  hooks/               useTodos and useDebounce
  utils/               Frontend validators
  App.jsx              Main application shell
  main.jsx             React entry point
tests/
  TodoItem.test.jsx    Component behavior tests
```

## UX Notes

- Buttons disable while actions are pending to reduce accidental double submits.
- Delete uses a confirmation dialog before destructive action.
- Search and status filter are combined, not treated as separate modes.
- Empty list and empty search results are shown as different states.
- Backend errors are surfaced in the UI with a retry path where relevant.
