# NotesApp-Fullstack

A modern, fullstack collaborative note-taking application powered by React 19, Vite, Express 5, and MongoDB with Auth0 authentication.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Auth0](https://img.shields.io/badge/Auth0-Secured-orange?logo=auth0)](https://auth0.com/)

## Installation

Clone the repository and install dependencies in both client and server directories:

```bash
git clone https://github.com/DiaztMF/NotesApp-Fullstack.git
cd NotesApp-Fullstack

# Install client packages
cd frontend
npm install

# Install server packages
cd ../backend
npm install
```

## Quick Start

1. Create a `.env` file in `backend/`:

```bash
PORT=5000
MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/notesapp?retryWrites=true&w=majority"
```

2. Start the Express backend server:

```bash
cd backend
npm run dev
```

3. In a separate terminal, launch the Vite frontend:

```bash
cd frontend
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## What is NotesApp-Fullstack?

`NotesApp-Fullstack` is an end-to-end notes management system featuring rich text authoring, label tagging, and real-time cloud persistence. User identity and session security are delegated to Auth0, while notes are synchronized with a MongoDB Atlas cluster.

## Why NotesApp-Fullstack?

Local storage note-taking apps lose state across devices, and traditional cookie session architectures require heavy authentication maintenance. `NotesApp-Fullstack` couples modern token-based single-sign-on (Auth0) with a decoupled REST API on Express 5 for seamless multi-device access.

## API / Routes

### Express Backend Endpoints
- `GET /api/notes`: Fetches all notes owned by the authenticated user.
- `POST /api/notes`: Creates a new note with title, markdown body, and color labels.
- `PUT /api/notes/:id`: Updates an existing note.
- `DELETE /api/notes/:id`: Removes a note record from MongoDB.

## Examples

Fetching authenticated user notes from the React client:

```typescript
export async function fetchUserNotes(accessToken: string) {
  const res = await fetch('http://localhost:5000/api/notes', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error('Failed to load notes');
  return await res.json();
}
```

## Architecture & Development Guides

- Frontend Architecture: Vite, React 19, Radix UI primitives, and Tailwind CSS.
- Backend Architecture: Express 5, CORS middleware, and native MongoDB driver.
- Authentication: `@auth0/auth0-react` securing client routing and bearer token propagation.

## License

MIT License. See [LICENSE](LICENSE) for full details.