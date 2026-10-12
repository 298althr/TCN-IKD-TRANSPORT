How should Programme, Route, and Bus relate? This defines the entire capacity engine and data model.
1 of 4
A
One route = one bus (1:1)
Each route has exactly one bus with one capacity. Simplest; matches 'each route/bus' wording in BRD Section 15. Capacity tracked per route.
B
Route can have multiple buses
A popular route can be assigned several buses; capacity is the sum. More flexible but needs a bus-assignment layer and per-bus seat tracking.
C
Programme has buses directly
Buses attach to the programme, routes are just pickup labels. Simpler routing, but loses per-route capacity control.


==========


What stack should the build actually use? (PRD recommends all-TypeScript; your project memory leans Python.)
2 of 4
A
Next.js + Supabase (PRD pick)
Next.js API routes, Supabase Postgres+Auth+Realtime, Vercel hosting. Single TS codebase, realtime seat updates near-free, minimal DevOps.
B
FastAPI + React + Postgres
Python/FastAPI backend, React PWA frontend, managed Postgres. Matches your house Python stack; split codebase, slightly more infra.
C
Next.js frontend + FastAPI backend
TS PWA frontend, Python API. Best-of-both but two languages to maintain — most overhead for this scale.


==========

How should seats be protected during payment (the last-seat-during-checkout problem)?
3 of 4
A
TTL hold on booking start
Reserve the seat for e.g. 10 min when checkout begins; release automatically if payment isn't completed. Prevents both overbooking and leaked seats. Recommended.
B
Decrement only on payment success
Simplest; seat stays available until paid. Risk: two members can both pay for the last seat, requiring a refund.
C
Decrement on booking, manual cleanup
Seat taken immediately; admin/marshal frees abandoned ones. Risk: seats leak and look full when they aren't.
﻿


=========

How should the Friday-6pm booking window (req #6) and auto-close-at-capacity be handled?
4 of 4
A
Scheduler/cron component
A scheduled job opens/closes booking windows automatically per programme config. Fully automated, matches req #6 intent. Needs a job runner.
B
On-demand time check
No scheduler; booking availability computed from open/close timestamps whenever a member loads the page. Simpler, no infra, but no proactive notifications on open.
C
Manual admin toggle
Admin opens/closes booking manually from the dashboard. Zero automation; relies on someone remembering Friday 6pm.
﻿
