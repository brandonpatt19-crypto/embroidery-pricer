# Antigravity build spec: Embroidery job pricer (MVP)

Nov 15, 2026 · @Director

Build a free, browser-only tool that reads an embroidery design file and turns it into a per-piece price and a quote, as the first step toward a paid app.

## How to run this spec

Build one stage at a time and review each before the next starts. That keeps a wrong turn cheap.

1. Create an empty folder named `embroidery-pricer` and open it as a workspace in Antigravity.
2. Export this doc as Markdown and save it in that folder as `SPEC.md`.
3. In the Agent Manager, start a task in Planning mode: *Read SPEC.md and build Stage 1 only. Show me your plan first.*
4. When a stage is done, check its tests passed, then start the next: *Build Stage N of SPEC.md.*
5. You handle anything that needs an account or money: the domain, the hosting account and Google Search Console.

If the research report shows no data for the embroidery head searches, pause before Stage 4 (the pages).

## The product

**One sentence:** Drop in your embroidery file and get a per-piece price, a quantity price table and a quote you can send, without the file ever leaving your computer.

**Who it's for:** small embroidery shops and people selling from home embroidery machines who price custom orders such as caps, shirts and team gear.

**MVP includes**
- Reading DST and PES files in the browser: stitch count, color changes, size and a stitch preview
- A manual mode for people without a file
- Pricing by stitch count with editable rates, quantity breaks, minimums, garment cost and setup fees
- Machine time and the effective hourly rate each price earns
- A quantity price table, a copyable quote and a print view
- The last-used settings remembered in the browser
- Four articles that target pricing searches, each with the tool embedded
- A waitlist link for the paid version

**MVP leaves out:** accounts, a server, payments, saved quote history, PDF quotes with a logo, other file formats, and any mobile app.

## User flow

One page does the whole job, top to bottom, with no sign-up.

1. **Land:** a one-line promise, the drop zone and a note that the file stays on their computer.
2. **Add the design:** drag in or pick a `.dst` or `.pes` file. Or choose "Enter stitch count instead" and type stitches, colors, width and height.
3. **See the design:** a stitch preview with stitch count, color changes, jumps, trims, width × height (in and mm) and estimated machine time. Every number can be overridden.
4. **Set the job:** quantity, garment cost (or "customer supplies garment"), and whether a one-time setup fee applies.
5. **Adjust rates (folded away by default):** rate per 1,000 stitches, per-piece fee, minimum, color-change fee, quantity breaks, garment markup, machine speed.
6. **Get the answer:** price per piece, order total, effective hourly rate, and a table of per-piece prices at every quantity break.
7. **Use it:** copy a plain-text quote, or open the print view and print or save as PDF from the browser.
8. **Next visit:** their last rates load automatically. A small link offers the paid version waitlist.

## Reading DST and PES files

The file reader is the product's edge and its biggest risk, so it is built and tested first, in isolation from the UI.

### Extract from each file

| Field | Notes |
| --- | --- |
| Normal stitches | The number pricing uses |
| Jumps and trims | Shown separately, not priced by default |
| Color changes and thread blocks | Thread blocks = color changes + 1 |
| Width and height | From the stitch coordinates, in mm and inches |
| Stitch path | Coordinates per thread block, for the preview |
| Thread colors | From the file where the format stores them; otherwise a fixed palette |

### How to build it

1. Before writing code, find the format documentation and at least one open-source reader for each format. Record the sources and their licenses in `docs/FORMATS.md`.
2. Write your own reader in TypeScript. You may port logic from an open-source reader only if its license allows it, and keep its notice in `THIRD_PARTY_NOTICES.md`.
3. For PES, read the stitch data from the section common to all PES versions, so it works across machines' versions.
4. Don't trust counts stored in a file's header alone. Compute them from the stitch records, and show a warning if the two disagree.
5. Read files up to 10 MB. Reject other types and broken files with a plain message, never a crash.
6. Run the reader in a web worker so a large file doesn't freeze the page.

**Test files:** use sample DST and PES files from open-source projects' test sets, and record each file's source and license in `test/fixtures/SOURCES.md`. Don't use files from paid design shops.

## Build stages

Five stages. Stop after each one, report what passed, and wait for the go-ahead.

1. **File reader.** Research the formats and write `docs/FORMATS.md`, then build the DST and PES readers in a worker with fixture tests. Done when the reader tests pass on at least three DST and three PES fixtures.
2. **Pricing engine.** Build the pricing and machine-time module with unit tests. Done when both worked examples match to the cent, along with edge cases: quantity 1, the minimum kicking in, and each break boundary.
3. **Tool page.** Build the drop zone, manual mode, preview, stats, job inputs, folded rate settings, results, price table, copy quote, print view and saved settings. Done when the page tests pass and it works at 360 px.
4. **Pages and SEO.** Write the four articles and the privacy page, plus metadata, structured data, sitemap and robots. Done when the site builds and each page has its title, description, H1 and canonical.
5. **Launch prep.** Prepare the production build, analytics snippet, waitlist link and a `LAUNCH.md` checklist with my steps: buy the domain, connect the host, verify Search Console, submit the sitemap. Done when every acceptance test passes. Don't deploy or buy anything yourself.
