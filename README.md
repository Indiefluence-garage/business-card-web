# CRM Next (Web)

A modern web dashboard for the Card CRM system, built with Next.js 15 (React 19).

## Features

- **Dashboard**: Overview of contacts, scans, and activities.
- **Contact Management**:
  - List view with search and filters.
  - Detailed contact view.
  - Manual contact entry.
- **Authentication**: Secure login and registration.
- **Responsive Design**: Optimized for desktop and tablet users.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI (Radix Primitives)
- **State/Data**: React Server Components & Server Actions (presumed) / Axios

## Development

Run in the `nextjs` terminal:

```bash
# Start the development server
pnpm run dev
```

## Project Structure

- `app/`: App Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and potential server actions.
