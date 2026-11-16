import { describe, expect, it } from "vitest";
import {
  calculateJobQuote,
  createDefaultRates,
  DEFAULT_PRICING_RATES,
  findQuantityBreak,
  roundHalfUpCents
} from "../src/pricing/index";

describe("Stage 2: Pricing & Machine-Time Engine", () => {
  describe("Worked Examples from SPEC.md", () => {
    it("reproduces Worked Example 1 to the exact cent and minute", () => {
      // 24 caps, 8,000 stitches, 3 colors (2 color changes), customer supplies the caps, no setup fee, default rates
      const res = calculateJobQuote(
        {
          stitches: 8000,
          colors: 3,
          colorChanges: 2,
          quantity: 24,
          customerSuppliesGarment: true,
          garmentCost: 0,
          applySetupFee: false,
          setupFee: 0
        },
        DEFAULT_PRICING_RATES
      );

      expect(res.baseDecoration).toBe(13.0);
      expect(res.breakDiscount).toBe(0.1);
      expect(res.minimumApplied).toBe(false);
      expect(res.decorationPerPiece).toBe(11.7);
      expect(res.perPiece).toBe(11.7);
      expect(res.orderTotal).toBe(280.8);
      expect(res.minutesPerPiece).toBe(14.31);
      expect(res.effectiveHourlyRate).toBe(49.06);
    });

    it("reproduces Worked Example 2 to the exact cent", () => {
      // Same job, but caps cost $4.50 each at 40% markup, with a $25 setup fee
      const res = calculateJobQuote(
        {
          stitches: 8000,
          colors: 3,
          colorChanges: 2,
          quantity: 24,
          customerSuppliesGarment: false,
          garmentCost: 4.5,
          applySetupFee: true,
          setupFee: 25
        },
        DEFAULT_PRICING_RATES
      );

      expect(res.decorationPerPiece).toBe(11.7);
      expect(res.garmentPerPiece).toBe(6.3);
      expect(res.perPiece).toBe(18.0);
      expect(res.setupFeeApplied).toBe(25.0);
      expect(res.orderTotal).toBe(457.0);
      expect(res.minutesPerPiece).toBe(14.31);
      expect(res.effectiveHourlyRate).toBe(49.06);
    });
  });

  describe("Edge Cases: Quantity 1, Minimum Kicking In, and Break Boundaries", () => {
    it("prices Quantity 1 accurately with 0% break discount", () => {
      const res = calculateJobQuote({
        stitches: 8000,
        colors: 3,
        quantity: 1,
        customerSuppliesGarment: false,
        garmentCost: 4.5,
        applySetupFee: true,
        setupFee: 25
      });

      expect(res.activeBreak.label).toBe("1–11");
      expect(res.breakDiscount).toBe(0);
      expect(res.decorationPerPiece).toBe(13.0);
      expect(res.garmentPerPiece).toBe(6.3);
      expect(res.perPiece).toBe(19.3);
      expect(res.orderTotal).toBe(44.3); // $19.30 * 1 + $25.00
    });

    it("enforces the $5.00 minimum per-piece decoration price when base or discounted base is below minimum", () => {
      // 1,500 stitches -> base = 1.5 * $1.50 + $1.00 = $3.25 (< $5.00 minimum even at qty 1)
      const smallDesign = calculateJobQuote({
        stitches: 1500,
        colors: 2,
        quantity: 1,
        customerSuppliesGarment: true,
        garmentCost: 0,
        applySetupFee: false,
        setupFee: 0
      });

      expect(smallDesign.baseDecoration).toBe(3.25);
      expect(smallDesign.minimumApplied).toBe(true);
      expect(smallDesign.decorationPerPiece).toBe(5.0);
      expect(smallDesign.perPiece).toBe(5.0);
      expect(smallDesign.orderTotal).toBe(5.0);

      // 3,000 stitches -> base = 3 * $1.50 + $1.00 = $5.50 (above $5.00 at qty 1, but at qty 48 with 15% break -> $4.675 -> minimum $5.00 kicks in)
      const discountTriggeredMin = calculateJobQuote({
        stitches: 3000,
        colors: 2,
        quantity: 48,
        customerSuppliesGarment: false,
        garmentCost: 3.0, // $3.00 * 1.4 = $4.20
        applySetupFee: false,
        setupFee: 0
      });

      expect(discountTriggeredMin.baseDecoration).toBe(5.5);
      expect(discountTriggeredMin.discountedDecorationRaw).toBeCloseTo(4.675, 5);
      expect(discountTriggeredMin.minimumApplied).toBe(true);
      expect(discountTriggeredMin.decorationPerPiece).toBe(5.0);
      expect(discountTriggeredMin.garmentPerPiece).toBe(4.2);
      expect(discountTriggeredMin.perPiece).toBe(9.2);
      expect(discountTriggeredMin.orderTotal).toBe(441.6); // $9.20 * 48
    });

    it("applies exact discounts at every quantity break boundary (1, 11, 12, 23, 24, 47, 48, 143, 144)", () => {
      // Use 8,000 stitches, 3 colors -> base = $13.00
      const baseJob = {
        stitches: 8000,
        colors: 3,
        customerSuppliesGarment: true,
        garmentCost: 0,
        applySetupFee: false,
        setupFee: 0
      };

      const expectations: {
        qty: number;
        label: string;
        discount: number;
        perPiece: number;
        total: number;
      }[] = [
        { qty: 1, label: "1–11", discount: 0, perPiece: 13.0, total: 13.0 },
        { qty: 11, label: "1–11", discount: 0, perPiece: 13.0, total: 143.0 },
        { qty: 12, label: "12–23", discount: 0.05, perPiece: 12.35, total: 148.2 },
        { qty: 23, label: "12–23", discount: 0.05, perPiece: 12.35, total: 284.05 },
        { qty: 24, label: "24–47", discount: 0.1, perPiece: 11.7, total: 280.8 },
        { qty: 47, label: "24–47", discount: 0.1, perPiece: 11.7, total: 549.9 },
        { qty: 48, label: "48–143", discount: 0.15, perPiece: 11.05, total: 530.4 },
        { qty: 143, label: "48–143", discount: 0.15, perPiece: 11.05, total: 1580.15 },
        { qty: 144, label: "144+", discount: 0.2, perPiece: 10.4, total: 1497.6 },
        { qty: 300, label: "144+", discount: 0.2, perPiece: 10.4, total: 3120.0 }
      ];

      for (const exp of expectations) {
        const res = calculateJobQuote({ ...baseJob, quantity: exp.qty });
        expect(res.activeBreak.label).toBe(exp.label);
        expect(res.breakDiscount).toBe(exp.discount);
        expect(res.perPiece).toBe(exp.perPiece);
        expect(res.orderTotal).toBe(exp.total);
      }
    });

    it("charges extra-color fees only above colorsIncluded (6 by default)", () => {
      const sixColors = calculateJobQuote({
        stitches: 8000,
        colors: 6,
        quantity: 1,
        customerSuppliesGarment: true,
        garmentCost: 0,
        applySetupFee: false,
        setupFee: 0
      });
      expect(sixColors.extraColors).toBe(0);
      expect(sixColors.baseDecoration).toBe(13.0);

      const nineColors = calculateJobQuote({
        stitches: 8000,
        colors: 9, // 3 extra colors * $0.50 = $1.50
        quantity: 1,
        customerSuppliesGarment: true,
        garmentCost: 0,
        applySetupFee: false,
        setupFee: 0
      });
      expect(nineColors.extraColors).toBe(3);
      expect(nineColors.baseDecoration).toBe(14.5);
    });

    it("rounds per-piece price half-up to the cent before multiplying by quantity", () => {
      expect(roundHalfUpCents(1.005)).toBe(1.01);
      expect(roundHalfUpCents(1.235)).toBe(1.24);
      expect(roundHalfUpCents(1.234)).toBe(1.23);

      // 7,500 stitches -> base = 7.5 * $1.50 + $1.00 = $12.25
      // At qty 12 (5% discount): $12.25 * 0.95 = $11.6375 -> rounds half-up to $11.64 per piece
      // Order total must be $11.64 * 12 = $139.68 (NOT $11.6375 * 12 = $139.65)
      const res = calculateJobQuote({
        stitches: 7500,
        colors: 1,
        quantity: 12,
        customerSuppliesGarment: true,
        garmentCost: 0,
        applySetupFee: false,
        setupFee: 0
      });
      expect(res.perPiece).toBe(11.64);
      expect(res.orderTotal).toBe(139.68);
    });

    it("divides total order machine time by number of heads and builds the full break table", () => {
      const rates4Heads = { ...createDefaultRates(), heads: 4 };
      const res = calculateJobQuote(
        {
          stitches: 8000,
          colors: 3,
          quantity: 24,
          customerSuppliesGarment: true,
          garmentCost: 0,
          applySetupFee: false,
          setupFee: 0
        },
        rates4Heads
      );

      // Single-head order time = 14.3076923 * 24 = 343.3846 min; 4-head order time = 85.846 -> 85.85 min
      expect(res.orderMachineMinutes).toBe(85.85);
      expect(res.breakTable.length).toBe(5);
      expect(res.breakTable.map((r) => r.perPiece)).toEqual([13.0, 12.35, 11.7, 11.05, 10.4]);
      expect(findQuantityBreak(24, rates4Heads.quantityBreaks).label).toBe("24–47");
    });
  });
});
