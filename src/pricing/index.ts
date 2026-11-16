/**
 * Pure TypeScript pricing and machine-time engine for the Embroidery Job Pricer MVP.
 * Contains no UI or DOM code.
 */

export interface QuantityBreak {
  label: string;
  minQty: number;
  maxQty: number | null; // null means open-ended (e.g. 144+)
  discount: number; // fraction in [0, 1], e.g. 0.10 for 10%
}

export interface PricingRates {
  ratePer1000Stitches: number; // default $1.50
  pieceFee: number; // default $1.00 (hooping, handling)
  minimumPerPiece: number; // default $5.00
  colorsIncluded: number; // default 6
  extraColorFee: number; // default $0.50
  quantityBreaks: QuantityBreak[];
  garmentMarkup: number; // fraction, default 0.40 (40%)
  machineSpeed: number; // stitches per minute, default 650
  colorChangeSeconds: number; // seconds per color change, default 30
  hoopingMinutes: number; // minutes per piece, default 1
  heads: number; // number of machine heads, default 1
}

export interface JobInput {
  stitches: number; // normal stitches
  colors: number; // thread blocks = colorChanges + 1 (or manual colors >= 1)
  colorChanges?: number; // optional explicit override; defaults to Math.max(0, colors - 1)
  quantity: number; // pieces in order (>= 1)
  customerSuppliesGarment: boolean;
  garmentCost: number; // raw garment cost per piece ($0 if customer supplies)
  applySetupFee: boolean;
  setupFee: number; // one-time setup fee ($)
}

export interface QuantityBreakRow {
  label: string;
  minQty: number;
  maxQty: number | null;
  discount: number;
  decorationPerPiece: number;
  garmentPerPiece: number;
  perPiece: number;
  sampleOrderTotal: number; // order total at minQty including setup fee
  effectiveHourlyRate: number;
}

export interface PricingQuoteResult {
  stitches: number;
  colors: number;
  colorChanges: number;
  extraColors: number;
  quantity: number;
  activeBreak: QuantityBreak;
  breakDiscount: number;
  baseDecoration: number;
  discountedDecorationRaw: number;
  minimumApplied: boolean;
  decorationPerPiece: number;
  garmentPerPiece: number;
  perPiece: number;
  setupFeeApplied: number;
  orderTotal: number;
  minutesPerPieceRaw: number;
  minutesPerPiece: number;
  orderMachineMinutesRaw: number;
  orderMachineMinutes: number;
  effectiveHourlyRate: number;
  breakTable: QuantityBreakRow[];
}

export const STARTING_VALUES_NOTICE = "Starting values: change to yours";

export const DEFAULT_QUANTITY_BREAKS: readonly QuantityBreak[] = [
  { label: "1–11", minQty: 1, maxQty: 11, discount: 0 },
  { label: "12–23", minQty: 12, maxQty: 23, discount: 0.05 },
  { label: "24–47", minQty: 24, maxQty: 47, discount: 0.1 },
  { label: "48–143", minQty: 48, maxQty: 143, discount: 0.15 },
  { label: "144+", minQty: 144, maxQty: null, discount: 0.2 }
];

export const DEFAULT_PRICING_RATES: Readonly<PricingRates> = {
  ratePer1000Stitches: 1.5,
  pieceFee: 1.0,
  minimumPerPiece: 5.0,
  colorsIncluded: 6,
  extraColorFee: 0.5,
  quantityBreaks: DEFAULT_QUANTITY_BREAKS.map((b) => ({ ...b })),
  garmentMarkup: 0.4,
  machineSpeed: 650,
  colorChangeSeconds: 30,
  hoopingMinutes: 1,
  heads: 1
};

export function createDefaultRates(): PricingRates {
  return {
    ...DEFAULT_PRICING_RATES,
    quantityBreaks: DEFAULT_QUANTITY_BREAKS.map((b) => ({ ...b }))
  };
}

/**
 * Rounds a non-negative monetary or 2-decimal value half-up to the cent (2 decimal places).
 * Adds 1e-9 epsilon before flooring to prevent binary float representation drift (e.g., 1.005 * 100 = 100.49999999999999).
 */
export function roundHalfUpCents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  return (sign * Math.floor(abs * 100 + 0.5 + 1e-9)) / 100;
}

/**
 * Finds the matching quantity break for a given order quantity.
 */
export function findQuantityBreak(
  quantity: number,
  breaks: readonly QuantityBreak[]
): QuantityBreak {
  const safeQty = Math.max(1, Math.floor(quantity));
  const sorted = [...breaks].sort((a, b) => a.minQty - b.minQty);

  for (const brk of sorted) {
    if (safeQty >= brk.minQty && (brk.maxQty === null || safeQty <= brk.maxQty)) {
      return brk;
    }
  }

  // Fallback if quantity is above or below configured ranges
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (safeQty >= sorted[i].minQty) {
      return sorted[i];
    }
  }

  return sorted[0] ?? { label: "1+", minQty: 1, maxQty: null, discount: 0 };
}

/**
 * Computes machine time (minutes per piece and total order machine minutes).
 * Formula from SPEC.md:
 *   minutes per piece = stitches / machine speed + color changes * (change seconds / 60) + hooping minutes
 *   order machine time = minutes per piece * quantity / heads
 */
