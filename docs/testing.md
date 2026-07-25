# Testing

Run the complete local checks:

```bash
npm ci
npm run quality
npx playwright install chromium
npm run test:e2e
```

Coverage focus:

- Unit checks for money formatting and deterministic checkout totals.
- Redux checks for shared workbench locale and failure preferences.
- Reducer checks for loading, ready, and error transitions.
- Runtime-contract checks for valid and invalid custom-element payloads.
- Integration checks for async loading, metric callbacks, and payment state.
- Accessibility smoke check with `axe-core`.
- Custom-element checks for Shadow DOM rendering and composed events.
- Static Storybook build for documented success and error states.
- Desktop/mobile Playwright regression for interaction, overflow, and rendered
  axe-core checks.

CI runs the same frozen-install, static, test, build, audit, and browser gates
for pushes to `main` and pull requests.
