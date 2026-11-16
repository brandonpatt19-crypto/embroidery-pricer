# Launch Checklist — Embroidery Job Pricer (MVP)

This checklist covers the manual steps that require an account or payment: creating the waitlist Google Form, buying the domain, connecting the static host, enabling cookieless analytics, and setting up Google Search Console.

---

## 1. Set Up the Paid Version Waitlist (Google Form)

1. Open [Google Forms](https://forms.google.com) and create a new form titled **"Embroidery Job Pricer Pro — Early Access Waitlist ($19.99 One-Time)"**.
2. Add the three questions specified in `SPEC.md`:
   - **Email address** *(Short answer, required)*
   - **What best describes your embroidery setup?** *(Multiple choice: Single-head home machine · Multi-needle home/prosumer machine · Commercial multi-head shop · Digitizer / Contract broker)*
   - **Which Pro feature ($19.99 one-time, no subscription) would save you the most time first?** *(Multiple choice)*:
     - Named rate profiles (e.g., "Caps", "Left Chest", "Team Orders")
     - Branded PDF quotes with shop logo, contact details, and terms
     - Quote history and a simple customer list
     - Pricing several designs (e.g., front + sleeve + back) on one order
     - Additional embroidery file formats (EXP, JEF, VP3, XXX)
3. Click **Send → Link**, copy the public `https://docs.google.com/forms/d/e/.../viewform` URL, and replace `https://docs.google.com/forms/d/e/1FAIpQLSfEmbroideryPricerProWaitlist/viewform` in:
   - `src/ui/toolController.ts`
   - `index.html` and the 5 subpage HTML files

---

## 2. Buy the Domain

1. Register your chosen domain (e.g., `embroiderypricer.com` or your preferred `.com` domain) at Cloudflare Registrar, Porkbun, or Namecheap.
2. If your domain differs from `https://embroiderypricer.com`, find-and-replace `https://embroiderypricer.com` across:
   - `index.html` and the 5 subpage HTML files (`<link rel="canonical">` and `og:url`)
   - `public/sitemap.xml`
   - `public/robots.txt`
3. Run `npm run build` to regenerate the production `dist/` folder.

---

## 3. Connect Your Free Static Host

You can host the `dist/` build for `$0/month` on **Cloudflare Pages**, **Netlify**, or **GitHub Pages**:

### Option A: Cloudflare Pages (Recommended)
1. Push this repository to GitHub or GitLab (or upload `dist/` via Direct Upload).
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages**.
3. Set the build configuration:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `20` (or `22`)
4. Under **Custom domains**, attach your domain (`embroiderypricer.com`). Cloudflare automatically provisions HTTPS certificates and serves clean URLs (`/how-much-to-charge-for-embroidery`, etc.).

### Option B: Netlify or GitHub Pages
- **Netlify:** Set build command to `npm run build` and publish directory to `dist`.
- **GitHub Pages:** Deploy the `dist/` folder via GitHub Actions (`actions/deploy-pages`).

---

## 4. Enable Cookieless Analytics

1. **If hosting on Cloudflare Pages:** Enable **Web Analytics** with one click in your Pages project settings. Cloudflare automatically injects its cookieless, privacy-first beacon at the edge (no cookies, no ad trackers, no banner needed).
2. **If hosting elsewhere (Netlify / GitHub Pages):**
   - Create a free site in [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) and copy your site token.
   - In the HTML files, change the analytics `<script>` tag before `</body>` from `type="text/plain" data-src="..."` to an active `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>` and run `npm run build`.

---

## 5. Verify Google Search Console & Submit Sitemap

1. Open [Google Search Console](https://search.google.com/search-console) and click **Add property → Domain**.
2. Enter your domain (`embroiderypricer.com`) and copy the DNS `TXT` verification record into your DNS provider.
3. Once verified, go to **Sitemaps** in the left sidebar and submit:
   ```text
   https://embroiderypricer.com/sitemap.xml
   ```
4. Use **URL Inspection → Request Indexing** on the 5 target URLs:
   - `https://embroiderypricer.com/`
   - `https://embroiderypricer.com/how-much-to-charge-for-embroidery`
   - `https://embroiderypricer.com/embroidery-price-per-1000-stitches`
   - `https://embroiderypricer.com/stitch-count-calculator`
   - `https://embroiderypricer.com/how-to-price-embroidered-hats`

---

## 6. 30-Day Review (`SPEC.md` Waitlist Test)

After 30 days live, review:
1. **Google Search Console:** Impressions, clicks, and ranking positions for the 5 target searches.
2. **Waitlist Google Form responses:** Total sign-ups, breakdown of home vs. commercial shops, and the #1 requested Pro feature to decide whether to build the paid version as a web unlock, desktop/Android app, or both.

---

## 7. Adding Affiliate URLs Later (Phase 1 Monetization)

Every tool page includes a **Recommended Shop Supplies & Consumables Reference** card (`<aside class="supplies-card no-print">`) right below the calculator with 6 curated shop supply slots (`data-affiliate-slot`):
- `stabilizer-cutaway` (2.5 oz – 3.0 oz Cutaway Stabilizer)
- `stabilizer-tearaway-cap` (3.0 oz Crisp Cap Tearaway Strips)
- `needles-75-11` (75/11 Ballpoint & 80/12 Sharp Titanium Needles)
- `thread-40wt-poly` (40 wt Trilobal Polyester & 60 wt L-Style Bobbins)
- `puff-foam-topper` (3mm EVA 3D Puff Foam & Water-Soluble Topper)
- `custom-digitizing` (Left-Chest & Center-Out Cap Digitizing)

When you have your affiliate links ready:
1. Search for `<!-- AFFILIATE_URL_SLOT:` in the HTML files and replace the comment with:
   ```html
   <a href="https://your-affiliate-link.example" class="supply-link-slot" target="_blank" rel="sponsored noopener noreferrer">Check bulk prices &rarr;</a>
   ```
2. Add a short FTC disclosure to `.supplies-note` (e.g., *"Disclosure: Some supply links are affiliate links that support this free tool at no extra cost to you."*) and update `/privacy` if needed.
3. Run `npm run build` and redeploy `dist/`.
