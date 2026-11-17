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
  /**
   * Optional Cloudflare Worker secret (set only in Cloudflare Dashboard encrypted secrets,
   * never in source code or documentation). Accepted only via `Authorization: Bearer <secret>` header,
   * never via URL query parameters.
   */
  ADMIN_BEARER_SECRET?: string;
}

const VALID_EVENTS = [
  "page_view",
  "unique_session",
  "return_session_separate_day",
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
  byShopType: Record<string, number>;
  byTopFeature: Record<string, number>;
  waitlistEntries: WaitlistEntry[];
}

const CACHE_STATE_URL = "https://telemetry.embroiderypricer.internal/state-v2";

function createInitialState(): TelemetryState {
  return {
    startedAt: new Date().toISOString(),
    counts: {
      page_view: 0,
      unique_session: 0,
      return_session_separate_day: 0,
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
    byShopType: {},
    byTopFeature: {},
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
        counts: { ...createInitialState().counts, ...(parsed.counts ?? {}) },
        byPage: parsed.byPage ?? {},
        byShopType: parsed.byShopType ?? {},
        byTopFeature: parsed.byTopFeature ?? {}
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

/**
 * Checks whether the request includes a valid `Authorization: Bearer <secret>` header
 * matching the Cloudflare Dashboard secret `env.ADMIN_BEARER_SECRET` (never hard-coded in source,
 * and never accepted in URL query parameters).
 */
function isAdminAuthorized(request: Request, env: Env): boolean {
  const configuredSecret = (env.ADMIN_BEARER_SECRET ?? "").trim();
  if (!configuredSecret || configuredSecret.length < 16) {
    return false;
  }
  const authHeader = request.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return false;
  }
  const bearerKey = authHeader.slice(7).trim();
  return bearerKey.length === configuredSecret.length && bearerKey === configuredSecret;
}

function buildPublicSafeState(state: TelemetryState, includePii: boolean) {
  return {
    startedAt: state.startedAt,
    counts: state.counts,
    byPage: state.byPage,
    byShopType: state.byShopType ?? {},
    byTopFeature: state.byTopFeature ?? {},
    waitlistCount: state.counts.waitlist_submitted ?? 0,
    ...(includePii ? { waitlistEntries: state.waitlistEntries } : {})
  };
}

function renderStatsDashboardHtml(state: TelemetryState, isAdmin: boolean): string {
  const c = state.counts;
  const pageRows = Object.entries(state.byPage)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([pg, count]) =>
        `<tr><td><code>${escapeHtml(pg)}</code></td><td><strong>${count}</strong></td></tr>`
    )
    .join("");

  const featureRows = Object.entries(state.byTopFeature ?? {})
    .sort((a, b) => b[1] - a[1])
    .map(
      ([feat, count]) =>
        `<tr><td>${escapeHtml(feat)}</td><td><strong>${count}</strong></td></tr>`
    )
    .join("");

  const shopRows = Object.entries(state.byShopType ?? {})
    .sort((a, b) => b[1] - a[1])
    .map(
      ([st, count]) =>
        `<tr><td>${escapeHtml(st)}</td><td><strong>${count}</strong></td></tr>`
    )
    .join("");

  const adminWaitlistSection = isAdmin
    ? `
    <h2>Authenticated Owner View: Pro Waitlist Sign-Up Records (${state.waitlistEntries.length})</h2>
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
        ${
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
                .join("")
        }
      </tbody>
    </table>`
    : `<p class="sub"><em>Zero-trust PII protection active: No authentication credentials exist in source code or URL parameters. Individual waitlist email records are emitted to authenticated Cloudflare Worker Observability logs and excluded from all unauthenticated HTTP responses.</em></p>`;

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
    <p class="sub">Cookieless, aggregated behavioral event telemetry (no design files, customer quotes, or public PII). <a href="/">← Back to Calculator</a></p>

    <div class="grid">
      <div class="card">
        <div class="label">1. Browser-Tab Sessions</div>
        <div class="val">${c.unique_session}</div>
        <div class="note">sessionStorage sessions · Total page views: <strong>${c.page_view}</strong></div>
      </div>
      <div class="card">
        <div class="label">2. Separate-Day Browser Returns</div>
        <div class="val">${c.return_session_separate_day}</div>
        <div class="note">localStorage visits on a later UTC date</div>
      </div>
      <div class="card">
        <div class="label">3. Calculations Modified</div>
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

    ${adminWaitlistSection}

    <h2>Aggregated Pro Feature Demand ($19.99 Waitlist Votes)</h2>
    <table>
      <thead>
        <tr>
          <th>#1 Requested Pro Feature</th>
          <th>Votes</th>
        </tr>
      </thead>
      <tbody>
        ${featureRows || `<tr><td colspan="2" style="color:#64748b;text-align:center;">No feature votes recorded yet</td></tr>`}
      </tbody>
    </table>

    <h2>Aggregated Shop Setup Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Shop Setup</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        ${shopRows || `<tr><td colspan="2" style="color:#64748b;text-align:center;">No shop setup records yet</td></tr>`}
      </tbody>
    </table>

    <h2>Page Views by Landing Page</h2>
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
          events?: string[];
          page?: string;
        };
        const rawList: string[] = Array.isArray(body.events)
          ? body.events
          : typeof body.event === "string"
            ? [body.event]
            : [];
        const validList = rawList.filter((e): e is FunnelEventName =>
          VALID_EVENTS.includes(e as FunnelEventName)
        );
        if (validList.length > 0) {
          const state = await loadState();
          for (const evName of validList) {
            state.counts[evName] = (state.counts[evName] ?? 0) + 1;
            if (evName === "page_view" && typeof body.page === "string") {
              const cleanPage = body.page.slice(0, 80) || "/";
              state.byPage[cleanPage] = (state.byPage[cleanPage] ?? 0) + 1;
            }
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
        const shopType = (body.shopType ?? "Not specified").slice(0, 80);
        const topFeature = (body.topFeature ?? "Not specified").slice(0, 100);
        const page = (body.page ?? "/").slice(0, 80);
        state.counts.waitlist_submitted = (state.counts.waitlist_submitted ?? 0) + 1;
        state.byShopType[shopType] = (state.byShopType[shopType] ?? 0) + 1;
        state.byTopFeature[topFeature] = (state.byTopFeature[topFeature] ?? 0) + 1;

        // Emit structured event to Cloudflare Workers Observability Logs (accessible only via authenticated Cloudflare Dashboard)
        console.log(
          JSON.stringify({
            type: "PRO_WAITLIST_SIGNUP",
            timestamp: new Date().toISOString(),
            email,
            shopType,
            topFeature,
            page
          })
        );

        // Only retain PII in cache if an encrypted ADMIN_BEARER_SECRET is explicitly configured in the Worker environment
        if ((env.ADMIN_BEARER_SECRET ?? "").trim().length >= 16) {
          state.waitlistEntries.push({
            timestamp: new Date().toISOString(),
            email,
            shopType,
            topFeature,
            page
          });
          if (state.waitlistEntries.length > 500) {
            state.waitlistEntries.shift();
          }
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
      const isAdmin = isAdminAuthorized(request, env);
      return new Response(JSON.stringify(buildPublicSafeState(state, isAdmin), null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });
    }

    if (request.method === "GET" && path === "/stats") {
      const state = await loadState();
      const isAdmin = isAdminAuthorized(request, env);
      return new Response(renderStatsDashboardHtml(state, isAdmin), {
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
