# VLTHRLAB Meeting Rooms

Internal team meeting infrastructure — content + chat only (no audio/video; decided per sponsor, design-phase tooling).

## Concept

A **room** is a hosted HTML document whose **sections/subsections are the shared context** — agenda, evidence, decision papers. Participants load the same room URL and see the same structure. The room has a lifecycle; when the chair ends the meeting, the URL never dies — it renders **Room Closed** plus a public recap artifact.

```
rooms/<id>/state.json      room lifecycle + metadata (the only mutable file)
rooms/<id>/content.html    the room document — <section data-title> per agenda block, <h3> per subsection
rooms/<id>/recap.html      generated on close — the public artifact
rooms/index.json           registry of all rooms
```

## Lifecycle

| State | Behavior |
|---|---|
| `scheduled` | Room URL live; renders agenda + "not yet open" banner. Chat dormant. |
| `open` | Sections render; TOC tracks progress; chat channel live (poll every 5s). |
| `closed` | **Never 404.** Full-page Room Closed render + `recap_url` link. Chat archived read-only into recap. |

### Room Closed optimization (the explicit requirement)

1. Chair clicks **End Meeting** (admin dashboard → `POST /rooms/{id}/end`).
2. Immediately: `state.json.status = "closed"`, `closed_at` stamped.
3. Same request auto-generates `recap.html` — attendees (from presence pings), sections visited, chat log condensed, decisions logged, next actions.
4. Every participant's open room flips to Room Closed within ≤5s (poll interval).
5. The room URL becomes permanently public — the recap IS the artifact, so the link stays shareable forever. No dead links, no "meeting ended" gray page.

## Admin flow (create a room)

1. Write or upload `content.html` (sections = agenda items; h3 = sub-topics). Same format as the slide deck pattern already used.
2. Add an entry to `rooms/index.json` + a `state.json`.
3. Share the room URL: `room-shell.html?room=<id>`.

## Backend — one Cloudflare Worker (free tier)

Three endpoints; static-file fallback works for state reads so a pure-static deploy already functions for open/closed display:

| Endpoint | Purpose |
|---|---|
| `GET  /rooms/{id}/state` | State JSON (poll target, 5s) |
| `POST /rooms/{id}/end` | Chair-only: flip to closed + generate recap |
| `POST /rooms/{id}/chat` · `GET /rooms/{id}/chat` | Append / read the room's chat log |

Free tier: 100k requests/day — a 10-agent meeting polling every 5s costs ~17k requests/hour. Comfortable. ponytail ceiling: *websockets only when message volume or sub-second sync actually demands it.*

## Agent participation

Agents don't browse — they participate via API:
- **Read the room**: fetch `content.html` + `state.json` (shared context = same sections everyone sees).
- **Speak**: `POST /chat` with `{author, body}` — optionally carrying the tcn-mail envelope header for consistency.
- **React to close**: poll sees `closed` → agent mirrors the recap into `DOCS/MAIL/<role>/` per the mail-log convention.

## Recap artifact format

```yaml
room: <id>
title: <meeting title>
opened_at / closed_at:
attendees: [ ]
sections_covered: [ ]
decisions: [D-nnn references or inline]
actions: [owner — task — due]
transcript: chat log (condensed)
```

Rendered as standalone public `recap.html` — shareable to anyone, including non-team readers (the "small ad" surface: next meeting + context links at the footer).

## What this deliberately isn't

- No auth wall — these rooms are team-internal; room IDs are unguessable enough for now. ponytail: `[auth], [add token gate if rooms ever carry secrets]`
- No audio/video — use a call alongside if needed
- No screen share — the shared sections ARE the screen share
