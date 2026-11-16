import {
  createDefaultRates,
  DEFAULT_QUANTITY_BREAKS,
  type PricingRates,
  type QuantityBreak
} from "../pricing/index";

export const STORAGE_KEY = "embroidery_pricer_settings_v1";

export interface StoredSettings {
  rates: PricingRates;
  defaultSetupFee: number;
}

function isFiniteNonNegative(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val) && val >= 0;
}

function sanitizeBreaks(raw: unknown): QuantityBreak[] {
  if (!Array.isArray(raw) || raw.length !== DEFAULT_QUANTITY_BREAKS.length) {
    return DEFAULT_QUANTITY_BREAKS.map((b) => ({ ...b }));
  }
  return DEFAULT_QUANTITY_BREAKS.map((def, idx) => {
    const item = raw[idx] as Partial<QuantityBreak> | undefined;
    const discount =
      item && typeof item.discount === "number" && Number.isFinite(item.discount)
        ? Math.min(1, Math.max(0, item.discount))
        : def.discount;
    return {
      label: def.label,
      minQty: def.minQty,
      maxQty: def.maxQty,
      discount
    };
  });
}

/**
 * Loads last-used rate settings from localStorage.
 * Wrapped in try/catch so blocked or unavailable storage falls back cleanly to defaults.
 */
export function loadStoredSettings(storage?: Storage | null): StoredSettings {
  const defaults: StoredSettings = {
    rates: createDefaultRates(),
    defaultSetupFee: 0
  };

  try {
    const targetStorage =
      storage !== undefined
        ? storage
        : typeof window !== "undefined"
          ? window.localStorage
          : null;
    if (!targetStorage) return defaults;

    const raw = targetStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw) as Partial<{
      rates: Partial<PricingRates>;
      defaultSetupFee: number;
    }>;

    const r = parsed.rates ?? {};
    const def = defaults.rates;

    const rates: PricingRates = {
      ratePer1000Stitches: isFiniteNonNegative(r.ratePer1000Stitches)
        ? r.ratePer1000Stitches
        : def.ratePer1000Stitches,
      pieceFee: isFiniteNonNegative(r.pieceFee) ? r.pieceFee : def.pieceFee,
      minimumPerPiece: isFiniteNonNegative(r.minimumPerPiece)
        ? r.minimumPerPiece
        : def.minimumPerPiece,
      colorsIncluded: isFiniteNonNegative(r.colorsIncluded)
        ? Math.floor(r.colorsIncluded)
        : def.colorsIncluded,
      extraColorFee: isFiniteNonNegative(r.extraColorFee)
        ? r.extraColorFee
        : def.extraColorFee,
      quantityBreaks: sanitizeBreaks(r.quantityBreaks),
      garmentMarkup: isFiniteNonNegative(r.garmentMarkup)
        ? r.garmentMarkup
        : def.garmentMarkup,
      machineSpeed:
        isFiniteNonNegative(r.machineSpeed) && r.machineSpeed > 0
          ? r.machineSpeed
          : def.machineSpeed,
      colorChangeSeconds: isFiniteNonNegative(r.colorChangeSeconds)
        ? r.colorChangeSeconds
        : def.colorChangeSeconds,
      hoopingMinutes: isFiniteNonNegative(r.hoopingMinutes)
        ? r.hoopingMinutes
        : def.hoopingMinutes,
      heads:
        isFiniteNonNegative(r.heads) && r.heads >= 1
          ? Math.floor(r.heads)
          : def.heads
    };

    const defaultSetupFee = isFiniteNonNegative(parsed.defaultSetupFee)
      ? parsed.defaultSetupFee
      : 0;

    return { rates, defaultSetupFee };
  } catch {
    return defaults;
  }
}

/**
 * Saves current rate settings to localStorage.
 * Wrapped in try/catch so blocked storage never throws.
 */
export function saveStoredSettings(
  settings: StoredSettings,
  storage?: Storage | null
): boolean {
  try {
    const targetStorage =
      storage !== undefined
        ? storage
        : typeof window !== "undefined"
          ? window.localStorage
          : null;
    if (!targetStorage) return false;

    targetStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

export function clearStoredSettings(storage?: Storage | null): void {
  try {
    const targetStorage =
      storage !== undefined
        ? storage
        : typeof window !== "undefined"
          ? window.localStorage
          : null;
    if (!targetStorage) return;
    targetStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
