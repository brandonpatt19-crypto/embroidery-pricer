import { buildEmbroideryDesign, interpolateTrims } from "./common";
import type { RawStitchRecord, ReaderResult, ThreadColor } from "./types";

const DST_HEADER_SIZE = 512;

function getBit(byte: number, pos: number): number {
  return (byte >> pos) & 1;
}

/**
 * Ported from EmbroidePy/pyembroidery (DstReader.decode_dx, MIT License).
 */
export function decodeDstDx(b0: number, b1: number, b2: number): number {
  let x = 0;
  x += getBit(b2, 2) * 81;
  x += getBit(b2, 3) * -81;
  x += getBit(b1, 2) * 27;
  x += getBit(b1, 3) * -27;
  x += getBit(b0, 2) * 9;
  x += getBit(b0, 3) * -9;
  x += getBit(b1, 0) * 3;
  x += getBit(b1, 1) * -3;
  x += getBit(b0, 0) * 1;
  x += getBit(b0, 1) * -1;
  return x;
}

/**
 * Ported from EmbroidePy/pyembroidery (DstReader.decode_dy, MIT License).
 */
export function decodeDstDy(b0: number, b1: number, b2: number): number {
  let y = 0;
  y += getBit(b2, 5) * 81;
  y += getBit(b2, 4) * -81;
  y += getBit(b1, 5) * 27;
  y += getBit(b1, 4) * -27;
  y += getBit(b0, 5) * 9;
  y += getBit(b0, 4) * -9;
  y += getBit(b1, 7) * 3;
  y += getBit(b1, 6) * -3;
  y += getBit(b0, 7) * 1;
  y += getBit(b0, 6) * -1;
  return -y;
}

