# Summary report: demoqa.com Cypress suite

**Scope.** Six areas: Practice Form, Web Tables (CRUD, search, pagination), Text Box, Alerts and
Modal Dialogs, Select Menu, and the Book Store, covered both anonymously and signed in, through the
UI and against its documented API.

| Main suite                   | **71 tests, 71 passing, 0 failing** (Cypress 15.21.1, headless) |
| ---------------------------- | --------------------------------------------------------------- |
| Split                        | 57 anonymous specs in ~2m, plus 14 signed-in specs              |
| Smoke subset                 | 11 tests, ~30s                                                  |
| Flaky tests after mitigation | 0 across repeated runs                                          |
| Bugs reported                | **8**, see [BUGS.md](BUGS.md)                                   |
| Artifacts                    | `artifacts/` (run output, HTML report, bug evidence)            |

**Approach.** I explored the application first and built tests against the pages as they are today,
not as published tutorials describe them, since most documented selectors for this site are stale.
Each page is a page object with one centralised selector map, so specs contain no CSS and assert on
data rather than layout. Test data comes from a faker factory constrained to what the application
accepts, so specs are independent and every run uses different data. Accounts are created through
the API, and each spec deletes the users it creates.

**Key decisions and trade-offs.**

- Ad and analytics hosts are blocked at the network layer, which removed almost all of this site's
  known instability. The page under test is then not identical to what a user sees, which is one
  line of config to revert.
- Uncaught exceptions are filtered by known third-party patterns rather than disabled wholesale,
  which is why a genuine application error surfaced instead of being swallowed.
- Bugs are reported, not encoded as tests. Anything the application gets wrong becomes a ticket
  rather than an assertion that would enshrine it.
- Retries run only in CI, no fixed waits anywhere (enforced by lint), and sign-in runs once per
  spec through a cached session.

**Bugs found.** Two are serious: deleting any Web Tables record also deletes every record added in
the same session, which is silent data loss, and a confirmation dialog cannot be closed by its own
button. Two are in the API: a missing required parameter returns a server error that exposes
internal detail, and a failed login is answered with a success status code. Four are minor, covering
email validation, missing empty states, duplicated element ids and a misspelled label.

**Notable insights.** Two findings changed the suite rather than the report. A phone field appeared
to accept fewer digits than it requires, but only under Cypress, because of how the tool sets input
values; typed by hand, the browser blocks it. Reporting that would have sent a developer chasing a
bug that does not exist, so the rule is left unasserted and the reason documented. Separately, one
of my own assertions passed because its selector matched nothing. A check that cannot tell "empty"
from "not found" is worse than no check, so the count assertions now prove the table exists first.

**Known limitations.** Web Tables has no seeding endpoint, so its coverage leans on the three
records the page ships with. Registration through the form is not automated, because its invisible
bot check never resolves inside the test runner; accounts are created through the API instead and
the form's own validation is covered separately. Accessibility and mobile viewports are out of
scope.

See [RECOMMENDATIONS.md](RECOMMENDATIONS.md) for how I would take this further.
