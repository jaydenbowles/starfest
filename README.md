# StartFEST 2026 Schedule

Mobile-first schedule app for StartFEST 2026 (Silicon Slopes) · June 23–24 · Mountain America Event Venue.

**Live:** https://jaydenbowles.github.io/starfest/

## Features

- **Now & Next banner** — see what's happening right now and what's next, at a glance
- **Full schedule** — time-grouped, room + track badges, Day 1 / Day 2 tabs
- **My Agenda** — star sessions to build a personal, chronological agenda (saved on-device)
- **Conflict detection** — overlapping picks are flagged, but still allowed
- **Calendar export** — per-session Google Calendar links + one-tap .ics export of the whole agenda (Mountain Time)
- **Who's going** — attendee lists per session; set your name once and appear in them
- **Light + dark mode** — follows system preference, manual toggle included
- All times Mountain Time (MDT)

## Stack

Plain HTML/CSS/JS — no build step, no dependencies. Hosted on GitHub Pages.

## Local dev

Serve the folder with any static server, e.g. `npx serve .`

## Demo tip

Append `?t=2026-06-23T10:45` (any conference-day time) to simulate the live Now/Next view.
