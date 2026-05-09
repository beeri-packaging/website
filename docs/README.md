# בארי אריזות — Docs

Source material for the Beeri Packaging website. Hebrew is the primary language; English is secondary.

## Structure

```
docs/
├── research/        Hebrew SEO research, Google Trends sets, Autocomplete data
├── strategy/        SEO content strategy (.docx + rendered .pdf)
├── briefs/          SEO blog brief
└── presentations/   SEO findings deck (.pptx)
```

## Files

### research/
- **beeri-google-trends-seo-research.md** — Primary Hebrew SEO research. Defines positioning ("אריזות קרטון ממותגות בהתאמה אישית לתעשיות מובילות"), three search-intent buckets (commercial / industry / technical), Google Trends comparison sets, and autocomplete data for אריזות קרטון, קופסאות קרטון, אריזות מתנה, etc. **Single source of truth for keyword strategy.**

### strategy/
- **beeri-packaging-seo-content-strategy.docx** — Content strategy document.
- **beeri-packaging-seo-content-strategy.pdf** — Rendered version of the same.

### briefs/
- **beeri-seo-blog-brief.docx** — Blog content brief built from the strategy.

### presentations/
- **beeri-arizot-seo-findings.pptx** — Stakeholder-facing summary of SEO findings.

## Image library — Hebrew → English slug mapping

All product/website images live under `public/images/`. Source folders were Hebrew; directory names were slugified to English for URL safety. Filenames inside each folder remain in Hebrew (descriptive, used as-is for now — to be renamed/re-shot per page when product pages are designed).

| Source (Hebrew)                                  | New slug (`public/images/categories/...`) | Files |
| ------------------------------------------------ | ----------------------------------------- | ----- |
| יינות                                            | `wines/`                                  | 60    |
| מזון                                             | `food/`                                   | 62    |
| משקאות אלכוהולים + בירות                         | `alcohol-beverages/`                      | 44    |
| קוסמטיקה                                         | `cosmetics/`                              | 32    |
| השבחות                                           | `finishing/`                              | 24    |
| פארמה                                            | `pharma/`                                 | 6     |
| קפסולות קפה                                      | `coffee-capsules/`                        | 14    |
| תמונות משותפות                                   | `shared/`                                 | 12    |
| אחר                                              | `other/`                                  | 10    |
| תמונות נוספות להעביר לקטגוריות האחרות            | `public/images/uncategorized/`            | 21    |

**Notes:**
- Most photos exist in two variants: a full-size `<name>.jpg` and a smaller `<name>28.jpg` (or `<name>-28.jpg`). Use the `28` variant where bandwidth matters; full-size for hero/zoom shots.
- `finishing/` = print finishing/enhancements (foil, embossing, selective varnish, etc.) — the "השבחות" industry term.
- `uncategorized/` contains two sub-bundles (`jm_*`) of legacy photography that needs a sorting pass before publish.
- `.DS_Store` and `Thumbs.db` were stripped during import.

## Conventions

- **Primary language: Hebrew (he, RTL).** English is a secondary locale.
- Treat the research markdown as the canonical keyword/positioning source. If positioning changes, update it there first.
- Image filenames: keep Hebrew descriptive names for now. Plan a rename pass to URL-safe English slugs once page IA is finalized — captured in a follow-up task, not blocking.
