# Surplus Spark Network — Frontend

This is the **React + TypeScript** frontend for the Surplus Spark Network platform.

> For full project documentation, setup instructions, and API reference, see the [root README](../README.md).

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool & dev server
- **Tailwind CSS** — styling
- **Shadcn/ui** — component library
- **React Query** — data fetching
- **React Hook Form** + **Zod** — forms & validation

## Quick Start

```sh
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Fill in your API URL and API keys in .env

# 3. Start the development server
npm run dev
```

App runs at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

Create a `frontend/.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_HUGGING_FACE_API_KEY=your_hugging_face_key   # optional
```

## Folder Structure

```
src/
├── components/       # Reusable UI components (by role + shared ui/)
├── pages/            # Route-level page components + dashboards/
├── hooks/            # Custom React hooks
├── lib/              # Utility functions (AI, Maps, API client)
├── types/            # TypeScript type definitions
└── data/             # Static data (sponsors, etc.)
```
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7a239520-a66e-4301-8b6e-131cf3517536) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
