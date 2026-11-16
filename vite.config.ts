import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        charge: "how-much-to-charge-for-embroidery/index.html",
        chargeFlat: "how-much-to-charge-for-embroidery.html",
        per1000: "embroidery-price-per-1000-stitches/index.html",
        per1000Flat: "embroidery-price-per-1000-stitches.html",
        stitchCount: "stitch-count-calculator/index.html",
        stitchCountFlat: "stitch-count-calculator.html",
        hats: "how-to-price-embroidered-hats/index.html",
        hatsFlat: "how-to-price-embroidered-hats.html",
        privacy: "privacy/index.html",
        privacyFlat: "privacy.html"
      }
    }
  }
});
