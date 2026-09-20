# Recommendations for improvement

How I would take this suite further, in the order I would do it.

## 1. CI/CD

[`.github/workflows/e2e.yml`](.github/workflows/e2e.yml) already runs on every push and pull
request: the `@smoke` subset first as a fast gate, then the full suite, with the HTML report and
failure screenshots uploaded as artifacts, plus a nightly scheduled run.

Next: add `npm run lint` and `npm run format:check` as steps so the ESLint and Prettier configs are
enforced rather than advisory and gate merges on the full suite. The nightly run is where I would
watch for drift caused by the live site rather than by a code change, on a third-party target,
"the suite broke and nobody touched it" is a signal about the app, not the tests.

## 2. Suite organization and selective runs

Tagging is implemented: core paths carry `@smoke` via `@cypress/grep`, so `npm run test:smoke`
covers one path per page in ~22s against ~90s for all 35. Everything untagged is the regression
set.

At real scale, shard specs across containers with Cypress Cloud or `cypress-split`, the suite is
already parallel-safe because no spec shares state. Keep one page object per page, split specs by
feature rather than by file size and promote anything used by three or more specs into
`support/commands.js`.

## 3. Test data

Keep the faker-backed factory for uniqueness, but on a real product seed state through the API
instead of the UI: the pagination test spends 19 of the suite's 90 seconds creating eight records
through a form, which is nineteen seconds spent testing nothing. `cy.session()` for authenticated
flows once a login exists.

## 4. Testability changes in the application

The single highest-leverage change is not in this repo: add `data-test` attributes to the
components. Web Tables was rebuilt from React-Table to a Bootstrap table at some point, which
invalidated every class-based selector written against it. Attributes owned by the test suite
survive that kind of rewrite; CSS classes do not.

## 5. Metrics worth tracking

Pass rate per spec over time, flake rate (passed-on-retry count), p95 duration per spec,
time-to-first-failure and bug escape rate. Flake rate is the one I would alert on: a rising number
means either a broken test or a race in the application and both are worth knowing before a
release rather than after.

## 6. Coverage to add next

Accessibility smoke checks with `cypress-axe` on the form pages and a mobile viewport pass.

The signed-in area is now covered: accounts are created through `POST /Account/v1/User` with faker
data, sign-in runs once through `cy.session()` and each API block deletes the user it created.
Those specs are tagged `@creates-account` so a run can opt out of adding users to a shared server.

Beyond that, the API specs are hand-written against observed behaviour; generating contract checks
from `/swagger.json` would keep them honest as the API changes.
