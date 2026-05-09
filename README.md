# בארי אריזות — Beeri Packaging Website

Marketing site for Beeri Packaging. Built with Next.js 16 (App Router) + React 19 + Tailwind v4.

- **Primary locale:** Hebrew (he, RTL)
- **Secondary locale:** English (en, LTR)

## Project layout

```
.
├── app/                  Next.js App Router (routes, layouts, pages)
├── public/
│   └── images/
│       ├── categories/
│       │   ├── wines/              יינות
│       │   ├── food/               מזון
│       │   ├── alcohol-beverages/  משקאות אלכוהולים + בירות
│       │   ├── cosmetics/          קוסמטיקה
│       │   ├── pharma/             פארמה
│       │   ├── coffee-capsules/    קפסולות קפה
│       │   ├── finishing/          השבחות (print finishing)
│       │   ├── shared/             תמונות משותפות
│       │   └── other/              אחר
│       └── uncategorized/          to be sorted into the categories above
└── docs/
    ├── research/         Hebrew SEO research, Google Trends, Autocomplete
    ├── strategy/         SEO content strategy (.docx + .pdf)
    ├── briefs/           SEO blog brief
    ├── presentations/    SEO findings deck
    └── README.md         full mapping + conventions
```

See [`docs/README.md`](docs/README.md) for the source-material overview and Hebrew→slug image mapping.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Notes

- This Next.js version has breaking changes — read `node_modules/next/dist/docs/` before writing new APIs (per `AGENTS.md`).
- `public/images/` is heavy (~1.5 GB). Before pushing, decide on Git LFS, an external CDN/bucket, or cropping/compressing the assets.
- Keyword strategy and positioning come from [`docs/research/beeri-google-trends-seo-research.md`](docs/research/beeri-google-trends-seo-research.md). Update there first if direction changes.
