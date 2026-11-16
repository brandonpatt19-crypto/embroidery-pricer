import "./styles/main.css";
import { mountEmbroideryTool } from "./ui/toolController";

function init(): void {
  const root = document.getElementById("embroidery-tool-root");
  if (root) {
    mountEmbroideryTool(root);
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
