import { describe, expect, it } from "vitest";
import { createDefaultRates } from "../src/pricing/index";
import {
  clearStoredSettings,
  loadStoredSettings,
  saveStoredSettings,
  STORAGE_KEY
} from "../src/storage/settings";
import { formatPlainTextQuote } from "../src/ui/quoteText";
import { calculateJobQuote } from "../src/pricing/index";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    }
  };
}

function createBlockedStorage(): Storage {
  const throwDenied = () => {
    throw new Error("SecurityError: localStorage is disabled");
  };
  return {
    get length() {
      return throwDenied();
    },
    clear: throwDenied,
    getItem: throwDenied,
    key: throwDenied,
    removeItem: throwDenied,
    setItem: throwDenied
  };
}

describe("Stage 3: Saved Settings & Quote Formatting", () => {
  it("saves and reloads customized rates in storage", () => {
    const mem = createMemoryStorage();
    const customRates = createDefaultRates();
    customRates.ratePer1000Stitches = 2.25;
    customRates.pieceFee = 1.75;
    customRates.minimumPerPiece = 7.5;
    customRates.heads = 6;

    const ok = saveStoredSettings({ rates: customRates, defaultSetupFee: 30 }, mem);
    expect(ok).toBe(true);
    expect(mem.getItem(STORAGE_KEY)).toBeTruthy();

    const loaded = loadStoredSettings(mem);
    expect(loaded.rates.ratePer1000Stitches).toBe(2.25);
    expect(loaded.rates.pieceFee).toBe(1.75);
    expect(loaded.rates.minimumPerPiece).toBe(7.5);
    expect(loaded.rates.heads).toBe(6);
    expect(loaded.defaultSetupFee).toBe(30);

    clearStoredSettings(mem);
    const afterClear = loadStoredSettings(mem);
    expect(afterClear.rates.ratePer1000Stitches).toBe(1.5);
  });

  it("gracefully falls back to defaults when storage is blocked or corrupted", () => {
    const blocked = createBlockedStorage();
    expect(saveStoredSettings({ rates: createDefaultRates(), defaultSetupFee: 0 }, blocked)).toBe(
      false
    );
    const loaded = loadStoredSettings(blocked);
    expect(loaded.rates.ratePer1000Stitches).toBe(1.5);
    expect(() => clearStoredSettings(blocked)).not.toThrow();

    const corrupted = createMemoryStorage();
    corrupted.setItem(STORAGE_KEY, "{not-valid-json");
    const fromCorrupted = loadStoredSettings(corrupted);
    expect(fromCorrupted.rates.ratePer1000Stitches).toBe(1.5);
  });

  it("formats a plain-text customer quote with break table and breakdown", () => {
    const quote = calculateJobQuote({
      stitches: 8000,
      colors: 3,
      colorChanges: 2,
      quantity: 24,
      customerSuppliesGarment: false,
      garmentCost: 4.5,
      applySetupFee: true,
      setupFee: 25
    });

    const text = formatPlainTextQuote(quote, {
      designName: "Team Cap Logo",
      widthMm: 88.9,
      heightMm: 50.8,
      jumps: 3,
      trims: 1,
      customerSuppliesGarment: false,
      garmentCost: 4.5,
      garmentMarkup: 0.4,
      heads: 1,
      machineSpeed: 650
    });

    expect(text).toContain("EMBROIDERY JOB QUOTE — Team Cap Logo");
    expect(text).toContain("Quantity: 24 pcs (Tier 24–47, 10% break)");
    expect(text).toContain("Total price per piece: $18.00");
    expect(text).toContain("One-time setup fee: $25.00");
    expect(text).toContain("ORDER TOTAL (24 pcs): $457.00");
    expect(text).toContain("144+");
  });
});
