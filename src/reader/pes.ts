import { buildEmbroideryDesign, interpolateDuplicateColorAsStop } from "./common";
import { PEC_THREAD_SET } from "./palette";
import type { RawStitchRecord, ReaderResult, ThreadColor } from "./types";

const JUMP_CODE = 0x10;
const TRIM_CODE = 0x20;
const FLAG_LONG = 0x80;

class ByteReader {
  private view: DataView;
  private bytes: Uint8Array;
  public pos: number = 0;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  get length(): number {
    return this.bytes.byteLength;
  }

  seek(offset: number, whence: "set" | "cur" = "set"): void {
    if (whence === "set") {
      this.pos = offset;
    } else {
      this.pos += offset;
    }
  }

  readU8(): number | null {
    if (this.pos >= this.bytes.byteLength) return null;
    return this.bytes[this.pos++];
  }

  readU16LE(): number | null {
    if (this.pos + 2 > this.bytes.byteLength) return null;
    const val = this.view.getUint16(this.pos, true);
    this.pos += 2;
    return val;
  }

  readS16LE(): number | null {
    if (this.pos + 2 > this.bytes.byteLength) return null;
    const val = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return val;
  }

  readU24LE(): number | null {
    if (this.pos + 3 > this.bytes.byteLength) return null;
    const b0 = this.bytes[this.pos];
    const b1 = this.bytes[this.pos + 1];
    const b2 = this.bytes[this.pos + 2];
    this.pos += 3;
    return b0 | (b1 << 8) | (b2 << 16);
  }

  readU24BE(): number | null {
    if (this.pos + 3 > this.bytes.byteLength) return null;
    const b0 = this.bytes[this.pos];
    const b1 = this.bytes[this.pos + 1];
    const b2 = this.bytes[this.pos + 2];
    this.pos += 3;
    return (b0 << 16) | (b1 << 8) | b2;
  }

  readU32LE(): number | null {
    if (this.pos + 4 > this.bytes.byteLength) return null;
    const val = this.view.getUint32(this.pos, true);
    this.pos += 4;
    return val;
  }

  readBytes(count: number): Uint8Array | null {
    if (this.pos + count > this.bytes.byteLength) return null;
    const sub = this.bytes.subarray(this.pos, this.pos + count);
    this.pos += count;
    return sub;
  }

  readAscii(count: number): string | null {
    const sub = this.readBytes(count);
    if (!sub) return null;
    return new TextDecoder("utf-8", { fatal: false }).decode(sub);
  }

  readPesString(): string | null {
    const len = this.readU8();
    if (len === null || len === 0) return null;
    return this.readAscii(len);
  }
}

export function signed12(b: number): number {
  const masked = b & 0xfff;
  return masked > 0x7ff ? -0x1000 + masked : masked;
}

export function signed7(b: number): number {
  return b > 63 ? -128 + b : b;
}

function readPesMetadata(r: ByteReader, meta: Record<string, string>): void {
  const keys = ["name", "category", "author", "keywords", "comments"];
  for (const key of keys) {
    const v = r.readPesString();
    if (v && v.length > 0) {
      meta[key] = v;
    }
  }
}

function readPesThread(r: ByteReader): ThreadColor | null {
  const catalogNumber = r.readPesString() ?? undefined;
  const rgb = r.readU24BE();
  if (rgb === null) return null;
  r.seek(5, "cur");
  const description = r.readPesString() ?? "";
  const brand = r.readPesString() ?? undefined;
  const chart = r.readPesString() ?? undefined;
  const hex = `#${(rgb & 0xffffff).toString(16).padStart(6, "0")}`;
  return {
    hex,
    description,
    catalogNumber,
    brand,
    chart
  };
}

function readPesHeaderThreadsAfterSkips(
  r: ByteReader,
  meta: Record<string, string>,
  threadlist: ThreadColor[],
  preImageSkip: number,
  postImageSkip: number,
  imageKey: string,
  hoopPreSkip?: number
): void {
  r.seek(4, "cur");
  readPesMetadata(r, meta);
  if (hoopPreSkip !== undefined) {
    r.seek(hoopPreSkip, "cur");
    const hoop = r.readPesString();
    if (hoop && hoop.length > 0) {
      meta["hoop_name"] = hoop;
    }
  }
  r.seek(preImageSkip, "cur");
  const img = r.readPesString();
  if (img && img.length > 0) {
    meta[imageKey] = img;
  }
  r.seek(postImageSkip, "cur");
  const countProgrammableFills = r.readU16LE();
  if (countProgrammableFills === null || countProgrammableFills !== 0) return;
  const countMotifs = r.readU16LE();
  if (countMotifs === null || countMotifs !== 0) return;
  const countFeatherPatterns = r.readU16LE();
  if (countFeatherPatterns === null || countFeatherPatterns !== 0) return;
  const countThreads = r.readU16LE();
  if (countThreads === null) return;
  for (let i = 0; i < countThreads; i++) {
    const t = readPesThread(r);
    if (!t) break;
    threadlist.push(t);
  }
}

