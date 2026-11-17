/**
 * Cloudflare Worker (`shrill-fog-f96b`) for Embroidery Job Pricer (embroiderypricer.com).
 *
 * Serves static assets from `./dist` via the ASSETS binding and provides:
 * - POST `/api/event`: Cookieless, anonymous funnel event counter (no filenames, no file contents, no PII).
 * - POST `/api/waitlist`: In-page $19.99 Pro Waitlist sign-up capture.
 * - GET  `/api/stats`: Live 30-day validation telemetry JSON.
 * - GET  `/stats`: Human-readable HTML dashboard of the 30-day validation funnel & waitlist sign-ups.
 */

interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

export interface Env {
  ASSETS: AssetsBinding;
}

const VALID_EVENTS = [
  "page_view",
  "returning_visit",
  "file_imported",
  "calculation_edited",
  "quote_copied",
  "quote_printed",
  "waitlist_clicked",
  "waitlist_submitted",
  "supply_clicked"
] as const;

type FunnelEventName = (typeof VALID_EVENTS)[number];

interface WaitlistEntry {
  timestamp: string;
  email: string;
  shopType: string;
  topFeature: string;
  page: string;
}

interface TelemetryState {
  startedAt: string;
  counts: Record<FunnelEventName, number>;
  byPage: Record<string, number>;
  waitlistEntries: WaitlistEntry[];
}

const CACHE_STATE_URL = "https://telemetry.embroiderypricer.internal/state-v1";

function createInitialState(): TelemetryState {
  return {
    startedAt: new Date().toISOString(),
    counts: {
      page_view: 0,
      returning_visit: 0,
      file_imported: 0,
      calculation_edited: 0,
      quote_copied: 0,
      quote_printed: 0,
      waitlist_clicked: 0,
      waitlist_submitted: 0,
      supply_clicked: 0
    },
    byPage: {},
    waitlistEntries: []
  };
}

let memoryState: TelemetryState | null = null;

async function loadState(): Promise<TelemetryState> {
  if (memoryState) return memoryState;
  try {
    const cache = (caches as unknown as { default: Cache }).default;
    const cached = await cache.match(CACHE_STATE_URL);
    if (cached) {
      const parsed = (await cached.json()) as TelemetryState;
      memoryState = {
        ...createInitialState(),
        ...parsed,
        counts: { ...createInitialState().counts, ...(parsed.counts ?? {}) }
      };
      return memoryState;
    }
  } catch {
    // Fallback to in-memory state
  }
  memoryState = createInitialState();
  return memoryState;
}

