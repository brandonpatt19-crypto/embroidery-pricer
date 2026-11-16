import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

interface PageSpec {
  path: string;
  file: string;
  canonical: string;
  isArticle: boolean;
  embedsTool: boolean;
  hasFaqJsonLd: boolean;
}

const PAGES: PageSpec[] = [
  {
    path: "/",
    file: "index.html",
    canonical: "https://embroiderypricer.com/",
    isArticle: false,
    embedsTool: true,
    hasFaqJsonLd: true
  },
  {
    path: "/how-much-to-charge-for-embroidery",
    file: "how-much-to-charge-for-embroidery/index.html",
    canonical: "https://embroiderypricer.com/how-much-to-charge-for-embroidery",
    isArticle: true,
    embedsTool: true,
    hasFaqJsonLd: true
  },
  {
    path: "/embroidery-price-per-1000-stitches",
    file: "embroidery-price-per-1000-stitches/index.html",
    canonical: "https://embroiderypricer.com/embroidery-price-per-1000-stitches",
    isArticle: true,
    embedsTool: true,
    hasFaqJsonLd: true
  },
  {
    path: "/stitch-count-calculator",
    file: "stitch-count-calculator/index.html",
    canonical: "https://embroiderypricer.com/stitch-count-calculator",
    isArticle: true,
    embedsTool: true,
    hasFaqJsonLd: true
  },
  {
    path: "/how-to-price-embroidered-hats",
    file: "how-to-price-embroidered-hats/index.html",
    canonical: "https://embroiderypricer.com/how-to-price-embroidered-hats",
    isArticle: true,
    embedsTool: true,
    hasFaqJsonLd: true
  },
  {
    path: "/privacy",
    file: "privacy/index.html",
    canonical: "https://embroiderypricer.com/privacy",
    isArticle: false,
    embedsTool: false,
    hasFaqJsonLd: false
  }
];

function extractArticleWordCount(html: string): number {
  const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (!match) return 0;
  const plain = match[1]
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .trim();
  return plain.split(/\s+/).filter(Boolean).length;
}

describe("Stage 4: Pages, Articles, Metadata, Structured Data, Sitemap & Robots", () => {
  it("gives every page a unique title, unique meta description, one H1, canonical URL, and Open Graph tags", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const page of PAGES) {
      const html = readFileSync(join(ROOT, page.file), "utf-8");

      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      expect(titleMatch, `Missing <title> in ${page.file}`).toBeTruthy();
      const title = titleMatch![1].trim();
      expect(title.length).toBeGreaterThan(10);
      expect(titles.has(title), `Duplicate title on ${page.file}`).toBe(false);
      titles.add(title);

      const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
      expect(descMatch, `Missing meta description in ${page.file}`).toBeTruthy();
      const desc = descMatch![1].trim();
      expect(desc.length).toBeGreaterThan(40);
      expect(descriptions.has(desc), `Duplicate description on ${page.file}`).toBe(false);
      descriptions.add(desc);

      const h1Matches = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) ?? [];
      expect(h1Matches.length, `Expected exactly 1 H1 in ${page.file}`).toBe(1);

      const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
      expect(canonMatch, `Missing canonical in ${page.file}`).toBeTruthy();
      expect(canonMatch![1]).toBe(page.canonical);

      // Open Graph tags
      expect(html).toContain('property="og:type"');
      expect(html).toContain(`property="og:title" content="${title}"`);
      expect(html).toContain(`property="og:description" content="${desc}"`);
      expect(html).toContain(`property="og:url" content="${page.canonical}"`);

      // Favicon
      expect(html).toContain('href="/favicon.svg"');

      // Static embedded tool check
      if (page.embedsTool) {
        expect(html).toContain('id="embroidery-tool-root"');
        expect(html).toContain('id="pricer-app-container"');
      }

      // FAQPage JSON-LD structured data check
      if (page.hasFaqJsonLd) {
        const ldMatch = html.match(
          /<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/i
        );
        expect(ldMatch, `Missing JSON-LD in ${page.file}`).toBeTruthy();
        const parsed = JSON.parse(ldMatch![1]);
        expect(parsed["@type"]).toBe("FAQPage");
        expect(Array.isArray(parsed.mainEntity)).toBe(true);
        expect(parsed.mainEntity.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("keeps all four SEO articles strictly between 800 and 1,500 words and includes the worked examples", () => {
    for (const page of PAGES.filter((p) => p.isArticle)) {
      const html = readFileSync(join(ROOT, page.file), "utf-8");
      const wc = extractArticleWordCount(html);
      expect(wc, `Word count ${wc} for ${page.file} must be >= 800`).toBeGreaterThanOrEqual(800);
      expect(wc, `Word count ${wc} for ${page.file} must be <= 1500`).toBeLessThanOrEqual(1500);
    }

    // Verify Worked Example 1 appears in /how-much-to-charge-for-embroidery
    const chargeHtml = readFileSync(
      join(ROOT, "how-much-to-charge-for-embroidery/index.html"),
      "utf-8"
    );
    expect(chargeHtml).toContain("$13.00");
    expect(chargeHtml).toContain("$11.70");
    expect(chargeHtml).toContain("$280.80");
    expect(chargeHtml).toContain("14.31");
    expect(chargeHtml).toContain("$49.06");

    // Verify Worked Example 2 appears in /how-to-price-embroidered-hats and has a configured cap calculator preset + jump button
    const hatsHtml = readFileSync(
      join(ROOT, "how-to-price-embroidered-hats/index.html"),
      "utf-8"
    );
    expect(hatsHtml).toContain("$4.50");
    expect(hatsHtml).toContain("$6.30");
    expect(hatsHtml).toContain("$18.00");
    expect(hatsHtml).toContain("$25.00");
    expect(hatsHtml).toContain("$457.00");
    expect(hatsHtml).toContain('href="#embroidery-tool-root"');
    expect(hatsHtml).toContain('data-tool-preset=');
    expect(hatsHtml).toContain('"customerSuppliesGarment": false');
    expect(hatsHtml).toContain('"setupFee": 25.0');

    // Verify /embroidery-price-per-1000-stitches has Rate-Tuner preset (15,000 stitches, openRatesByDefault: true)
    const rateHtml = readFileSync(
      join(ROOT, "embroidery-price-per-1000-stitches/index.html"),
      "utf-8"
    );
    expect(rateHtml).toContain('href="#embroidery-tool-root"');
    expect(rateHtml).toContain('"stitches": 15000');
    expect(rateHtml).toContain('"openRatesByDefault": true');

    // Verify /stitch-count-calculator has File Inspector preset (2,550 stitches, quantity: 1)
    const stitchHtml = readFileSync(
      join(ROOT, "stitch-count-calculator/index.html"),
      "utf-8"
    );
    expect(stitchHtml).toContain('href="#embroidery-tool-root"');
    expect(stitchHtml).toContain('"stitches": 2550');
    expect(stitchHtml).toContain('"quantity": 1');
  });

  it("ships sitemap.xml, robots.txt, and favicon.svg covering all 6 canonical URLs", () => {
    const sitemap = readFileSync(join(ROOT, "public/sitemap.xml"), "utf-8");
    for (const page of PAGES) {
      expect(sitemap).toContain(`<loc>${page.canonical}</loc>`);
    }

    const robots = readFileSync(join(ROOT, "public/robots.txt"), "utf-8");
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://embroiderypricer.com/sitemap.xml");

    const favicon = readFileSync(join(ROOT, "public/favicon.svg"), "utf-8");
    expect(favicon).toContain("<svg");
  });
});
