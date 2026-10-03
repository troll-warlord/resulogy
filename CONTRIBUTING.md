# Contributing

## Development

```sh
npm install
npx playwright install chromium
npm run dev
```

Use Node.js `^22.18.0` or `>=24.12.0`. Install the recommended VS Code extensions for Vue, ESLint, Prettier, and YAML schema support.

## Code Structure

- Keep Vue components short and responsible for one rendering concern.
- Put YAML parsing and validation in `src/content` and `src/schema`.
- Put normalized contracts and token serialization in `src/domain`.
- Reuse small semantic primitives instead of sharing theme-specific markup.
- Keep each theme isolated under `src/themes/<theme-id>`.
- Never construct Tailwind classes or raw CSS from YAML values.
- Keep implementation, configuration, tests, generated schemas, and documentation ASCII-only.
- Use LF line endings and one final newline in every authored text file.
- Resume content in `resume.yaml` may use Unicode for real names, languages, and content.

## Adding Schema Fields

1. Update the Zod source schema.
2. Update normalization and domain types when required.
3. Add valid and invalid fixtures.
4. Run `npm run schema:generate`.
5. Update the YAML or theme documentation.

## Verification

Run the complete suite before opening a pull request:

```sh
npm run check
```

Chrome or Edge is the authoritative print renderer. Review both A4 and Letter when changing typography, spacing, fonts, section markup, or print CSS.

When changing direct export behavior, run the focused smoke test before the full suite:

```sh
npm run test:pdf-cli
```
