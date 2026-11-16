# Acceptance Test Report — Embroidery Job Pricer (MVP)

## Stage 1 Evidence (Completed 2026-11-15)

- [x] **Reader accuracy:** For all 10 open-source fixtures (5 DST and 5 PES), normal stitches, jumps, trims, and color changes match the independent open-source reader (`EmbroidePy/pyembroidery` v1.5.1) **exact to the stitch (`0` difference)**, and width and height match to **`0.00 mm`** (well within the `0.1 mm` requirement).
- [x] **Bad files:** An empty file (`0` bytes), a renamed JPEG (`photo.dst` / `photo.pes`), a truncated DST (`truncated-header.dst`, `truncated-body.dst`), a truncated PES (`truncated.pes`), an unsupported extension (`design.jef`), and an oversized file (`> 10 MB`) each return a plain error (`ok: false`) without crashing.
- [x] **Speed:** A `2.0 MB` (`2,097,152` bytes, `698,880` 3-byte records) DST file is parsed and segmented into preview thread blocks via the Web Worker handler in **`< 200 ms`** (well under the `1,000 ms` limit).

### Fixture-by-Fixture Comparison (`src/reader` vs. `pyembroidery` v1.5.1)

| Fixture | Format | Normal Stitches (Reader / Ref) | Jumps (Reader / Ref) | Trims (Reader / Ref) | Color Changes (Reader / Ref) | Width mm (Reader / Ref) | Height mm (Reader / Ref) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `shamrockin.dst` | DST | `1473 / 1473` | `2 / 2` | `0 / 0` | `0 / 0` | `49.90 / 49.90` | `49.30 / 49.30` |
| `embroidermodder.dst` | DST | `3407 / 3407` | `30 / 30` | `12 / 12` | `0 / 0` | `222.50 / 222.50` | `51.40 / 51.40` |
| `star.dst` | DST | `2550 / 2550` | `5 / 5` | `0 / 0` | `1 / 1` | `59.10 / 59.10` | `62.30 / 62.30` |
| `random1-me.dst` | DST | `30 / 30` | `261 / 261` | `20 / 20` | `9 / 9` (warns `CO=10`) | `94.70 / 94.70` | `96.90 / 96.90` |
| `random1-wilcom.dst` | DST | `30 / 30` | `178 / 178` | `18 / 18` | `9 / 9` | `94.70 / 94.70` | `96.90 / 96.90` |
| `embroidermodder.pes` | PES (v4) | `3407 / 3407` | `2 / 2` | `1 / 1` | `0 / 0` | `51.40 / 51.40` | `222.50 / 222.50` |
| `star.pes` | PES (v7) | `2550 / 2550` | `2 / 2` | `0 / 0` | `1 / 1` | `59.10 / 59.10` | `62.30 / 62.30` |
| `random1-brother-v1.pes` | PES (v1) | `20 / 20` | `10 / 10` | `0 / 0` | `9 / 9` | `94.70 / 94.70` | `96.90 / 96.90` |
| `random1-brother-v6.pes` | PES (v6) | `20 / 20` | `10 / 10` | `0 / 0` | `9 / 9` | `94.70 / 94.70` | `96.90 / 96.90` |
| `random1-premier-v10.pes` | PES (v10) | `32 / 32` | `12 / 12` | `10 / 10` | `0 / 0` | `94.80 / 94.80` | `96.80 / 96.80` |

---

## Stage 2 Evidence (Completed 2026-11-15)

- [x] **Pricing:** Both worked examples match to the exact cent (`$11.70` per piece / `$280.80` total / `14.31` min / `$49.06`/hr for Worked Example 1; `$18.00` per piece / `$457.00` total for Worked Example 2), along with Quantity 1 (`$19.30` per piece / `$44.30` total), the `$5.00` minimum per-piece decoration floor kicking in (both at base `< $5.00` and when a break discount drops base below `$5.00`), all break boundaries (`1`, `11`, `12`, `23`, `24`, `47`, `48`, `143`, `144`), extra-color fees (`> 6` colors), half-up cent rounding before quantity multiplication, and multi-head machine time division (`test/pricing.test.ts` — 8/8 passing).

---

## Stage 3 Evidence (Completed 2026-11-15)

