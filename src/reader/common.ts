import { getFallbackThread } from "./palette";
import type {
  EmbroideryDesign,
  Point2D,
  RawStitchRecord,
  StitchSegment,
  ThreadBlock,
  ThreadColor
} from "./types";

/**
 * Ported from EmbroidePy/pyembroidery (EmbPattern.interpolate_trims, MIT License).
 * Inserts TRIM commands when consecutive JUMP commands reach `jumpsToRequireTrim` (default 3)
 * and clips zero-net-displacement jump sequences when `clipping` is true.
 */
export function interpolateTrims(
  stitches: RawStitchRecord[],
  jumpsToRequireTrim: number | null = 3,
  distanceToRequireTrim: number | null = null,
  clipping: boolean = true
): void {
  let i = -1;
  let ie = stitches.length - 1;
  let x = 0;
  let y = 0;
  let jumpCount = 0;
  let jumpStart = 0;
  let jumpDx = 0;
  let jumpDy = 0;
  let jumping = false;
  let trimmed = true;

  while (i < ie) {
    i += 1;
    const stitch = stitches[i];
    const dx = stitch.x - x;
    const dy = stitch.y - y;
    x = stitch.x;
    y = stitch.y;
    const command = stitch.command;

    if (command === "STITCH" || command === "SEQUIN_EJECT") {
      trimmed = false;
      jumping = false;
    } else if (command === "COLOR_CHANGE" || command === "TRIM") {
      trimmed = true;
      jumping = false;
    }

    if (command === "JUMP") {
      if (!jumping) {
        jumpDx = 0;
        jumpDy = 0;
        jumpCount = 0;
        jumpStart = i;
        jumping = true;
      }
      jumpCount += 1;
      jumpDx += dx;
      jumpDy += dy;

      if (!trimmed) {
        if (
          jumpCount === jumpsToRequireTrim ||
          (distanceToRequireTrim !== null &&
            (Math.abs(jumpDy) > distanceToRequireTrim ||
              Math.abs(jumpDx) > distanceToRequireTrim))
        ) {
          const prevX = jumpStart > 0 ? stitches[jumpStart - 1].x : 0;
          const prevY = jumpStart > 0 ? stitches[jumpStart - 1].y : 0;
          stitches.splice(jumpStart, 0, {
            x: prevX,
            y: prevY,
            command: "TRIM"
          });
          jumpStart += 1;
          i += 1;
          ie += 1;
          trimmed = true;
        }
      }

      if (clipping && jumpDx === 0 && jumpDy === 0) {
        stitches.splice(jumpStart, i + 1 - jumpStart);
        i = jumpStart - 1;
        ie = stitches.length - 1;
      }
    }
  }
}

export function threadsEqual(a: ThreadColor | undefined, b: ThreadColor | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.hex.toLowerCase() === b.hex.toLowerCase() &&
    (a.description ?? "") === (b.description ?? "") &&
    (a.catalogNumber ?? "") === (b.catalogNumber ?? "") &&
    (a.brand ?? "") === (b.brand ?? "") &&
    (a.chart ?? "") === (b.chart ?? "")
  );
}

/**
 * Ported from EmbroidePy/pyembroidery (EmbPattern.interpolate_duplicate_color_as_stop, MIT License).
 * Replaces duplicate consecutive threads in `threadlist` with a STOP command.
 */
export function interpolateDuplicateColorAsStop(
  stitches: RawStitchRecord[],
  threadlist: (ThreadColor | null)[]
): void {
  let threadIndex = 0;
  let initColor = true;
  let lastChange: number | null = null;

  for (let position = 0; position < stitches.length; position++) {
    const stitch = stitches[position];
    const data = stitch.command;
    if (data === "STITCH") {
      if (initColor) {
        if (threadIndex >= threadlist.length) {
          return;
        }
        if (
          lastChange !== null &&
          threadIndex !== 0 &&
          threadsEqual(
            threadlist[threadIndex - 1] ?? undefined,
            threadlist[threadIndex] ?? undefined
          )
        ) {
          threadlist.splice(threadIndex, 1);
          stitches[lastChange].command = "STOP";
        } else {
          threadIndex += 1;
        }
        initColor = false;
      }
    } else if (data === "COLOR_CHANGE") {
      initColor = true;
      lastChange = position;
    }
  }
}