export function calculateMachineTime(params: {
  stitches: number;
  colorChanges: number;
  quantity: number;
  machineSpeed: number;
  colorChangeSeconds: number;
  hoopingMinutes: number;
  heads: number;
}): {
  minutesPerPieceRaw: number;
  minutesPerPiece: number;
  orderMachineMinutesRaw: number;
  orderMachineMinutes: number;
} {
  const stitches = Math.max(0, params.stitches);
  const colorChanges = Math.max(0, params.colorChanges);
  const quantity = Math.max(1, Math.floor(params.quantity));
  const speed = params.machineSpeed > 0 ? params.machineSpeed : 650;
  const changeSeconds = Math.max(0, params.colorChangeSeconds);
  const hoopingMinutes = Math.max(0, params.hoopingMinutes);
  const heads = params.heads > 0 ? Math.floor(params.heads) : 1;

  const minutesPerPieceRaw =
    stitches / speed + colorChanges * (changeSeconds / 60) + hoopingMinutes;
  const minutesPerPiece = roundHalfUpCents(minutesPerPieceRaw);

  const orderMachineMinutesRaw = (minutesPerPieceRaw * quantity) / heads;
  const orderMachineMinutes = roundHalfUpCents(orderMachineMinutesRaw);

  return {
    minutesPerPieceRaw,
    minutesPerPiece,
    orderMachineMinutesRaw,
    orderMachineMinutes
  };
}

/**
 * Calculates full pricing and machine-time outputs for a job and rate configuration.
 * Follows SPEC.md equations and rounding rules:
 *   base = (stitches / 1000) * rate + pieceFee + extraColorFee * max(0, colors - colorsIncluded)
 *   decoration = max(base * (1 - breakDiscount), minimum)
 *   perPiece = roundHalfUpCents(decoration + garmentCost * (1 + garmentMarkup))
 *   orderTotal = roundHalfUpCents(perPiece * quantity + setupFee)
 */
export function calculateJobQuote(
  job: JobInput,
  rates: PricingRates = DEFAULT_PRICING_RATES
): PricingQuoteResult {
  const stitches = Math.max(0, job.stitches);
  const colors = Math.max(1, Math.floor(job.colors));
  const colorChanges =
    job.colorChanges !== undefined
      ? Math.max(0, Math.floor(job.colorChanges))
      : Math.max(0, colors - 1);
  const quantity = Math.max(1, Math.floor(job.quantity));

  const extraColors = Math.max(0, colors - Math.max(0, Math.floor(rates.colorsIncluded)));
  const baseDecoration =
    (stitches / 1000) * rates.ratePer1000Stitches +
    rates.pieceFee +
    rates.extraColorFee * extraColors;

  const activeBreak = findQuantityBreak(quantity, rates.quantityBreaks);
  const breakDiscount = activeBreak.discount;
  const discountedDecorationRaw = baseDecoration * (1 - breakDiscount);
  const minimumApplied = discountedDecorationRaw < rates.minimumPerPiece;
  const decorationRaw = Math.max(discountedDecorationRaw, rates.minimumPerPiece);
  const decorationPerPiece = roundHalfUpCents(decorationRaw);

  const rawGarmentCost = job.customerSuppliesGarment ? 0 : Math.max(0, job.garmentCost);
  const garmentRaw = rawGarmentCost * (1 + rates.garmentMarkup);
  const garmentPerPiece = roundHalfUpCents(garmentRaw);

  // Round the per-piece price to the cent (half up) before multiplying by quantity
  const perPiece = roundHalfUpCents(decorationRaw + garmentRaw);
  const setupFeeApplied = job.applySetupFee ? roundHalfUpCents(Math.max(0, job.setupFee)) : 0;
  const orderTotal = roundHalfUpCents(perPiece * quantity + setupFeeApplied);

  const time = calculateMachineTime({
    stitches,
    colorChanges,
    quantity,
    machineSpeed: rates.machineSpeed,
    colorChangeSeconds: rates.colorChangeSeconds,
    hoopingMinutes: rates.hoopingMinutes,
    heads: rates.heads
  });

  // Effective hourly rate = (decoration / minutes per piece) * 60
  // Worked Example 1 in SPEC.md: $11.70 / 14.31 * 60 = $49.06
  const effectiveHourlyRate =
    time.minutesPerPiece > 0
      ? roundHalfUpCents((decorationPerPiece / time.minutesPerPiece) * 60)
      : 0;

  const breakTable: QuantityBreakRow[] = rates.quantityBreaks.map((brk) => {
    const discRaw = baseDecoration * (1 - brk.discount);
    const decRaw = Math.max(discRaw, rates.minimumPerPiece);
    const dec = roundHalfUpCents(decRaw);
    const unit = roundHalfUpCents(decRaw + garmentRaw);
    const sampleTotal = roundHalfUpCents(unit * brk.minQty + setupFeeApplied);
    const effHourly =
      time.minutesPerPiece > 0
        ? roundHalfUpCents((dec / time.minutesPerPiece) * 60)
        : 0;

    return {
      label: brk.label,
      minQty: brk.minQty,
      maxQty: brk.maxQty,
      discount: brk.discount,
      decorationPerPiece: dec,
      garmentPerPiece,
      perPiece: unit,
      sampleOrderTotal: sampleTotal,
      effectiveHourlyRate: effHourly
    };
  });

  return {
    stitches,
    colors,
    colorChanges,
    extraColors,
    quantity,
    activeBreak,
    breakDiscount,
    baseDecoration: roundHalfUpCents(baseDecoration),
    discountedDecorationRaw,
    minimumApplied,
    decorationPerPiece,
    garmentPerPiece,
    perPiece,
    setupFeeApplied,
    orderTotal,
    minutesPerPieceRaw: time.minutesPerPieceRaw,
    minutesPerPiece: time.minutesPerPiece,
    orderMachineMinutesRaw: time.orderMachineMinutesRaw,
    orderMachineMinutes: time.orderMachineMinutes,
    effectiveHourlyRate,
    breakTable
  };
}