/**
 * Maps PEC 1-byte palette indices to ThreadColor objects using optional PES v5+ header chart.
 * Ported from EmbroidePy/pyembroidery (PecReader.map_pec_colors, MIT License).
 */
function mapPecColors(
  colorBytes: Uint8Array,
  pesChart: ThreadColor[]
): (ThreadColor | null)[] {
  const maxValue = PEC_THREAD_SET.length; // 65
  const out: (ThreadColor | null)[] = [];

  if (pesChart.length === 0) {
    for (let i = 0; i < colorBytes.length; i++) {
      const idx = colorBytes[i] % maxValue;
      out.push(PEC_THREAD_SET[idx] ?? null);
    }
  } else if (pesChart.length >= colorBytes.length) {
    for (const t of pesChart) {
      out.push(t);
    }
  } else {
    const chartQueue = [...pesChart];
    const threadMap = new Map<number, ThreadColor | null>();
    for (let i = 0; i < colorBytes.length; i++) {
      const colorIndex = colorBytes[i] % maxValue;
      let threadValue = threadMap.get(colorIndex);
      if (threadValue === undefined) {
        if (chartQueue.length > 0) {
          threadValue = chartQueue.shift() ?? null;
        } else {
          threadValue = PEC_THREAD_SET[colorIndex] ?? null;
        }
        threadMap.set(colorIndex, threadValue);
      }
      out.push(threadValue);
    }
  }

  return out;
}

/**
 * Reads a Brother .pes (or standalone #PEC0001) file from a Uint8Array buffer.
 */
