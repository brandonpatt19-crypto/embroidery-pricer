import type { ThreadColor } from "./types";

/**
 * Brother PEC 65-entry palette (index 0 is unused/null placeholder; indices 1..64 are Brother threads).
 * Ported from EmbroidePy/pyembroidery (EmbThreadPec.py, MIT License).
 */
export const PEC_THREAD_SET: readonly (ThreadColor | null)[] = [
  null,
  { hex: "#0e1f7c", description: "Prussian Blue", catalogNumber: "1", brand: "Brother", chart: "Brother" },
  { hex: "#0a55a3", description: "Blue", catalogNumber: "2", brand: "Brother", chart: "Brother" },
  { hex: "#008777", description: "Teal Green", catalogNumber: "3", brand: "Brother", chart: "Brother" },
  { hex: "#4b6baf", description: "Cornflower Blue", catalogNumber: "4", brand: "Brother", chart: "Brother" },
  { hex: "#ed171f", description: "Red", catalogNumber: "5", brand: "Brother", chart: "Brother" },
  { hex: "#d15c00", description: "Reddish Brown", catalogNumber: "6", brand: "Brother", chart: "Brother" },
  { hex: "#913697", description: "Magenta", catalogNumber: "7", brand: "Brother", chart: "Brother" },
  { hex: "#e49acb", description: "Light Lilac", catalogNumber: "8", brand: "Brother", chart: "Brother" },
  { hex: "#915fac", description: "Lilac", catalogNumber: "9", brand: "Brother", chart: "Brother" },
  { hex: "#9ed67d", description: "Mint Green", catalogNumber: "10", brand: "Brother", chart: "Brother" },
  { hex: "#e8a900", description: "Deep Gold", catalogNumber: "11", brand: "Brother", chart: "Brother" },
  { hex: "#feba35", description: "Orange", catalogNumber: "12", brand: "Brother", chart: "Brother" },
  { hex: "#ffff00", description: "Yellow", catalogNumber: "13", brand: "Brother", chart: "Brother" },
  { hex: "#70bc1f", description: "Lime Green", catalogNumber: "14", brand: "Brother", chart: "Brother" },
  { hex: "#ba9800", description: "Brass", catalogNumber: "15", brand: "Brother", chart: "Brother" },
  { hex: "#a8a8a8", description: "Silver", catalogNumber: "16", brand: "Brother", chart: "Brother" },
  { hex: "#7d6f00", description: "Russet Brown", catalogNumber: "17", brand: "Brother", chart: "Brother" },
  { hex: "#ffffb3", description: "Cream Brown", catalogNumber: "18", brand: "Brother", chart: "Brother" },
  { hex: "#4f5556", description: "Pewter", catalogNumber: "19", brand: "Brother", chart: "Brother" },
  { hex: "#000000", description: "Black", catalogNumber: "20", brand: "Brother", chart: "Brother" },
  { hex: "#0b3d91", description: "Ultramarine", catalogNumber: "21", brand: "Brother", chart: "Brother" },
  { hex: "#770176", description: "Royal Purple", catalogNumber: "22", brand: "Brother", chart: "Brother" },
  { hex: "#293133", description: "Dark Gray", catalogNumber: "23", brand: "Brother", chart: "Brother" },
  { hex: "#2a1301", description: "Dark Brown", catalogNumber: "24", brand: "Brother", chart: "Brother" },
  { hex: "#f64a8a", description: "Deep Rose", catalogNumber: "25", brand: "Brother", chart: "Brother" },
  { hex: "#b27624", description: "Light Brown", catalogNumber: "26", brand: "Brother", chart: "Brother" },
  { hex: "#fcbbc5", description: "Salmon Pink", catalogNumber: "27", brand: "Brother", chart: "Brother" },
  { hex: "#fe370f", description: "Vermilion", catalogNumber: "28", brand: "Brother", chart: "Brother" },
  { hex: "#f0f0f0", description: "White", catalogNumber: "29", brand: "Brother", chart: "Brother" },
  { hex: "#6a1c8a", description: "Violet", catalogNumber: "30", brand: "Brother", chart: "Brother" },
  { hex: "#a8ddc4", description: "Seacrest", catalogNumber: "31", brand: "Brother", chart: "Brother" },
  { hex: "#2584bb", description: "Sky Blue", catalogNumber: "32", brand: "Brother", chart: "Brother" },
  { hex: "#feb343", description: "Pumpkin", catalogNumber: "33", brand: "Brother", chart: "Brother" },
  { hex: "#fff36b", description: "Cream Yellow", catalogNumber: "34", brand: "Brother", chart: "Brother" },
  { hex: "#d0a660", description: "Khaki", catalogNumber: "35", brand: "Brother", chart: "Brother" },
  { hex: "#d15400", description: "Clay Brown", catalogNumber: "36", brand: "Brother", chart: "Brother" },
  { hex: "#66ba49", description: "Leaf Green", catalogNumber: "37", brand: "Brother", chart: "Brother" },
  { hex: "#134a46", description: "Peacock Blue", catalogNumber: "38", brand: "Brother", chart: "Brother" },
  { hex: "#878787", description: "Gray", catalogNumber: "39", brand: "Brother", chart: "Brother" },
  { hex: "#d8ccc6", description: "Warm Gray", catalogNumber: "40", brand: "Brother", chart: "Brother" },
  { hex: "#435607", description: "Dark Olive", catalogNumber: "41", brand: "Brother", chart: "Brother" },
  { hex: "#fdd9de", description: "Flesh Pink", catalogNumber: "42", brand: "Brother", chart: "Brother" },
  { hex: "#f993bc", description: "Pink", catalogNumber: "43", brand: "Brother", chart: "Brother" },
  { hex: "#003822", description: "Deep Green", catalogNumber: "44", brand: "Brother", chart: "Brother" },
  { hex: "#b2afd4", description: "Lavender", catalogNumber: "45", brand: "Brother", chart: "Brother" },
  { hex: "#686ab0", description: "Wisteria Violet", catalogNumber: "46", brand: "Brother", chart: "Brother" },
  { hex: "#efe3b9", description: "Beige", catalogNumber: "47", brand: "Brother", chart: "Brother" },
  { hex: "#f73866", description: "Carmine", catalogNumber: "48", brand: "Brother", chart: "Brother" },
  { hex: "#b54b64", description: "Amber Red", catalogNumber: "49", brand: "Brother", chart: "Brother" },
  { hex: "#132b1a", description: "Olive Green", catalogNumber: "50", brand: "Brother", chart: "Brother" },
  { hex: "#c70156", description: "Dark Fuchsia", catalogNumber: "51", brand: "Brother", chart: "Brother" },
  { hex: "#fe9e32", description: "Tangerine", catalogNumber: "52", brand: "Brother", chart: "Brother" },
  { hex: "#a8deeb", description: "Light Blue", catalogNumber: "53", brand: "Brother", chart: "Brother" },
  { hex: "#00673e", description: "Emerald Green", catalogNumber: "54", brand: "Brother", chart: "Brother" },
  { hex: "#4e2990", description: "Purple", catalogNumber: "55", brand: "Brother", chart: "Brother" },
  { hex: "#2f7e20", description: "Moss Green", catalogNumber: "56", brand: "Brother", chart: "Brother" },
  { hex: "#ffcccc", description: "Flesh Pink", catalogNumber: "57", brand: "Brother", chart: "Brother" },
  { hex: "#ffd911", description: "Harvest Gold", catalogNumber: "58", brand: "Brother", chart: "Brother" },
  { hex: "#095ba6", description: "Electric Blue", catalogNumber: "59", brand: "Brother", chart: "Brother" },
  { hex: "#f0f970", description: "Lemon Yellow", catalogNumber: "60", brand: "Brother", chart: "Brother" },
  { hex: "#e3f35b", description: "Fresh Green", catalogNumber: "61", brand: "Brother", chart: "Brother" },
  { hex: "#ff9900", description: "Orange", catalogNumber: "62", brand: "Brother", chart: "Brother" },
  { hex: "#fff08d", description: "Cream Yellow", catalogNumber: "63", brand: "Brother", chart: "Brother" },
  { hex: "#ffc8c8", description: "Applique", catalogNumber: "64", brand: "Brother", chart: "Brother" }
];

