# SPARK

SPARK is a mobile-first web app MVP for finding nearby workout groups and starting solo or group workouts quickly.

This repository is organized as a team product workspace for a planner portfolio. The goal is to show not only the screens, but also the product reasoning, MVP scope, routing structure, and future admin/data integration plan.

## Product Summary

SPARK helps users discover workout meetups around them, join or create groups, and start workouts from one central flow.

The product direction is a dark, premium sports UI with neon lime and purple accents inspired by energetic running and ride-mode experiences.

## Problem

People often want to exercise but struggle with three things:

- Finding nearby people with a similar time, level, and activity preference
- Starting a workout without too much setup
- Keeping motivation through records, challenges, and social accountability

SPARK focuses on reducing the gap between "I should work out" and "I can start now."

## Target Users

- Users who want nearby running, riding, walking, gym, hiking, or free workout groups
- Beginners who need level-matched meetups instead of intimidating open groups
- Active users who want routine tracking, challenges, and workout logs
- Local partners or fitness businesses that can later expose events, ads, and meetup locations through AdminApp

## MVP Scope

The first MVP prioritizes three core jobs:

| Priority | Feature | Purpose |
|---|---|---|
| P0 | Workout start | Start solo workouts or group workouts from the Spark hub |
| P0 | Group discovery | Browse nearby meetups with filters such as distance, time, activity, level, age/gender, capacity, and price |
| P0 | Group CRUD | Create, view, edit, delete, join, and cancel meetup participation |

Secondary MVP surfaces support the main loop:

- Home dashboard with workout CTA, today status, routine, recommended meetups, recent logs, and partner ad slots
- Challenge page for app-provided personal goals and ranking/event concepts
- Profile page for workout feed, badges, friends, joined groups, and settings

## Current Web App

Implemented routes:

```txt
/
/home
/groups
/groups/new
/groups/[groupId]
/groups/[groupId]/edit
/spark
/spark/solo
/spark/group
/challenge
/profile
```

Current implementation uses mock/shared data and browser localStorage for portfolio-friendly CRUD interactions.

## Information Architecture

```txt
Home        -> dashboard and quick workout entry
Groups      -> nearby meetup discovery and group CRUD
Spark       -> solo workout and group workout start hub
Challenge   -> app-provided goals, rankings, and events
Profile     -> workout records, badges, friends, groups, and settings
```

## Team Workspace Structure

The repository is separated so the user app and admin app can be developed and deployed independently.

```txt
sparkProject/
  apps/
    sparkApp/    # user-facing web app
    adminApp/    # partner/admin app placeholder
```

When the admin app is added later, it should live in `apps/adminApp` and connect to shared data contracts instead of being mixed into the user app.

## Admin Integration Plan

AdminApp is planned as the partner and operations surface.

Expected AdminApp data:

- Partner businesses
- Partner locations
- Promotions and ads
- App-provided challenges
- Featured or recommended meetups

Expected App exposure:

- Home partner ad cards
- Group discovery location cards
- Partner-linked meetup creation
- Challenge list
- Featured recommendation modules

## Planner Portfolio Focus

This project is intended to demonstrate:

- Product problem definition and MVP prioritization
- Mobile-first IA and routing design
- User journey design for discovery, joining, and workout start
- Team-ready repository structure
- App/Admin separation for future data integration
- UX decisions around motivation, trust, filters, and repeat workout behavior

## Tech Stack

| Area | Stack |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | React, Tailwind CSS |
| Icons | lucide-react |
| Data | Mock data, shared types, localStorage CRUD |
| Deployment | Vercel planned |

## Local Development

Run the user app:

```bash
cd apps/sparkApp
npm install
npm run dev
```

Build check:

```bash
cd apps/sparkApp
npm run lint
npm run build
```

## Vercel Deployment

Create a Vercel project for the user app with this root directory:

```txt
apps/sparkApp
```

When AdminApp is ready, create a separate Vercel project with:

```txt
apps/adminApp
```

## Next Documentation Tasks

- `docs/PRD.md`: product requirements and MVP decisions
- `docs/IA.md`: menu structure and user flows
- `docs/user-flows.md`: onboarding, group join, workout start, group creation
- `docs/admin-integration.md`: App/Admin data model and sync strategy
