# Embroidery File Formats Specification (DST & PES)

This document records the technical format specifications, open-source reader implementations, and licenses used to build the browser-based DST and PES file reader in Stage 1 of `SPEC.md`. All format details below come directly from the cited documentation and open-source reader source code inspected on `2026-11-15`.

---

## 1. Cited Sources and Licenses

### Format Documentation
1. **EduTech Wiki (University of Geneva) — Embroidery format DST**
   - URL: https://edutechwiki.unige.ch/en/Embroidery_format_DST (raw source: `https://edutechwiki.unige.ch/en/Embroidery_format_DST?action=raw`)
   - Accessed: `2026-11-15`
2. **EduTech Wiki (University of Geneva) — Embroidery format PES**
   - URL: https://edutechwiki.unige.ch/en/Embroidery_format_PES (raw source: `https://edutechwiki.unige.ch/en/Embroidery_format_PES?action=raw`)
   - Accessed: `2026-11-15`
3. **EduTech Wiki (University of Geneva) — Embroidery format PEC**
   - URL: https://edutechwiki.unige.ch/en/Embroidery_format_PEC (raw source: `https://edutechwiki.unige.ch/en/Embroidery_format_PEC?action=raw`)
   - Accessed: `2026-11-15`

### Open-Source Readers
1. **`EmbroidePy/pyembroidery` (Python)**
   - Repository URL: https://github.com/EmbroidePy/pyembroidery
   - Inspected Version: `1.5.1` (repository last pushed `2024-05-24T14:57:11Z`)
   - Inspected Files: `DstReader.py`, `PesReader.py`, `PecReader.py`, `EmbThreadPec.py`, `EmbPattern.py`, `EmbConstant.py`
   - License: **MIT License** (`https://raw.githubusercontent.com/EmbroidePy/pyembroidery/master/LICENSE`) — permits use, copying, modification, porting, and redistribution provided the copyright and permission notice are preserved (recorded in `THIRD_PARTY_NOTICES.md`).
2. **`Embroidermodder/libembroidery` and `Embroidermodder/Embroidermodder` (C / C++)**
   - Repository URLs: https://github.com/Embroidermodder/libembroidery (last pushed `2026-11-12T05:31:53Z`) and https://github.com/Embroidermodder/Embroidermodder (last pushed `2026-10-07T02:09:23Z`)
   - License: **Zlib License** — permissive open-source license permitting commercial and non-commercial use, modification, and test fixture distribution.
3. **`broideryfab/embroidery-ksy` (Kaitai Struct Format Specifications & Test Samples)**
   - Repository URL: https://github.com/broideryfab/embroidery-ksy
   - License: **MIT License** (`https://raw.githubusercontent.com/broideryfab/embroidery-ksy/master/LICENSE`) — provides Kaitai Struct binary format descriptions and multi-version test samples for Tajima DST (`formats/tajima_dst`) and Brother PES (`formats/brother_pes`).

---

## 2. Tajima DST Format (`.dst`)

