import type { PricingQuoteResult } from "../pricing/index";

export interface QuoteSummaryMeta {
  designName: string;
  widthMm: number;
  heightMm: number;
  jumps: number;
  trims: number;
  customerSuppliesGarment: boolean;
  garmentCost: number;
  garmentMarkup: number;
  heads: number;
  machineSpeed: number;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatPlainTextQuote(
  quote: PricingQuoteResult,
  meta: QuoteSummaryMeta
): string {
  const widthIn = (meta.widthMm / 25.4).toFixed(2);
  const heightIn = (meta.heightMm / 25.4).toFixed(2);
  const discountPct = Math.round(quote.breakDiscount * 100);

  const lines: string[] = [
    `EMBROIDERY JOB QUOTE — ${meta.designName || "Custom Design"}`,
    `----------------------------------------`,
    `Quantity: ${quote.quantity} pcs (Tier ${quote.activeBreak.label}, ${discountPct}% break)`,
    `Design: ${quote.stitches.toLocaleString()} stitches | ${quote.colors} color(s) (${quote.colorChanges} color change(s))`,
    `Dimensions: ${widthIn}" × ${heightIn}" (${meta.widthMm.toFixed(1)} × ${meta.heightMm.toFixed(1)} mm)`,
    ``,
    `PRICING BREAKDOWN`,
    `- Decoration per piece: ${formatCurrency(quote.decorationPerPiece)}${quote.minimumApplied ? " (minimum applied)" : ""}`
  ];

  if (meta.customerSuppliesGarment) {
    lines.push(`- Garment: Customer-supplied ($0.00)`);
  } else {
    lines.push(
      `- Garment per piece: ${formatCurrency(quote.garmentPerPiece)} (cost ${formatCurrency(meta.garmentCost)} + ${Math.round(meta.garmentMarkup * 100)}% markup)`
    );
  }

  lines.push(`- Total price per piece: ${formatCurrency(quote.perPiece)}`);
  if (quote.setupFeeApplied > 0) {
    lines.push(`- One-time setup fee: ${formatCurrency(quote.setupFeeApplied)}`);
  }
  lines.push(`- ORDER TOTAL (${quote.quantity} pcs): ${formatCurrency(quote.orderTotal)}`);
  lines.push(``);
  lines.push(`QUANTITY PRICE BREAKS (Per Piece / Order Total)`);
  for (const row of quote.breakTable) {
    const pct = Math.round(row.discount * 100);
    lines.push(
      `  ${row.label.padEnd(7, " ")} (${String(pct).padStart(2, " ")}% off): ${formatCurrency(row.perPiece)}/pc  (${row.minQty} pcs = ${formatCurrency(row.sampleOrderTotal)})`
    );
  }

  return lines.join("\n");
}