function normalizeHex(raw: string): string {
  const cleaned = raw.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned.toLowerCase()}`;
  }
  return "#000000";
}

/**
 * Reads a Tajima .dst file from a Uint8Array buffer.
 */
export function readDst(bytes: Uint8Array, filename: string): ReaderResult {
  if (bytes.byteLength < DST_HEADER_SIZE + 3) {
    return {
      ok: false,
      error: "Invalid or truncated DST file: file is smaller than the 512-byte DST header plus one stitch record."
    };
  }

  // Validate header starts with recognizable ASCII DST header ("LA:" within first 32 bytes)
  const headerSlice = bytes.subarray(0, DST_HEADER_SIZE);
  const asciiPreview = new TextDecoder("utf-8", { fatal: false }).decode(
    headerSlice.subarray(0, 64)
  );
  if (!asciiPreview.includes("LA:")) {
    return {
      ok: false,
      error: "Invalid DST file: missing 'LA:' design label in the 512-byte Tajima header."
    };
  }

  const bodyByteLength = bytes.byteLength - DST_HEADER_SIZE;
  // Standard DST body is a multiple of 3 bytes; Wilcom DST appends a single 0x1A EOF byte ((size - 512) % 3 === 1).
  const remainder = bodyByteLength % 3;
  const hasWilcomTrailingEof =
    remainder === 1 && bytes[bytes.byteLength - 1] === 0x1a;

  if (remainder !== 0 && !hasWilcomTrailingEof) {
    return {
      ok: false,
      error: "Truncated or corrupted DST file: stitch data length is not a multiple of 3-byte DST records."
    };
  }

  // Parse 512-byte header lines
  const headerMetadata: Record<string, string> = {};
  const threads: ThreadColor[] = [];
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let start = 0;

  for (let i = 0; i < DST_HEADER_SIZE; i++) {
    const b = headerSlice[i];
    if (b === 13 || b === 10) {
      const end = i;
      const chunk = headerSlice.subarray(start, end);
      start = end;
      try {
        const line = decoder.decode(chunk).trim();
        if (line.length > 3 && line[2] === ":") {
          const prefix = line.slice(0, 2).trim();
          const value = line.slice(3).trim();
          if (prefix === "LA") {
            headerMetadata["name"] = value;
          } else if (prefix === "AU") {
            headerMetadata["author"] = value;
          } else if (prefix === "CP") {
            headerMetadata["copyright"] = value;
          } else if (prefix === "TC") {
            const parts = value.split(",").map((x) => x.trim());
            threads.push({
              hex: normalizeHex(parts[0] ?? "#000000"),
              description: parts[1] ?? "Custom DST Thread",
              catalogNumber: parts[2] ?? ""
            });
          } else {
            headerMetadata[prefix] = value;
          }
        }
      } catch {
        // Ignore non-UTF8 bytes in header per DstReader.py (#83)
      }
    }
  }

  // Read 3-byte stitch records
  const stitches: RawStitchRecord[] = [];
  let prevX = 0;
  let prevY = 0;
  let sequinMode = false;
  let rawRecordCountBeforeEnd = 0;
  let sawEndCommand = false;

  const addRelative = (dx: number, dy: number, command: RawStitchRecord["command"]) => {
    const x = prevX + dx;
    const y = prevY + dy;
    stitches.push({ x, y, command });
    prevX = x;
    prevY = y;
  };

  let offset = DST_HEADER_SIZE;
  while (offset + 3 <= bytes.byteLength) {
    const b0 = bytes[offset];
    const b1 = bytes[offset + 1];
    const b2 = bytes[offset + 2];
    offset += 3;

    // In DST every valid record sets the lowest two bits of byte 2 (0b00000011)
    if ((b2 & 0b00000011) !== 0b00000011) {
      return {
        ok: false,
        error: `Corrupted DST stitch record at byte offset ${offset - 3}: missing mandatory DST record tag bits.`
      };
    }

    const dx = decodeDstDx(b0, b1, b2);
    const dy = decodeDstDy(b0, b1, b2);

    if ((b2 & 0b11110011) === 0b11110011) {
      sawEndCommand = true;
      break;
    } else if ((b2 & 0b11000011) === 0b11000011) {
      rawRecordCountBeforeEnd += 1;
      addRelative(dx, dy, "COLOR_CHANGE");
    } else if ((b2 & 0b01000011) === 0b01000011) {
      rawRecordCountBeforeEnd += 1;
      addRelative(dx, dy, "SEQUIN_MODE");
      sequinMode = !sequinMode;
    } else if ((b2 & 0b10000011) === 0b10000011) {
      rawRecordCountBeforeEnd += 1;
      if (sequinMode) {
        addRelative(dx, dy, "SEQUIN_EJECT");
      } else {
        addRelative(dx, dy, "JUMP");
      }
    } else {
      rawRecordCountBeforeEnd += 1;
      addRelative(dx, dy, "STITCH");
    }
  }

  if (rawRecordCountBeforeEnd === 0) {
    return {
      ok: false,
      error: "Invalid DST file: file contains no stitch records."
    };
  }

  // Append END command at (0, 0) relative to last point, matching pyembroidery DstReader.py line 89
  addRelative(0, 0, "END");

  // Interpolate trims (count_max = 3, clipping = true) matching pyembroidery DstReader.py line 100
  interpolateTrims(stitches, 3, null, true);

  // Check header counts against computed counts and emit warnings if they disagree
  const warnings: string[] = [];
  let computedNormalStitches = 0;
  let computedColorChanges = 0;
  for (const s of stitches) {
    if (s.command === "STITCH") computedNormalStitches += 1;
    else if (s.command === "COLOR_CHANGE") computedColorChanges += 1;
  }

  if (headerMetadata["CO"] !== undefined) {
    const headerCo = Number.parseInt(headerMetadata["CO"], 10);
    if (!Number.isNaN(headerCo) && headerCo !== computedColorChanges) {
      warnings.push(
        `Header color change count (CO=${headerCo}) disagrees with stitch records (${computedColorChanges} color changes). Using stitch records.`
      );
    }
  }

  if (headerMetadata["ST"] !== undefined) {
    const headerSt = Number.parseInt(headerMetadata["ST"], 10);
    const totalRawRecordsWithEnd = rawRecordCountBeforeEnd + (sawEndCommand ? 1 : 0);
    if (
      !Number.isNaN(headerSt) &&
      headerSt !== computedNormalStitches &&
      headerSt !== totalRawRecordsWithEnd &&
      headerSt !== rawRecordCountBeforeEnd
    ) {
      warnings.push(
        `Header stitch count (ST=${headerSt}) disagrees with stitch records (${computedNormalStitches} normal stitches, ${totalRawRecordsWithEnd} total records). Using stitch records.`
      );
    } else if (!Number.isNaN(headerSt) && headerSt !== computedNormalStitches) {
      warnings.push(
        `Header ST (${headerSt}) includes jumps/color-changes/end records; pricing uses ${computedNormalStitches} normal stitches computed from stitch records.`
      );
    }
  }

  const label = headerMetadata["name"] || filename.replace(/\.[^.]+$/, "");

  const design = buildEmbroideryDesign({
    format: "dst",
    filename,
    label,
    stitches,
    threads,
    warnings,
    headerMetadata
  });

  return { ok: true, design };
}
