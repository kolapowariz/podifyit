# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

PodifyIt is a Next.js 15 web app that converts PDF documents into AI-generated podcasts. Users upload a PDF, the app extracts text from it client-side, sends the text to a FastAPI backend that generates a conversational podcast script and synthesizes it to audio, and returns a single MP3 for playback.

## Commands

- **Dev server:** `npm run dev` (runs on http://localhost:3000)
- **Build:** `npm run build` (standalone output mode)
- **Start production:** `npm run start`
- **Lint:** `npm run lint` (Next.js ESLint with `next/core-web-vitals` and `next/typescript`)

There is no test framework configured in this project.

## Environment Variables

Defined in `.env` (git-ignored):

- `NEXT_PUBLIC_HF_API_KEY` — Hugging Face API key (client-exposed, unused)
- `NEXT_PUBLIC_BASE_URL` — Base URL for the app (defaults to `http://localhost:3000`, unused)
- `NEXT_PUBLIC_BACKEND_URL` — URL of the FastAPI backend (defaults to `http://localhost:8000`)

## External Dependencies

- **FastAPI backend** running separately (see `backend/` folder)
- **ffmpeg** must be installed on the backend server for audio concatenation

## Architecture

### Pipeline Flow

1. **Client (DragnDrop.tsx):** User drops a PDF → `pdfjs-dist` extracts text in the browser → extracted text is POSTed to FastAPI backend `/podcast`.
2. **FastAPI backend (`backend/main.py`):** Receives text → generates conversational podcast script via OpenAI LLM → synthesizes audio segments via OpenAI TTS → concatenates with ffmpeg → returns final MP3.
3. **Client:** Receives MP3 and plays it in `<audio>` element.

### Key Architectural Notes

- PDF parsing happens **client-side** using `pdfjs-dist` (see `src/components/extracter.ts`). The worker is loaded dynamically via `import("pdfjs-dist/build/pdf.worker.mjs")`.
- The `@ungap/with-resolvers` polyfill is imported in `extracter.ts` for `Promise.withResolvers` compatibility.
- Backend handles all AI processing (script generation + TTS) to keep API keys server-side.

### UI Structure

- Uses the Next.js App Router with a dashboard-style layout: persistent `SideNav` sidebar + main content area.
- Three routes: `/` (home/upload), `/files`, `/podcasts` — the latter two are placeholder pages.
- UI components use **shadcn/ui** (new-york style) with Radix primitives, Tailwind CSS, and `tailwindcss-animate`. Design tokens are CSS variables defined in `globals.css`.
- Icons come from both `@heroicons/react` (sidebar) and `lucide-react` (shadcn default).

### Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json`).
