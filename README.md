# Resulogy

Resulogy turns one `resume.yaml` file into a responsive, print-ready resume website and PDF. It is fully static: no backend, database, account, or hosted editor is required.

## Features

- One strict, versioned YAML source for content and presentation
- Generated JSON Schema for editor completion and diagnostics
- Twelve dedicated resume section types plus structured custom sections
- Two ATS-conscious built-in themes: Editorial and Ledger
- Configurable A4 or Letter paper, margins, fonts, colors, density, and bullets
- Locally bundled fonts and brand icons for stable printing
- Browser Print / Save as PDF and a deterministic command-line PDF exporter
- Runtime, component, responsive, text-layer, and PDF validation

## Requirements

- Node.js `^22.18.0` or `>=24.12.0`
- npm
- Playwright Chromium for direct PDF export:

```sh
npx playwright install chromium
```

Chrome or Edge is recommended when using the native browser print dialog.

## Start

```sh
npm install
npm run dev
```

Open the local URL shown by Vite. Edit [resume.yaml](resume.yaml); Vite reloads the preview automatically.

The committed resume contains fictional sample data and is intended only to demonstrate supported fields, wrapping, pagination, and themes.

The YAML language server uses [resume.schema.json](resume.schema.json) to provide field completion and validation. VS Code recommends the required extensions when the folder opens.

## Themes

- **Editorial** uses a restrained single-column hierarchy, Source Sans 3, and a cool blue accent.
- **Ledger** uses a Swiss-inspired section-label rail, IBM Plex Sans, and a restrained rust accent.

Set only `presentation.theme` to inherit all theme defaults. Any additional presentation values in YAML override only the supplied fields.

## Generate PDF Directly

Generate the root resume:

```sh
npm run pdf
```

This reads `resume.yaml` and overwrites `pdf/resume.pdf`.

Generate another resume that uses the same YAML schema:

```sh
npm run pdf -- --input profiles/jane.yaml
npm run pdf -- -i profiles/jane.yaml
```

The default output uses the input file name under the ignored `pdf/` directory. For example, `profiles/jane.yaml` creates `pdf/jane.pdf`.

Choose an explicit output path:

```sh
npm run pdf -- -i profiles/jane.yaml -o exports/jane-resume.pdf
```

Input and output paths may be absolute, outside the repository, or contain spaces when quoted. Existing output files are overwritten. The command validates YAML before starting Chromium, creates no PDF for invalid input, waits for local fonts and images, and closes its temporary Vite server and browser automatically.

Run `npm run pdf -- --help` for the complete option reference.

## Export from the Browser

Select **Print / Save PDF**, choose **Save as PDF**, disable browser headers and footers, and keep scale at 100%. The configured A4 or Letter size and margins come from print CSS.

Browser JavaScript cannot control the native destination, scale, header/footer, or background-graphics preferences. Chrome and Edge are the reference renderers; other browsers are best effort.

## Commands

| Command                   | Purpose                                                 |
| ------------------------- | ------------------------------------------------------- |
| `npm run dev`             | Start the development preview                           |
| `npm run pdf`             | Generate `pdf/resume.pdf` from root YAML                |
| `npm run build`           | Validate schemas and YAML, type-check, and build `dist` |
| `npm run validate:resume` | Validate root `resume.yaml`                             |
| `npm run schema:generate` | Regenerate `resume.schema.json`                         |
| `npm run schema:check`    | Fail when the generated schema is stale                 |
| `npm run check:text`      | Enforce LF endings and repository text policy           |
| `npm run test:unit`       | Run schema, pipeline, option, and component tests       |
| `npm run test:pdf-cli`    | Smoke-test alternate YAML PDF rendering                 |
| `npm run test:e2e`        | Run responsive and PDF tests in Chromium                |
| `npm run lint`            | Check Vue and TypeScript with ESLint                    |
| `npm run format:check`    | Check formatting with Prettier                          |
| `npm run check`           | Run the complete local and CI verification suite        |

## Architecture

```text
resume.yaml or alternate YAML
  -> YAML parser
  -> strict Zod validation
  -> normalized domain model
  -> typed theme registry
  -> semantic section renderers
  -> screen preview or Playwright Chromium PDF
```

Key folders:

- `src/schema`: source-of-truth Zod contracts
- `src/content`: parsing, validation, normalization, and errors
- `src/domain`: normalized types and safe CSS token serialization
- `src/components/resume`: reusable document primitives
- `src/components/sections`: one renderer per section type
- `src/themes`: isolated theme definitions and styles
- `src/styles`: application tokens and native print rules
- `scripts/pdf`: direct PDF option and renderer modules
- `tests`: unit, component, CLI smoke, responsive, and PDF tests

Read [docs/yaml-reference.md](docs/yaml-reference.md) for configuration and [docs/theme-authoring.md](docs/theme-authoring.md) before adding a theme.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep components focused, preserve semantic HTML, and run `npm run check` before submitting changes.

## License

[MIT](LICENSE)
