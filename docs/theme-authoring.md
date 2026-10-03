# Theme Authoring

Themes control document composition and visual styling. They must not parse YAML, alter section semantics, or accept unvalidated CSS.

## Theme Contract

Each theme directory contains:

```text
src/themes/my-theme/
  MyThemeResume.vue
  metadata.ts
  my-theme.css
```

`metadata.ts` exports a `ThemeManifest` with a stable ID, label, description, and complete default presentation values. The root Vue component receives one normalized `resume` prop.

Theme defaults are resolved first. Values explicitly present in `resume.yaml` override only their corresponding fields. A theme must never rewrite source YAML or ignore valid user overrides.

## Built-in Themes

- `editorial`: restrained single-column hierarchy using Source Sans 3 and a cool blue accent.
- `ledger`: Swiss-inspired section rail using IBM Plex Sans, compact grid rhythm, and a rust accent.

## Register a Theme

A new theme requires three isolated files and one catalog edit:

1. Create the root component with a filename ending in `Resume.vue`.
2. Create the theme metadata and scoped stylesheet.
3. Import the metadata and add one entry to `themeManifests` in `src/themes/manifest.ts`.
4. Run `npm run schema:generate`.

The catalog key becomes the TypeScript `ThemeId` and the generated YAML schema enum automatically. `src/themes/registry.ts` discovers nested `*Resume.vue` files by folder, so it does not need a new import or map entry. Catalog keys and metadata IDs are checked by TypeScript, and tests fail when a registered theme has no matching component.

Example catalog entry:

```ts
import { modernThemeManifest } from './modern/metadata'

export const themeManifests = defineThemeCatalog({
  editorial: editorialThemeManifest,
  modern: modernThemeManifest,
})
```

Do not edit the domain theme union, Zod theme enum, or Vue component registry directly; all three derive from the catalog.

## Renderer Strategy

Prefer shared renderers from `src/components/sections`. Override a renderer only when a theme changes information hierarchy, not merely colors or spacing.

Shared primitives own semantic patterns:

- `ResumeSection`
- `ResumeEntry`
- `DateRange`
- `BulletList`
- `TagList`

Keep components focused. Do not create a universal entry shape that erases differences between employment, skills, education, and publications.

## Styling Rules

- Scope theme styles beneath the theme root class.
- Consume validated `--resume-*` custom properties.
- Use static Tailwind utilities only where they remain readable.
- Keep physical page geometry and fragmentation in native CSS.
- Do not generate class names or CSS declarations from raw YAML.
- Avoid fixed-height pages, transformed document roots, and `overflow: hidden`; these break pagination.
- Keep entries together where practical, but permit oversized content to flow naturally.
- Test A4 and Letter through Chromium with `preferCSSPageSize: true`.

## Required Coverage

A theme contribution should include:

- one compact and one long fixture
- all supported section types
- desktop and mobile overflow checks
- A4 and Letter PDF dimensions
- heading/entry fragmentation checks
- local font and asset loading checks
- semantic heading and link assertions
