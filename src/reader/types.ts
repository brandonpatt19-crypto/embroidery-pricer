export type StitchCommand =
  | "STITCH"
  | "JUMP"
  | "TRIM"
  | "COLOR_CHANGE"
  | "STOP"
  | "SEQUIN_MODE"
  | "SEQUIN_EJECT"
  | "END";

export interface RawStitchRecord {
  x: number; // absolute coordinate in 0.1 mm units
  y: number; // absolute coordinate in 0.1 mm units
  command: StitchCommand;
}

export interface ThreadColor {
  hex: string; // "#RRGGBB"
  description: string;
  catalogNumber?: string;
  brand?: string;
  chart?: string;
}

export interface Point2D {
  x: number; // in mm
  y: number; // in mm
}

export interface StitchSegment {
  points: Point2D[]; // contiguous stitched polyline in mm
}

export interface ThreadBlock {
  index: number;
  color: ThreadColor;
  stitchCount: number;
  segments: StitchSegment[]; // contiguous stitch paths within this thread block
}

export interface EmbroideryDesign {
  format: "dst" | "pes";
  filename: string;
  label: string;
  normalStitches: number;
  jumps: number;
  trims: number;
  colorChanges: number;
  stops: number;
  threadBlocks: number;
  widthMm: number;
  heightMm: number;
  widthIn: number;
  heightIn: number;
  boundsMm: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  threads: ThreadColor[];
  blocks: ThreadBlock[];
  warnings: string[];
  headerMetadata: Record<string, string>;
}

export type ReaderResult =
  | { ok: true; design: EmbroideryDesign }
  | { ok: false; error: string };

export interface WorkerParseRequest {
  id: number;
  filename: string;
  buffer: ArrayBuffer;
}

export type WorkerParseResponse =
  | { id: number; ok: true; design: EmbroideryDesign }
  | { id: number; ok: false; error: string };