Sources: [EduTech Wiki — Embroidery format DST](https://edutechwiki.unige.ch/en/Embroidery_format_DST) and `pyembroidery/DstReader.py` + `pyembroidery/EmbPattern.py`.

### Overview
- DST (Data Stitch Tajima) files consist of a fixed **512-byte header** followed by a **body of 3-byte stitch commands**.
- Native coordinate units in DST are **0.1 mm** (`1/10 mm`), so `10` DST units equal `1.0 mm` (and `254` DST units equal `1.0 inch`).
- Standard DST files do not store thread colors (unless optional, rare `TC:` header lines are present).
- Standard file size satisfies `(file_size - 512) % 3 == 0`, except Wilcom-exported DST files which may append a trailing `0x1A` byte at EOF (`(file_size - 512) % 3 == 1`).

### Header (Bytes `0`–`511`)
- Always `512` bytes total; the standard fields occupy the first `125` bytes (padded with spaces `0x20` to `512` bytes).
- Entries are ASCII `PREFIX:VALUE` pairs separated by carriage returns (`0x0D` / `\r`) or newlines (`0x0A` / `\n`):
  - `LA`: Label / design name (16 chars padded with `0x20`).
  - `ST`: Total stitch record count stored in header (7 digits, zero/space padded). Note per EduTech Wiki: header `ST` counts total 3-byte records (including color changes, jumps, and special records), and cannot be trusted alone for pricing stitch count.
  - `CO`: Number of color changes stored in header (3 digits).
  - `+X`, `-X`, `+Y`, `-Y`: Positive and negative X/Y extents in `0.1 mm` units (note: EduTech Wiki's table text says "centimeters" in one column and `0.1 mm` in `AX`/`AY`, while actual DST files and `pyembroidery` store coordinates in `0.1 mm`).
  - `AX`, `AY`, `MX`, `MY`, `PD`: Relative end coordinates and legacy multi-volume tape fields.
  - Optional rare extended tags (`DstReader.py` lines 35–46): `AU` (Author), `CP` (Copyright), `TC` (Thread Color formatted as `#RRGGBB,Description,Catalog Number`).
- **Header Verification Requirement (`SPEC.md`):** Never trust counts stored in the header alone. Compute normal stitches, jumps, trims, color changes, and bounding box directly from the stitch records, and emit a warning if the header `CO` (or `ST`) disagrees with the records.

### Body: 3-Byte Balanced Ternary Stitch Records (Offset `512` to EOF)
Each command is 3 bytes (`b0`, `b1`, `b2`). Per `DstReader.py` (lines 5–33) and EduTech Wiki:

```text
getbit(b, pos) = (b >> pos) & 1

dx = +81 * getbit(b2, 2) - 81 * getbit(b2, 3)
   + 27 * getbit(b1, 2) - 27 * getbit(b1, 3)
   +  9 * getbit(b0, 2) -  9 * getbit(b0, 3)
   +  3 * getbit(b1, 0) -  3 * getbit(b1, 1)
   +  1 * getbit(b0, 0) -  1 * getbit(b0, 1)

y_raw = +81 * getbit(b2, 5) - 81 * getbit(b2, 4)
      + 27 * getbit(b1, 5) - 27 * getbit(b1, 4)
      +  9 * getbit(b0, 5) -  9 * getbit(b0, 4)
      +  3 * getbit(b1, 7) -  3 * getbit(b1, 6)
      +  1 * getbit(b0, 7) -  1 * getbit(b0, 6)
dy = -y_raw   (in screen/embroidery coordinates where +Y is downward in pyembroidery)
```

### Control Codes in Byte 2 (`b2`)
Per `DstReader.py` (lines 75–89):
- `b2 & 0b11110011 == 0b11110011` (`0xF3`): **END** — terminates stitch reading.
- `b2 & 0b11000011 == 0b11000011` (`0xC3`): **COLOR_CHANGE** (`dx, dy`).
- `b2 & 0b01000011 == 0b01000011` (`0x43`): **SEQUIN_MODE** (`dx, dy`) — toggles `sequin_mode`.
- `b2 & 0b10000011 == 0b10000011` (`0x83`): If `sequin_mode` is active, **SEQUIN_EJECT** (`dx, dy`); otherwise **JUMP** (`move(dx, dy)`).
- Otherwise (`c0 = 0, c1 = 0`): **NORMAL STITCH** (`stitch(dx, dy)`).

### Trim Interpolation in DST
Because DST has no dedicated trim bit in the 3-byte record, machines and digitizers trigger a trim via consecutive jump records (`count_max = 3` jumps by default in `DstReader.py` line 91 and `EmbPattern.interpolate_trims` lines 664–723):
- Maintain state `trimmed = True` initially (and reset `trimmed = True` on `COLOR_CHANGE`, `NEEDLE_SET`, or `TRIM`; set `trimmed = False` on `STITCH` or `SEQUIN_EJECT`).
- When a sequence of `JUMP` commands begins after a stitch (`not trimmed`), count consecutive jumps (`jump_count`) and accumulate displacement (`jump_dx`, `jump_dy`).
- When `jump_count == 3` (and `not trimmed`), insert a `TRIM` command at `jump_start` and mark `trimmed = True`.
- If `clipping == True` and the cumulative displacement at any point in the jump sequence reaches `jump_dx == 0` and `jump_dy == 0` (used by digitizers that emit fake zero-sum jumps like `+2,+2 / -4,-4 / +2,+2` solely to trigger a trim), remove the zero-displacement jump commands (`del stitches[jump_start : i + 1]`) while keeping the inserted `TRIM`.

---

## 3. Brother PES & PEC Format (`.pes`)

Sources: [EduTech Wiki — Embroidery format PES](https://edutechwiki.unige.ch/en/Embroidery_format_PES), [EduTech Wiki — Embroidery format PEC](https://edutechwiki.unige.ch/en/Embroidery_format_PEC), and `pyembroidery/PesReader.py` + `PecReader.py` + `EmbThreadPec.py` + `EmbPattern.py`.

### Overview & Version-Independent PEC Section
- A `.pes` file contains two distinct parts:
  1. **PES Header / Section:** High-level design objects for Brother PE-Design software. Its layout varies across versions (`#PES0001`, `#PES0020`, `#PES0022`, `#PES0030`, `#PES0040`, `#PES0050`, `#PES0055`, `#PES0056`, `#PES0060`, `#PES0070`, `#PES0080`, `#PES0090`, `#PES0100`).
  2. **PEC Section:** Low-level machine embroidery data (design label, palette indices, stitch commands, and thumbnails) shared across **all** PES versions so hardware machines remain backward-compatible.
- A standalone PEC file starts directly with the 8-byte ASCII magic `#PEC0001`.
- A PES file starts with an 8-byte ASCII magic `#PESxxxx` (bytes `0`–`7`), immediately followed at offset `8` (`uint32le`, 4 bytes) by **`pec_block_position`** — the exact byte offset of the PEC section within the file (`PesReader.py` lines 14–21).

### Reading Thread Colors from PES v5–v10 Headers (When Present)
Per `PesReader.py` (lines 96–254), PES versions 5 through 10 optionally store custom RGB thread objects in the PES header prior to the PEC block (unless programmable fills, motifs, or feather patterns are non-zero, in which case `PesReader.py` aborts header parsing and falls back to the PEC color table):
- After `#PESxxxx` (8 bytes) and `pec_block_position` (4 bytes), skip 4 bytes and read 5 length-prefixed strings (`name`, `category`, `author`, `keywords`, `comments`), where each string is prefixed by a 1-byte length (`uint8`).
- Version-specific skips before `count_programmable_fills` (`uint16le`), `count_motifs` (`uint16le`), `count_feather_patterns` (`uint16le`), and `count_threads` (`uint16le`):
  - **v5 / v5.5 / v5.6:** skip `24` bytes, read length-prefixed `image` string, skip `24` bytes.
  - **v6 / v7:** skip `36` bytes, read length-prefixed `image_file` string, skip `24` bytes.
  - **v8:** skip `38` bytes, read length-prefixed `image_file` string, skip `26` bytes.
  - **v9:** skip `14` bytes, read length-prefixed `hoop_name` string, skip `30` bytes, read length-prefixed `image_file` string, skip `34` bytes.
  - **v10 (`#PES0100`):** skip `14` bytes, read length-prefixed `hoop_name` string, skip `38` bytes, read length-prefixed `image_file` string, skip `34` bytes.
- If `count_programmable_fills == 0`, `count_motifs == 0`, and `count_feather_patterns == 0`, read `count_threads` thread records, each consisting of:
  - `catalog_number` (length-prefixed string)
  - `color` (3-byte big-endian RGB integer: `(r << 16) | (g << 8) | b`)
  - skip `5` bytes
  - `description` (length-prefixed string)
  - `brand` (length-prefixed string)
  - `chart` (length-prefixed string)

### PEC Block Structure (Common to All PES Versions)
Seeking to `pec_block_position` (`PecReader.py` lines 16–37 and EduTech Wiki PEC):
1. **Label (`+0` to `+19`):** Skip `3` bytes (`"LA:"`), read `16`-byte ASCII label.
2. **Header fields (`+19` to `+48`):**
   - Skip `15` (`0x0F`) bytes.
   - Read `pec_graphic_byte_stride` (`uint8`, offset `+34`).
   - Read `pec_graphic_icon_height` (`uint8`, offset `+35`).
   - Skip `12` (`0x0C`) bytes (to offset `+48`).
3. **Color Table (`+48`):**
   - Read `color_changes` (`uint8`, offset `+48`). Note: PEC stores `count_colors - 1` (`count_colors = color_changes + 1`).
   - Read `count_colors` bytes of 1-byte PEC palette indices (`color_bytes`), each mapped modulo `65` into the 65-entry Brother PEC palette (`EmbThreadPec.py` lines 4–71) or matched with the PES header thread list (`map_pec_colors` in `PecReader.py` lines 83–95).
4. **Seek to Second PEC Header & Stitch Block (`+512` from `pec_block_position`):**
   - From after `color_bytes`, advance `0x1D0 - color_changes` bytes (`464 - color_changes` bytes, reaching `pec_block_position + 512`).
   - At `pec_block_position + 512`, read 3-byte little-endian `stitch_block_end` offset (`uint24le`), then skip `11` (`0x0B`) bytes (`\x31\xff\xf0` plus four 16-bit shorts including header width and height) to reach the start of the PEC stitch list at `pec_block_position + 532` (`0x214`).

### PEC Stitch List Decoding (`PecReader.py` lines 98–157)
Coordinates are relative `(dx, dy)` pairs in `0.1 mm` units:
- Read `val1` (`uint8`) and `val2` (`uint8`).
- **End of stitches:** If `val1 == 0xFF` and `val2 == 0x00` (or EOF), stop reading stitches.
- **Color change:** If `val1 == 0xFE` and `val2 == 0xB0`, skip `1` byte (the alternating `1`/`2` byte) and emit `COLOR_CHANGE(0, 0)`.
- **Decoding X (`val1`, and possibly `val2`):**
  - If `val1 & 0x80 != 0` (**Long Form**, 2 bytes):
    - If `val1 & 0x20 != 0`, set `trim = True`.
    - If `val1 & 0x10 != 0`, set `jump = True`.
    - `code = (val1 << 8) | val2`
    - `x = signed12(code)` (12-bit two's complement: `b &= 0xFFF; return b - 0x1000 if b > 0x7FF else b`)
    - Read next byte into `val2` (the start of Y).
  - Else (**Short Form**, 1 byte):
    - `x = signed7(val1)` (7-bit two's complement: `return b - 128 if b > 63 else b`).
- **Decoding Y (`val2`, and possibly `val3`):**
  - If `val2 & 0x80 != 0` (**Long Form**, 2 bytes):
    - If `val2 & 0x20 != 0`, set `trim = True`.
    - If `val2 & 0x10 != 0`, set `jump = True`.
    - Read `val3` (`uint8`).
    - `code = (val2 << 8) | val3`
    - `y = signed12(code)`
  - Else (**Short Form**, 1 byte):
    - `y = signed7(val2)`
- **Command emission (`PecReader.py` lines 150–156):**
  - If `jump` is true (`0x10` bit set on either X or Y): emit `JUMP(x, y)` (`out.move(x, y)`). Note: if both `jump` (`0x10`) and `trim` (`0x20`) bits are set, `PecReader.py` checks `if jump:` first; if only `trim` (`0x20`) is set (`elif trim:`), it emits `TRIM` followed by `JUMP(x, y)` (`out.trim(); out.move(x, y)`).
  - Otherwise: emit `STITCH(x, y)`.
- **Duplicate Color as Stop (`PesReader.py` line 68 & `EmbPattern.py` lines 577–603):**
  - After reading PEC stitches, `interpolate_duplicate_color_as_stop()` checks whether consecutive stitched color blocks reference an identical thread in `threadlist`; if so, it converts that `COLOR_CHANGE` into a `STOP` command and removes the duplicate thread entry.
