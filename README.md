# Steady personal dashboard

A static, browser-only salary and bonus dashboard. No accounts, backend, database, dependencies, or build step.

## Local development

Run `npm run dev` in this folder, then open http://localhost:8080. Requires Python 3; npm is only a command shortcut. Alternatively run `python3 -m http.server 8080 --bind 127.0.0.1` directly.

Run `npm test` for calculation and persistence checks (requires Node.js).

## Files

- `index.html`: setup form and dashboard
- `styles.css`: responsive styles
- `js/calculations.js`: workday and annual accrual calculations
- `js/storage.js`: storage key and backup validation
- `js/app.js`: interaction, rendering, persistence and backups
- `js/pets.js`: turtle states, celebrations and hammer surprises

## Behavior

Salary and bonus accrue Monday–Friday during the selected workday hours (default 9 a.m.–5 p.m.) in the browser's local timezone. Holidays are included. Annual rates use actual weekdays in the current calendar year. A later employment start prorates accrual. The annual and daily income rings and the expandable bonus bar refresh every second. Editing compensation recalculates the displayed year; this is an estimate, not payroll history.

Settings save in localStorage when “Remember my settings in this browser” is checked and the form is submitted. Unchecking and submitting removes saved settings. Sample mode does not overwrite an existing save. Export/import provides manual backups. Clear my data removes this app's storage entry. No financial inputs are sent over the network or placed in URLs.

Browser storage is specific to the origin and browser profile. Other users of that profile can see saved data. Backups are unencrypted JSON. Changing domains requires export/import. Timezone follows the current device; a fixed timezone setting is deferred.

## Deployment

Publish `index.html`, `styles.css`, and `js/` to GitHub Pages or Azure Static Web Apps. No build command is required. Use a stable dedicated origin when possible.

## Remaining before launch

- Inspect desktop and mobile layouts in a real browser.
- Verify reload, import/export downloads, and unavailable-storage behavior in a real browser.
- Choose the production domain and deploy.
