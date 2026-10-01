# ChronoVerse Clock Widget

A multi-themed clock built with React, TypeScript and Vite. Pick from 14 clock faces inspired by well-known design languages (Apple, Microsoft, NASA) and by Japanese, Indian and Chinese aesthetics. An optional Gemini call adds a short cultural quote for the selected theme.

## Features

- **14 themes**: Swiss Analog, Retro Flip, Nixie Tube, Nebula Elite, Cupertino, Redmond, Mission HUD, Washi & Lacquer, Kyoto, Jaipur, Royal Jali, Beijing, Word Clock, Binary Matrix
- **Settings**: 12/24-hour format, show/hide seconds, adjustable scale
- **Alarms**: create alarms that persist in `localStorage` and ring using the Web Audio API
- **AI cultural quotes**: the cultural themes can fetch a short quote through the Gemini API (`services/geminiService.ts`)

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
cp .env.example .env.local   # then add your own Gemini key (optional)
npm run dev
```

The app runs at http://localhost:3000. Without a key, the clocks and alarms work and only the AI quotes are unavailable.

> **Do not deploy publicly with a real key.** Vite inlines `GEMINI_API_KEY` into the browser bundle, so anyone could read it. For a public deployment, move the Gemini call behind a small server function.

## Build

```bash
npm run build
npm run preview
```

## Notes

The project was started in Google AI Studio and then edited by hand. The original prompt history is in `migrated_prompt_history/`.
