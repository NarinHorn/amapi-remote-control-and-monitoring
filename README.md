# Remote Control & Monitoring (Next.js + shadcn/ui)

This app demonstrates a production-ready UI slice for Android device remote control and monitoring, inspired by the provided project scope and workflow references.

- Scope detail: [Google Slides](https://docs.google.com/presentation/d/1DwJ-HkFIAUIVsSAf5gqvEUscXYeBRfdv/edit?slide=id.p1#slide=id.p1)
- Workflow board: [Figma board](https://www.figma.com/board/TUeEYNuLlbZmRA9GN8i2oP/Copy-ADMS-Workflow?node-id=0-1&p=f&t=cxldnAf632QOxPO9-0)

## Stack
- Next.js App Router, TypeScript
- Tailwind CSS (v4), shadcn/ui, lucide-react, sonner
- SWR for data fetching, EventSource for SSE telemetry

## Features
- Devices list with search, status badges, last-seen, and battery indicators
- Device detail with live telemetry via SSE (battery, CPU, storage)
- Remote actions: lock, reboot, wipe, show message
- Command history with statuses and toasts
- Mocked API endpoints and in-memory store for local development

## Getting started
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Project structure (selected)
- `src/app/api/devices` — list devices
- `src/app/api/devices/[id]/telemetry` — SSE stream per device
- `src/app/api/devices/[id]/commands` — send command
- `src/app/api/devices/[id]/commands/history` — command history
- `src/components/devices` — UI for list and detail pages
- `src/server/mockStore.ts` — mock data and telemetry simulator
- `src/types/device.ts` — types used across the feature

## Notes
- This module focuses only on Remote Control & Monitoring.
- Replace mocked store with real Android Management API integration when backend is available.
- Security considerations: auth, RBAC, rate-limiting, command auditing should be added in production.
