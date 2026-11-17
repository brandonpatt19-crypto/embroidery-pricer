import "./styles/main.css";
import { STORAGE_KEY } from "./storage/settings";
import { mountEmbroideryTool } from "./ui/toolController";

function init(): void {
  let hadPreviousVisit = false;
  try {
    hadPreviousVisit = Boolean(window.localStorage?.getItem(STORAGE_KEY));
  } catch {
    hadPreviousVisit = false;
  }

  const root = document.getElementById("embroidery-tool-root");
  if (root) {
    mountEmbroideryTool(root);
  }

  // Record cookieless page_view & returning_visit before any user file upload
  try {
    const pagePath = window.location.pathname || "/";
    void fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view", page: pagePath }),
      keepalive: true
    }).catch(() => {});
    if (hadPreviousVisit) {
      void fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "returning_visit", page: pagePath }),
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    // Ignore in offline / non-Worker environments
  }

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
