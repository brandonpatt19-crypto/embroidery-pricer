import "./styles/main.css";
import { STORAGE_KEY } from "./storage/settings";
import { mountEmbroideryTool } from "./ui/toolController";

const FIRST_VISIT_DATE_KEY = "embroidery_pricer_first_visit_day_v1";
const LAST_RETURN_FIRED_DAY_KEY = "embroidery_pricer_last_return_day_v1";
const SESSION_TRACKED_KEY = "embroidery_pricer_session_v1";

function sendTelemetryEventsBatch(events: string[], pagePath: string): void {
  if (events.length === 0) return;
  try {
    void fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events, page: pagePath }),
      keepalive: true
    }).catch(() => {});
  } catch {
    // Ignore in offline / non-Worker environments
  }
}

function init(): void {
  let hadPreviousVisit = false;
  let isNewSeparateDayReturn = false;
  let isNewUniqueSession = false;
  const todayUtc = new Date().toISOString().slice(0, 10);

  try {
    hadPreviousVisit = Boolean(window.localStorage?.getItem(STORAGE_KEY));
    const firstDay = window.localStorage?.getItem(FIRST_VISIT_DATE_KEY);
    if (!firstDay) {
      window.localStorage?.setItem(FIRST_VISIT_DATE_KEY, todayUtc);
    } else if (firstDay !== todayUtc) {
      const lastReturnFired = window.localStorage?.getItem(LAST_RETURN_FIRED_DAY_KEY);
      if (lastReturnFired !== todayUtc) {
        isNewSeparateDayReturn = true;
        window.localStorage?.setItem(LAST_RETURN_FIRED_DAY_KEY, todayUtc);
      }
    }
    if (!window.sessionStorage?.getItem(SESSION_TRACKED_KEY)) {
      isNewUniqueSession = true;
      window.sessionStorage?.setItem(SESSION_TRACKED_KEY, "1");
    }
  } catch {
    hadPreviousVisit = false;
  }

  const root = document.getElementById("embroidery-tool-root");
  if (root) {
    mountEmbroideryTool(root);
  }

  // Record cookieless page_view, unique_session & return_session_separate_day atomically in a single batch POST
  const pagePath = typeof window !== "undefined" ? window.location.pathname || "/" : "/";
  const batchEvents: string[] = ["page_view"];
  if (isNewUniqueSession) {
    batchEvents.push("unique_session");
  }
  if (hadPreviousVisit) {
    batchEvents.push("returning_visit");
  }
  if (isNewSeparateDayReturn) {
    batchEvents.push("return_session_separate_day");
  }
  sendTelemetryEventsBatch(batchEvents, pagePath);

  const jumpWrapper = document.getElementById("sticky-jump-wrapper");
  const closeJumpBtn = document.getElementById("btn-close-jump-pill");
  if (jumpWrapper && closeJumpBtn) {
    closeJumpBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      jumpWrapper.hidden = true;
      jumpWrapper.style.display = "none";
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