/**
 * Fixed fallback palette for formats that do not store thread colors (such as standard DST).
 */
export const DEFAULT_FALLBACK_PALETTE: readonly ThreadColor[] = [
  { hex: "#1d4ed8", description: "Royal Blue (Default 1)" },
  { hex: "#dc2626", description: "Crimson Red (Default 2)" },
  { hex: "#15803d", description: "Forest Green (Default 3)" },
  { hex: "#d97706", description: "Amber Gold (Default 4)" },
  { hex: "#7c3aed", description: "Violet Purple (Default 5)" },
  { hex: "#0f766e", description: "Teal (Default 6)" },
  { hex: "#be185d", description: "Magenta (Default 7)" },
  { hex: "#374151", description: "Charcoal (Default 8)" },
  { hex: "#ea580c", description: "Burnt Orange (Default 9)" },
  { hex: "#0284c7", description: "Sky Blue (Default 10)" },
  { hex: "#4d7c0f", description: "Olive Green (Default 11)" },
  { hex: "#111827", description: "Jet Black (Default 12)" }
];

export function getFallbackThread(index: number): ThreadColor {
  const entry = DEFAULT_FALLBACK_PALETTE[index % DEFAULT_FALLBACK_PALETTE.length];
  return {
    hex: entry.hex,
    description: entry.description,
    catalogNumber: String(index + 1),
    brand: "Default Palette"
  };
}
