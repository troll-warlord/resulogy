# YAML Reference

`resume.yaml` is the only file required to update resume content or select supported presentation options. The committed `resume.schema.json` is generated from the runtime Zod schema and should not be edited manually.

## Root

```yaml
# yaml-language-server: $schema=./resume.schema.json
$schema: ./resume.schema.json
version: 1
basics: {}
presentation: {}
sections: []
```

Unknown fields are rejected. This catches misspellings instead of silently dropping content.

## Basics

`basics.name` is required. The remaining fields are optional:

- `label`
- `email`
- `phone`
- `website`
- `location.city`, `region`, `country`, and `postalCode`
- `social[]` with `network`, optional `username`, and `url`

URLs must use HTTP or HTTPS. Resume text is plain text; raw HTML and executable content are not accepted.

Recognized social networks use locally bundled brand marks. Common names include GitHub, LinkedIn, Credly, GitLab, Stack Overflow, X or Twitter, Mastodon, Bluesky, YouTube, Medium, DEV.to, Hashnode, npm, Google Scholar, HackerRank, LeetCode, ORCID, ResearchGate, Behance, and Dribbble. Matching ignores case and punctuation. Unknown network names remain valid and use a globe icon with the visible network label.

## Presentation

Select a theme and inherit all of its defaults:

```yaml
presentation:
  theme: ledger # editorial | ledger
```

Themes provide page, typography, color, density, and bullet defaults. Any values explicitly supplied in YAML override only those fields; omitted fields continue using the selected theme defaults. For example:

```yaml
presentation:
  theme: ledger
  page:
    size: letter # a4 | letter
  colors:
    accent: '#005f73'
```

Supported optional overrides are:

- `page.size`: `a4` or `letter`
- `page.margin`: `compact`, `standard`, or `spacious`
- `typography.fontFamily`: `source-sans-3`, `source-serif-4`, or `ibm-plex-sans`
- `typography.baseSize`: 8 through 14 points
- `typography.lineHeight`: 1.15 through 1.7
- `colors.text`, `muted`, `accent`, and `rule`: six-digit hex colors
- `density`: `compact`, `standard`, or `spacious`
- `bullets.marker`: `disc`, `circle`, `square`, `dash`, `chevron`, or `none`

Presentation values are validated and serialized as CSS variables. Themes never mutate `resume.yaml`, and YAML cannot inject Tailwind class names or arbitrary CSS.

## Common Section Fields

Every section uses a `type` discriminator and may include:

```yaml
- type: experience
  id: work-history
  title: Experience
  visible: true
  options:
    breakPolicy: auto # auto | avoid | before | after
    bulletMarker: disc
```

Sections render in YAML order. Hidden sections are removed during normalization.

## Section Types

- `summary`: optional `text` and `highlights`; at least one is required.
- `experience`: company, position, start, optional end/location/url/summary/highlights/keywords. The company is the entry heading and the position is its subheading.
- `projects`: name with optional role, links, dates, summary, highlights, and technologies.
- `education`: institution and start with optional qualification, area, location, end, score, honors, courses, and highlights.
- `skills`: named groups with item lists and optional level; supports inline, grid, or stacked layout and one to three columns.
- `certifications`: name with optional issuer, issue/expiration dates, credential ID, URL, and highlights.
- `awards`: title with optional awarder, date, summary, URL, and highlights.
- `volunteering`: organization and start with optional position, location, end, URL, summary, and highlights.
- `publications`: name with optional publisher, date, URL, authors, and summary.
- `languages`: language name and optional fluency; supports inline, grid, or stacked layout.
- `interests`: interest name and optional keywords; supports inline, grid, or stacked layout.
- `custom`: plain body text or structured items containing heading, subheading, metadata, text, URL, and highlights.

Dates use `YYYY-MM`; end dates may also use `present`. End dates earlier than start dates are rejected.

The complete working example is [resume.yaml](../resume.yaml). Editor completion from the generated schema is the authoritative field-level reference.