- [x] **Privacy:** Headless Chrome network log verified `0` network requests fired when uploading `.dst` (`star.dst`) and `.pes` (`star.pes`) files via the Web Worker (`run_stage3_browser_tests.py`).
- [x] **Phones:** Verified at `360 × 800` viewport in headless Chrome: `document.documentElement.scrollWidth === 360` (zero horizontal scrolling), and the full upload, manual override, pricing, and quote flow works end to end.
- [x] **Print:** Verified via Chrome `page.pdf(format="Letter")` that a standard quote prints cleanly on **1 Letter-size page**.
- [x] **Saved settings:** Verified in both `test/storage.test.ts` and headless Chrome that modified rates persist in `localStorage` across page reloads and that the tool works without error when `localStorage` throws `SecurityError`.

---

## Stage 4 Evidence (Completed 2026-11-15)

- [x] **Pages, Metadata, Structured Data, Sitemap & Robots:** Verified via `test/seo.test.ts` and `npm run build` (`vite build` in multi-page mode) that all 6 pages (`/`, `/how-much-to-charge-for-embroidery`, `/embroidery-price-per-1000-stitches`, `/stitch-count-calculator`, `/how-to-price-embroidered-hats`, `/privacy`) build cleanly into `dist/`, each with a unique `<title>`, unique `<meta name="description">`, exactly one `<h1>`, `<link rel="canonical">`, Open Graph tags, static embedded tool HTML, and `FAQPage` JSON-LD structured data (on `/` and all 4 articles), plus `sitemap.xml`, `robots.txt`, and `favicon.svg`.
- [x] **Content:** Verified in `test/seo.test.ts` that all 4 articles are strictly between 800 and 1,500 words (`1,152`, `1,035`, `1,112`, and `1,079` words) and contain zero uncited market statistics—every figure comes from the tool's own worked examples (`Worked Example 1` and `Worked Example 2`) or cited format documentation (`docs/FORMATS.md`).
- [x] **Size:** Initial JavaScript bundle (`dist/assets/main-*.js`) is **`16.06 KB` gzip** (`53.79 KB` raw), well under the `150 KB` compressed limit.

---

## Stage 5 Evidence (Completed 2026-11-15)

- [x] **Lighthouse:** Verified via Lighthouse CLI (`run_lighthouse.py` against `vite preview` serving the production `dist/` build) that both `/` and `/how-much-to-charge-for-embroidery` achieve **100 / 100 / 100** (well above the `>= 90` requirement):
  - `http://localhost:4175/`: **Performance = 100, Accessibility = 100, SEO = 100**
  - `http://localhost:4175/how-much-to-charge-for-embroidery.html`: **Performance = 100, Accessibility = 100, SEO = 100**
- [x] **Launch Checklist & Cookieless Analytics (`LAUNCH.md`):** Created `LAUNCH.md` with step-by-step instructions for creating the Google Form waitlist, choosing a domain, deploying `dist/` to Cloudflare Pages / Netlify / GitHub Pages, enabling cookieless Cloudflare Web Analytics, and submitting `sitemap.xml` to Google Search Console.

---

## Final MVP Acceptance Checklist (11 / 11 Passed)

- [x] **Reader accuracy:** For at least 5 DST and 5 PES test files, normal stitches, jumps and color changes match an independent open-source reader or known values, and width and height match within `0.1 mm` (`0` stitch difference and `0.00 mm` dimension difference across all 10 fixtures)
- [x] **Bad files:** An empty file, a renamed JPEG, a truncated DST, a truncated PES and a file over 10 MB each show a clear error and leave the page working
- [x] **Speed:** A 2 MB file reads in under 1 second without freezing the page (`< 200 ms` inside Web Worker)
- [x] **Pricing:** Both worked examples match to the cent (`$11.70/pc` & `$280.80` total; `$18.00/pc` & `$457.00` total), plus quantity 1 (`$19.30/pc` & `$44.30` total), the minimum kicking in (`$5.00`), and every break boundary (`1, 11, 12, 23, 24, 47, 48, 143, 144`)
- [x] **Privacy:** In the browser's network log, uploading a file makes zero network requests (`0` requests on `.dst` and `.pes` uploads)
- [x] **Phones:** At 360 px wide, the full flow works with no horizontal scrolling (`scrollWidth === 360`)
- [x] **Print:** A quote prints cleanly on one letter-size page (`1` page verified via headless Chrome PDF generation)
- [x] **Saved settings:** Changing rates and reloading restores them; blocking `localStorage` does not break the page
- [x] **Lighthouse:** 90 or higher for performance, accessibility and SEO on `/` and one article (`100 / 100 / 100` on both `/` and `/how-much-to-charge-for-embroidery`)
- [x] **Size:** Initial JavaScript under 150 KB compressed (`16.05 KB` gzip)
- [x] **Content:** Every article is 800–1,500 words (`1,152`, `1,035`, `1,112`, and `1,079` words) with no uncited market numbers
