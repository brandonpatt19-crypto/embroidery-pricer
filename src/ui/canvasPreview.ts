import type { EmbroideryDesign } from "../reader/types";

/**
 * Renders the embroidery stitch path preview onto an HTMLCanvasElement,
 * drawn per thread block in its thread color.
 */
export function renderStitchPreview(
  canvas: HTMLCanvasElement,
  design: EmbroideryDesign | null,
  manualDimensions?: { widthMm: number; heightMm: number; stitches: number; colors: number }
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = typeof window !== "undefined" && window.devicePixelRatio ? window.devicePixelRatio : 1;
  const cssWidth = canvas.clientWidth || 320;
  const cssHeight = canvas.clientHeight || 220;

  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Subtle fabric grid background
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  const gridStep = 20;
  for (let x = gridStep; x < cssWidth; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, cssHeight);
    ctx.stroke();
  }
  for (let y = gridStep; y < cssHeight; y += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cssWidth, y);
    ctx.stroke();
  }

  const padding = 20;
  const availW = Math.max(40, cssWidth - padding * 2);
  const availH = Math.max(40, cssHeight - padding * 2);

  if (!design || design.blocks.length === 0 || design.normalStitches === 0) {
    // Manual mode diagram: draw realistic embroidery hoop, simulated satin/tatami crest, and dimension callouts
    const wMm = manualDimensions?.widthMm || 88.9;
    const hMm = manualDimensions?.heightMm || 50.8;
    const colorsCount = Math.max(1, Math.min(12, manualDimensions?.colors || 3));
    const stitchesCount = manualDimensions?.stitches ?? 8000;

    const scale = Math.min((availW - 28) / Math.max(1, wMm), (availH - 28) / Math.max(1, hMm));
    const boxW = Math.max(44, Math.min(availW - 16, wMm * scale));
    const boxH = Math.max(36, Math.min(availH - 24, hMm * scale));
    const cx = cssWidth / 2;
    const cy = cssHeight / 2 - 4;
    const left = cx - boxW / 2;
    const top = cy - boxH / 2;

    // Outer embroidery hoop frame
    const hoopRx = Math.min(cssWidth * 0.44, Math.max(boxW * 0.66, 72));
    const hoopRy = Math.min(cssHeight * 0.41, Math.max(boxH * 0.72, 54));
    ctx.save();
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(cx, cy, hoopRx, hoopRy, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, hoopRx - 3.5, hoopRy - 3.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Hoop top tension screw bracket
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(cx - 10, cy - hoopRy - 7, 20, 6);
    ctx.restore();

    // Simulated multi-color satin/tatami embroidery badge inside the bounding box
    const palette = ["#1d4ed8", "#dc2626", "#15803d", "#d97706", "#7c3aed", "#0f766e"];
    const r = Math.min(boxW, boxH) * 0.34;

    // Color 1: Outer satin border ring with simulated zigzag stitch texture
    ctx.save();
    ctx.strokeStyle = palette[0];
    ctx.lineWidth = Math.max(3, r * 0.22);
    ctx.setLineDash([2, 1.5]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, boxW * 0.38, boxH * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Color 2: Inner tatami fill lines
    if (colorsCount >= 2) {
      ctx.save();
      ctx.strokeStyle = palette[1];
      ctx.lineWidth = 1.35;
      const rx = boxW * 0.28;
      const ry = boxH * 0.23;
      for (let dy = -ry + 3; dy <= ry - 3; dy += 3.2) {
        const ratio = Math.max(0, 1 - (dy * dy) / (ry * ry));
        const halfSpan = rx * Math.sqrt(ratio);
        ctx.beginPath();
        ctx.moveTo(cx - halfSpan, cy + dy);
        ctx.lineTo(cx + halfSpan, cy + dy);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Color 3+: Center star / crown emblem stitch lines
    if (colorsCount >= 3) {
      ctx.save();
      ctx.strokeStyle = palette[2];
      ctx.fillStyle = palette[2];
      ctx.lineWidth = 2;
      const starR = Math.min(boxW, boxH) * 0.16;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? starR : starR * 0.45;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const sx = cx + Math.cos(angle) * rad;
        const sy = cy + Math.sin(angle) * rad;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Dashed design bounding box
    ctx.strokeStyle = "#475569";
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 1.25;
    ctx.strokeRect(left, top, boxW, boxH);
    ctx.setLineDash([]);

    // Bottom pill overlay with stitch count & dimensions
    const pillH = 22;
    const pillW = Math.min(cssWidth - 16, 290);
    const pillX = (cssWidth - pillW) / 2;
    const pillY = cssHeight - pillH - 6;
    ctx.fillStyle = "rgba(15, 23, 42, 0.84)";
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 11);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 11.5px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const infoText = `${stitchesCount.toLocaleString()} sts · ${(wMm / 25.4).toFixed(2)}" × ${(hMm / 25.4).toFixed(2)}" (${wMm.toFixed(1)}×${hMm.toFixed(1)} mm)`;
    ctx.fillText(infoText, cssWidth / 2, pillY + pillH / 2);
    return;
  }

  const { minX, minY, maxX, maxY } = design.boundsMm;
  const spanX = Math.max(0.5, maxX - minX);
  const spanY = Math.max(0.5, maxY - minY);
  const scale = Math.min(availW / spanX, availH / spanY);

  const offsetX = padding + (availW - spanX * scale) / 2 - minX * scale;
  const offsetY = padding + (availH - spanY * scale) / 2 - minY * scale;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(0.9, Math.min(1.8, scale * 0.35));

  for (const block of design.blocks) {
    ctx.strokeStyle = block.color.hex || "#1d4ed8";
    ctx.beginPath();
    for (const seg of block.segments) {
      const pts = seg.points;
      if (pts.length === 0) continue;
      ctx.moveTo(pts[0].x * scale + offsetX, pts[0].y * scale + offsetY);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x * scale + offsetX, pts[i].y * scale + offsetY);
      }
    }
    ctx.stroke();
  }
}
