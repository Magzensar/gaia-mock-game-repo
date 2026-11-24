# Past tickets (mock Jira export, for GAIA)

Synthetic tickets for RAG search, duplicate detection and "this came back" checks.
Every record carries `"source": "mock"`.

| Field | Example | Notes |
| --- | --- | --- |
| ticket_id | `"GAME-142"` | unique |
| title | `"Visible seam in area-4 background, row 30"` | |
| type | `"crash"` | one of `crash`, `frametime`, `memory`, `load`, `balance`, `art`, `ui` |
| status | `"resolved"` | one of `open`, `resolved`, `duplicate`, `wontfix` |
| component | `"weapon"` | game area the ticket was filed against |
| description | text | what was seen |
| stack_signature | `"TypeError\|docs/js/init.js:HTMLCanvasElement.<anonymous>"` or `null` | exception type, then file:function of the top frames |
| root_cause | text | empty while the ticket is open |
| fix_summary | text | empty while the ticket is open |
| created_at / resolved_at | ISO 8601 | `resolved_at` is `null` while open |
| fix_commit / fix_build_id | full SHA / `"1031"` | `null` when not fixed in this repo |
| duplicate_of | `"GAME-104"` or `null` | set when status is `duplicate` |
| source | `"mock"` | |

**Time rule:** when investigating build N, only use tickets with `created_at` earlier than
build N's `created_at` (from `ci/builds.json`).