export function readPes(bytes: Uint8Array, filename: string): ReaderResult {
  if (bytes.byteLength < 48) {
    return {
      ok: false,
      error: "Invalid or truncated PES file: file is too small to contain a PES/PEC header."
    };
  }

  const r = new ByteReader(bytes);
  const magic = r.readAscii(8);
  if (!magic || (!magic.startsWith("#PES") && magic !== "#PEC0001")) {
    return {
      ok: false,
      error: "Invalid PES file: file does not start with a valid '#PES' or '#PEC0001' signature."
    };
  }

  const headerMetadata: Record<string, string> = {};
  const loadedThreadValues: ThreadColor[] = [];
  let pecBlockPosition = 8;

  if (magic !== "#PEC0001") {
    const seekVal = r.readU32LE();
    if (seekVal === null || seekVal < 12 || seekVal + 532 > bytes.byteLength) {
      return {
        ok: false,
        error: "Invalid or truncated PES file: PEC block offset in header points outside the file."
      };
    }
    pecBlockPosition = seekVal;

    try {
      switch (magic) {
        case "#PES0100":
          headerMetadata["version"] = "10";
          readPesHeaderThreadsAfterSkips(r, headerMetadata, loadedThreadValues, 38, 34, "image_file", 14);
          break;
        case "#PES0090":
          headerMetadata["version"] = "9";
          readPesHeaderThreadsAfterSkips(r, headerMetadata, loadedThreadValues, 30, 34, "image_file", 14);
          break;
        case "#PES0080":
          headerMetadata["version"] = "8";
          readPesHeaderThreadsAfterSkips(r, headerMetadata, loadedThreadValues, 38, 26, "image_file");
          break;
        case "#PES0070":
          headerMetadata["version"] = "7";
          readPesHeaderThreadsAfterSkips(r, headerMetadata, loadedThreadValues, 36, 24, "image_file");
          break;
        case "#PES0060":
          headerMetadata["version"] = "6";
          readPesHeaderThreadsAfterSkips(r, headerMetadata, loadedThreadValues, 36, 24, "image_file");
          break;
        case "#PES0050":
        case "#PES0055":
        case "#PES0056":
          headerMetadata["version"] = magic === "#PES0050" ? "5" : magic === "#PES0055" ? "5.5" : "5.6";
          readPesHeaderThreadsAfterSkips(r, headerMetadata, loadedThreadValues, 24, 24, "image");
          break;
        case "#PES0040":
          headerMetadata["version"] = "4";
          r.seek(4, "cur");
          readPesMetadata(r, headerMetadata);
          break;
        case "#PES0030":
          headerMetadata["version"] = "3";
          break;
        case "#PES0022":
          headerMetadata["version"] = "2.2";
          break;
        case "#PES0020":
          headerMetadata["version"] = "2";
          break;
        case "#PES0001":
          headerMetadata["version"] = "1";
          break;
        default:
          headerMetadata["version"] = magic.slice(4);
          break;
      }
    } catch {
      // As in pyembroidery PesReader.py: ignore complex header errors and read the PEC block directly.
    }
  }

  // Seek to PEC block (common across all PES versions)
  r.seek(pecBlockPosition, "set");
  r.seek(3, "cur"); // "LA:"
  const rawLabel = r.readAscii(16);
  if (rawLabel === null) {
    return {
      ok: false,
      error: "Truncated PES/PEC block: could not read design label."
    };
  }
  headerMetadata["Name"] = rawLabel.trim();

  r.seek(0x0f, "cur");
  const pecGraphicByteStride = r.readU8();
  const pecGraphicIconHeight = r.readU8();
  if (pecGraphicByteStride === null || pecGraphicIconHeight === null) {
    return {
      ok: false,
      error: "Truncated PES/PEC block: missing graphic header fields."
    };
  }

  r.seek(0x0c, "cur");
  const headerColorChangesByte = r.readU8();
  if (headerColorChangesByte === null) {
    return {
      ok: false,
      error: "Truncated PES/PEC block: missing color change count byte."
    };
  }

  // In PEC, 0xFF indicates 0 colors; otherwise count_colors = color_changes + 1
  const headerColorChanges = headerColorChangesByte === 0xff ? 0 : headerColorChangesByte;
  const countColors = headerColorChangesByte === 0xff ? 0 : headerColorChanges + 1;
  const colorBytes = r.readBytes(countColors);
  if (!colorBytes) {
    return {
      ok: false,
      error: "Truncated PES/PEC block: file ends inside PEC color palette table."
    };
  }

  const threadlist = mapPecColors(colorBytes, loadedThreadValues);

  // Seek to second PEC header at pecBlockPosition + 512
  r.seek(0x1d0 - headerColorChangesByte, "cur");
  const stitchBlockEndRel = r.readU24LE();
  if (stitchBlockEndRel === null) {
    return {
      ok: false,
      error: "Truncated PES/PEC block: missing stitch block length."
    };
  }

  // Skip 11 bytes (3 bytes '\x31\xff\xf0' + four 16-bit shorts) to reach stitch list
  if (r.pos + 0x0b > r.length) {
    return {
      ok: false,
      error: "Truncated PES/PEC block: file ends before stitch data starts."
    };
  }
  r.seek(0x0b, "cur");

  // Read PEC stitch list
  const stitches: RawStitchRecord[] = [];
  let prevX = 0;
  let prevY = 0;

  const addRelative = (dx: number, dy: number, command: RawStitchRecord["command"]) => {
    const x = prevX + dx;
    const y = prevY + dy;
    stitches.push({ x, y, command });
    prevX = x;
    prevY = y;
  };

  while (true) {
    const val1 = r.readU8();
    const val2Initial = r.readU8();
    if (val1 === null || val2Initial === null || (val1 === 0xff && val2Initial === 0x00)) {
      break;
    }
    if (val1 === 0xfe && val2Initial === 0xb0) {
      r.seek(1, "cur");
      addRelative(0, 0, "COLOR_CHANGE");
      continue;
    }

    let jump = false;
    let trim = false;
    let x = 0;
    let y = 0;
    let val2: number | null = val2Initial;

    if ((val1 & FLAG_LONG) !== 0) {
      if ((val1 & TRIM_CODE) !== 0) trim = true;
      if ((val1 & JUMP_CODE) !== 0) jump = true;
      const code = (val1 << 8) | val2;
      x = signed12(code);
      val2 = r.readU8();
      if (val2 === null) {
        break;
      }
    } else {
      x = signed7(val1);
    }

    if ((val2 & FLAG_LONG) !== 0) {
      if ((val2 & TRIM_CODE) !== 0) trim = true;
      if ((val2 & JUMP_CODE) !== 0) jump = true;
      const val3 = r.readU8();
      if (val3 === null) {
        break;
      }
      const code = (val2 << 8) | val3;
      y = signed12(code);
    } else {
      y = signed7(val2);
    }

    if (jump) {
      addRelative(x, y, "JUMP");
    } else if (trim) {
      addRelative(0, 0, "TRIM");
      addRelative(x, y, "JUMP");
    } else {
      addRelative(x, y, "STITCH");
    }
  }

  if (stitches.length === 0) {
    return {
      ok: false,
      error: "Invalid PES file: PEC section contains no stitch records."
    };
  }

  // Append END command at (0, 0) relative to last point, matching pyembroidery PecReader.py line 157
  addRelative(0, 0, "END");

  // Replace duplicate consecutive threads with STOP, matching PesReader.py line 68
  interpolateDuplicateColorAsStop(stitches, threadlist);

  // Verify header color_changes vs computed colorChanges from stitch records
  let computedColorChanges = 0;
  for (const s of stitches) {
    if (s.command === "COLOR_CHANGE") computedColorChanges += 1;
  }

  const warnings: string[] = [];
  if (headerColorChanges !== computedColorChanges) {
    warnings.push(
      `PEC header color change count (${headerColorChanges}) disagrees with stitch records (${computedColorChanges} color changes). Using stitch records.`
    );
  }

  const label =
    headerMetadata["name"] ||
    headerMetadata["Name"] ||
    filename.replace(/\.[^.]+$/, "");

  const design = buildEmbroideryDesign({
    format: "pes",
    filename,
    label,
    stitches,
    threads: threadlist,
    warnings,
    headerMetadata
  });

  return { ok: true, design };
}