async function saveState(state: TelemetryState): Promise<void> {
  memoryState = state;
  try {
    const cache = (caches as unknown as { default: Cache }).default;
    const res = new Response(JSON.stringify(state), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=2592000"
      }
    });
    await cache.put(CACHE_STATE_URL, res);
  } catch {
    // Ignore edge cache write errors
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderStatsDashboardHtml(state: TelemetryState): string {
  const c = state.counts;
  const pageRows = Object.entries(state.byPage)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([pg, count]) =>
        `<tr><td><code>${escapeHtml(pg)}</code></td><td><strong>${count}</strong></td></tr>`
    )
    .join("");

  const waitlistRows =
    state.waitlistEntries.length === 0
      ? `<tr><td colspan="5" style="color:#64748b;text-align:center;">No waitlist submissions yet</td></tr>`
      : state.waitlistEntries
          .slice()
          .reverse()
          .map(
            (w) => `<tr>
              <td>${escapeHtml(w.timestamp.slice(0, 19).replace("T", " "))} UTC</td>
              <td><strong>${escapeHtml(w.email)}</strong></td>
              <td>${escapeHtml(w.shopType)}</td>
              <td>${escapeHtml(w.topFeature)}</td>
              <td><code>${escapeHtml(w.page)}</code></td>
            </tr>`
          )
          .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>30-Day Market Validation Dashboard — Embroidery Job Pricer</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 1.5rem 1rem; }
    .wrap { max-width: 1020px; margin: 0 auto; }
    h1 { margin: 0 0 0.25rem; font-size: 1.5rem; }
    .sub { color: #475569; font-size: 0.9rem; margin-bottom: 1.25rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(195px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem; }
    .card { background: #fff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 0.9rem 1rem; box-shadow: 0 1px 2px rgba(15,23,42,0.04); }
    .label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #475569; letter-spacing: 0.04em; }
    .val { font-size: 1.75rem; font-weight: 800; color: #1d4ed8; margin: 0.2rem 0; }
    .note { font-size: 0.78rem; color: #64748b; }
    table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; margin-bottom: 1.5rem; }
    th, td { text-align: left; padding: 0.65rem 0.85rem; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; }
    th { background: #f1f5f9; font-weight: 700; color: #334155; }
    code { background: #eff6ff; color: #1e3a8a; padding: 0.1rem 0.35rem; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>30-Day Commercial Validation Funnel — embroiderypricer.com</h1>
    <p class="sub">Cookieless behavioral event telemetry (no design files or customer quotes are ever collected). <a href="/">← Back to Calculator</a></p>

    <div class="grid">
      <div class="card">
        <div class="label">1. Tool Page Sessions</div>
        <div class="val">${c.page_view}</div>
        <div class="note">Returning users: <strong>${c.returning_visit}</strong></div>
      </div>
      <div class="card">
        <div class="label">2. Real Files Imported</div>
        <div class="val">${c.file_imported}</div>
        <div class="note">DST / PES files parsed locally</div>
      </div>
      <div class="card">
        <div class="label">3. Calculations Edited</div>
        <div class="val">${c.calculation_edited}</div>
        <div class="note">Custom quantities, stitches, or rates</div>
      </div>
      <div class="card">
        <div class="label">4. Quotes Copied</div>
        <div class="val">${c.quote_copied}</div>
        <div class="note">Plain-text quotes copied</div>
      </div>
      <div class="card">
        <div class="label">5. Quotes Printed / PDF</div>
        <div class="val">${c.quote_printed}</div>
        <div class="note">Single-page print / PDF triggered</div>
      </div>
      <div class="card">
        <div class="label">6. Pro Waitlist Sign-Ups</div>
        <div class="val">${c.waitlist_submitted}</div>
        <div class="note">Waitlist clicks: <strong>${c.waitlist_clicked}</strong></div>
      </div>
      <div class="card">
        <div class="label">7. Supply Slot Clicks</div>
        <div class="val">${c.supply_clicked}</div>
        <div class="note">Recommended shop supply interest</div>
      </div>
    </div>

    <h2>Pro Waitlist Sign-Ups ($19.99 One-Time Intent)</h2>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Email</th>
          <th>Shop Setup</th>
          <th>#1 Requested Pro Feature</th>
          <th>Source Page</th>
        </tr>
      </thead>
      <tbody>
        ${waitlistRows}
      </tbody>
    </table>

    <h2>Sessions by Landing Page</h2>
    <table>
      <thead>
        <tr>
          <th>Landing Page</th>
          <th>Page Views</th>
        </tr>
      </thead>
      <tbody>
        ${pageRows || `<tr><td colspan="2" style="color:#64748b;text-align:center;">No page views recorded yet</td></tr>`}
      </tbody>
    </table>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "POST" && path === "/api/event") {
      try {
        const body = (await request.json()) as {
          event?: string;
          page?: string;
        };
        const evName = body.event as FunnelEventName | undefined;
        const state = await loadState();
        if (evName && VALID_EVENTS.includes(evName)) {
          state.counts[evName] = (state.counts[evName] ?? 0) + 1;
          if (evName === "page_view" && typeof body.page === "string") {
            const cleanPage = body.page.slice(0, 80) || "/";
            state.byPage[cleanPage] = (state.byPage[cleanPage] ?? 0) + 1;
          }
          await saveState(state);
        }
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch {
        return new Response(JSON.stringify({ ok: false }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    if (request.method === "POST" && path === "/api/waitlist") {
      try {
        const body = (await request.json()) as {
          email?: string;
          shopType?: string;
          topFeature?: string;
          page?: string;
        };
        const email = (body.email ?? "").trim().slice(0, 120);
        if (!email || !email.includes("@")) {
          return new Response(
            JSON.stringify({ ok: false, error: "Please enter a valid email address." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        const state = await loadState();
        state.counts.waitlist_submitted = (state.counts.waitlist_submitted ?? 0) + 1;
        state.waitlistEntries.push({
          timestamp: new Date().toISOString(),
          email,
          shopType: (body.shopType ?? "Not specified").slice(0, 80),
          topFeature: (body.topFeature ?? "Not specified").slice(0, 100),
          page: (body.page ?? "/").slice(0, 80)
        });
        if (state.waitlistEntries.length > 500) {
          state.waitlistEntries.shift();
        }
        await saveState(state);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch {
        return new Response(
          JSON.stringify({ ok: false, error: "Could not save waitlist entry." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (request.method === "GET" && path === "/api/stats") {
      const state = await loadState();
      return new Response(JSON.stringify(state, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });
    }

    if (request.method === "GET" && path === "/stats") {
      const state = await loadState();
      return new Response(renderStatsDashboardHtml(state), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