/**
 * Summarizes decoded stitch records into the structured EmbroideryDesign output.
 */
export function buildEmbroideryDesign(params: {
  format: "dst" | "pes";
  filename: string;
  label: string;
  stitches: RawStitchRecord[];
  threads: (ThreadColor | null)[];
  warnings: string[];
  headerMetadata: Record<string, string>;
}): EmbroideryDesign {
  const { format, filename, label, stitches, threads, warnings, headerMetadata } = params;

  let normalStitches = 0;
  let jumps = 0;
  let trims = 0;
  let colorChanges = 0;
  let stops = 0;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const s of stitches) {
    if (s.x > maxX) maxX = s.x;
    if (s.x < minX) minX = s.x;
    if (s.y > maxY) maxY = s.y;
    if (s.y < minY) minY = s.y;

    switch (s.command) {
      case "STITCH":
        normalStitches += 1;
        break;
      case "JUMP":
        jumps += 1;
        break;
      case "TRIM":
        trims += 1;
        break;
      case "COLOR_CHANGE":
        colorChanges += 1;
        break;
      case "STOP":
        stops += 1;
        break;
    }
  }

  const hasCoords = stitches.length > 0 && Number.isFinite(minX) && Number.isFinite(maxX);
  const minXMm = hasCoords ? minX / 10.0 : 0;
  const minYMm = hasCoords ? minY / 10.0 : 0;
  const maxXMm = hasCoords ? maxX / 10.0 : 0;
  const maxYMm = hasCoords ? maxY / 10.0 : 0;

  const widthMm = hasCoords ? (maxX - minX) / 10.0 : 0;
  const heightMm = hasCoords ? (maxY - minY) / 10.0 : 0;
  const widthIn = widthMm / 25.4;
  const heightIn = heightMm / 25.4;

  const threadBlocksCount = colorChanges + 1;
  const resolvedThreads: ThreadColor[] = [];
  for (let i = 0; i < threadBlocksCount; i++) {
    const candidate = threads[i];
    if (candidate && candidate.hex) {
      resolvedThreads.push(candidate);
    } else {
      resolvedThreads.push(getFallbackThread(i));
    }
  }

  // Group into thread blocks and contiguous stitch segments (in mm)
  const blocks: ThreadBlock[] = [];
  let currentBlockIndex = 0;
  let currentSegments: StitchSegment[] = [];
  let currentPoints: Point2D[] = [];
  let currentBlockStitches = 0;

  const flushSegment = () => {
    if (currentPoints.length > 0) {
      currentSegments.push({ points: currentPoints });
      currentPoints = [];
    }
  };

  const flushBlock = () => {
    flushSegment();
    blocks.push({
      index: currentBlockIndex,
      color: resolvedThreads[currentBlockIndex] ?? getFallbackThread(currentBlockIndex),
      stitchCount: currentBlockStitches,
      segments: currentSegments
    });
    currentBlockIndex += 1;
    currentSegments = [];
    currentBlockStitches = 0;
  };

  for (const s of stitches) {
    if (s.command === "STITCH") {
      currentPoints.push({ x: s.x / 10.0, y: s.y / 10.0 });
      currentBlockStitches += 1;
    } else if (s.command === "COLOR_CHANGE") {
      flushBlock();
    } else {
      // JUMP, TRIM, STOP, END break the contiguous stitched line segment
      flushSegment();
    }
  }
  flushBlock();

  return {
    format,
    filename,
    label,
    normalStitches,
    jumps,
    trims,
    colorChanges,
    stops,
    threadBlocks: threadBlocksCount,
    widthMm,
    heightMm,
    widthIn,
    heightIn,
    boundsMm: {
      minX: minXMm,
      minY: minYMm,
      maxX: maxXMm,
      maxY: maxYMm
    },
    threads: resolvedThreads,
    blocks,
    warnings,
    headerMetadata
  };
}
