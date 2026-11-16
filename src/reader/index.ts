import { readDst } from "./dst";
import { readPes } from "./pes";
import type { ReaderResult } from "./types";

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validates and parses a .dst or .pes file buffer up to 10 MB.
 * Never throws or crashes; returns a structured { ok: true, design } or { ok: false, error }.
 */
export function parseEmbroideryFile(
  buffer: ArrayBuffer | Uint8Array,
  filename: string
): ReaderResult {
  try {
    const bytes =
      buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

    if (bytes.byteLength === 0) {
      return {
        ok: false,
        error: "The selected file is empty (0 bytes). Please choose a valid .dst or .pes embroidery file."
      };
    }

    if (bytes.byteLength > MAX_FILE_SIZE_BYTES) {
      return {
        ok: false,
        error: `File exceeds the 10 MB limit (${(bytes.byteLength / (1024 * 1024)).toFixed(1)} MB). Please upload a .dst or .pes file under 10 MB.`
      };
    }

    // Reject common non-embroidery binary signatures (such as renamed JPEG, PNG, PDF, ZIP)
    if (
      bytes.byteLength >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    ) {
      return {
        ok: false,
        error: "Unsupported file content: this file is a JPEG image, not a .dst or .pes embroidery file."
      };
    }
    if (
      bytes.byteLength >= 4 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return {
        ok: false,
        error: "Unsupported file content: this file is a PNG image, not a .dst or .pes embroidery file."
      };
    }

    const lowerName = filename.trim().toLowerCase();
    if (lowerName.endsWith(".dst")) {
      return readDst(bytes, filename);
    }
    if (lowerName.endsWith(".pes")) {
      return readPes(bytes, filename);
    }

    return {
      ok: false,
      error: "Unsupported file format. Please select a Tajima (.dst) or Brother (.pes) embroidery file."
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown parsing error";
    return {
      ok: false,
      error: `Could not read embroidery file: ${message}`
    };
  }
}

export * from "./types";
export * from "./palette";
export { readDst } from "./dst";
export { readPes } from "./pes";
