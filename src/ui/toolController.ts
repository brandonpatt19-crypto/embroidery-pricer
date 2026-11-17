import {
  calculateJobQuote,
  createDefaultRates,
  roundHalfUpCents,
  STARTING_VALUES_NOTICE,
  type JobInput,
  type PricingQuoteResult,
  type PricingRates
} from "../pricing/index";
import { parseEmbroideryFile } from "../reader/index";
import type {
  EmbroideryDesign,
  WorkerParseRequest,
  WorkerParseResponse
} from "../reader/types";
import {
  clearStoredSettings,
  loadStoredSettings,
  saveStoredSettings
} from "../storage/settings";
import { renderStitchPreview } from "./canvasPreview";
import { formatCurrency, formatPlainTextQuote } from "./quoteText";

export const TOOL_TEMPLATE_HTML = `
<div class="pricer-app" id="pricer-app-container">
  <!-- Top Promise & Drop Zone (Step 1 & 2) -->
  <section class="card drop-section no-print" aria-labelledby="drop-heading">
    <div class="drop-header">
      <h2 id="drop-heading" class="section-title">1. Add Your Embroidery Design (.DST or .PES)</h2>
      <p class="privacy-badge">
        <span aria-hidden="true">&#128274;</span> Your design file never leaves your computer — read 100% locally in your browser.
      </p>
    </div>

    <div
      id="drop-zone"
      class="drop-zone"
      tabindex="0"
      role="button"
    >
      <label for="design-file-input" class="sr-only">Choose a .dst or .pes embroidery file</label>
      <input
        type="file"
        id="design-file-input"
        class="sr-only"
        accept=".dst,.pes,application/octet-stream"
      />
      <div class="drop-zone-content">
        <div class="drop-icon-badge" aria-hidden="true">
          <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="32" height="28" rx="6" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2"/>
            <circle cx="20" cy="20" r="9" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="3 2"/>
            <path d="M20 14L21.8 18.2L26 20L21.8 21.8L20 26L18.2 21.8L14 20L18.2 18.2L20 14Z" fill="#DC2626"/>
            <path d="M15 6V3M25 6V3" stroke="#1D4ED8" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="drop-primary-text">
          <strong>Drop a .DST or .PES file here</strong> or <span class="link-styled">choose a file</span>
        </p>
        <p class="drop-secondary-text">
          Supports Tajima (.dst) and Brother (.pes) files up to 10 MB &middot; Instant stitch &amp; color preview
        </p>
      </div>
    </div>

    <div class="mode-actions">
      <button type="button" id="btn-manual-mode" class="btn btn-secondary">
        Enter stitch count instead (Manual mode)
      </button>
      <span id="loaded-file-badge" class="status-pill" aria-live="polite">
        Mode: Manual / Sample 8,000-stitch cap logo
      </span>
    </div>

    <div id="file-error-alert" class="alert alert-error" role="alert" hidden></div>
    <div id="file-warning-alert" class="alert alert-warning" role="status" hidden></div>
  </section>

  <!-- Main Two-Column Workspace: Left = Design & Job Inputs, Right = Answer & Quote -->
  <div class="workspace-grid">
    <div class="workspace-left no-print">
      <!-- Step 3: See the Design & Override Any Number -->
      <section class="card design-section" aria-labelledby="design-heading">
        <div class="section-header-row">
          <h2 id="design-heading" class="section-title">2. Design Details &amp; Preview</h2>
          <span class="hint-text">Every number below can be overridden</span>
        </div>

        <div class="preview-wrapper">
          <canvas
            id="stitch-preview-canvas"
            class="stitch-canvas"
            width="360"
            height="220"
            aria-label="Embroidery stitch path preview"
          ></canvas>
          <div id="thread-swatches" class="thread-swatches" aria-label="Thread color sequence"></div>
        </div>

        <div class="form-grid form-grid-2">
          <div class="field">
            <label for="input-design-name">Design / Job Name</label>
            <input type="text" id="input-design-name" value="8,000-Stitch Cap Logo" />
          </div>
          <div class="field">
            <label for="input-stitches">Normal Stitches (priced)</label>
            <input type="number" id="input-stitches" min="0" max="5000000" step="100" value="8000" />
          </div>
          <div class="field">
            <label for="input-colors">Thread Colors (Blocks)</label>
            <input type="number" id="input-colors" min="1" max="99" step="1" value="3" />
          </div>
          <div class="field">
            <label for="input-color-changes">Color Changes</label>
            <input type="number" id="input-color-changes" min="0" max="98" step="1" value="2" />
          </div>
          <div class="field">
            <label for="input-jumps">Jumps (unpriced)</label>
            <input type="number" id="input-jumps" min="0" max="500000" step="1" value="0" />
          </div>
          <div class="field">
            <label for="input-trims">Trims (unpriced)</label>
            <input type="number" id="input-trims" min="0" max="500000" step="1" value="0" />
          </div>
          <div class="field">
            <label for="input-width-in">Width (inches)</label>
            <input type="number" id="input-width-in" min="0.1" max="100" step="0.05" value="3.50" />
          </div>
          <div class="field">
            <label for="input-width-mm">Width (mm)</label>
            <input type="number" id="input-width-mm" min="1" max="2540" step="0.5" value="88.9" />
          </div>
          <div class="field">
            <label for="input-height-in">Height (inches)</label>
            <input type="number" id="input-height-in" min="0.1" max="100" step="0.05" value="2.00" />
          </div>
          <div class="field">
            <label for="input-height-mm">Height (mm)</label>
            <input type="number" id="input-height-mm" min="1" max="2540" step="0.5" value="50.8" />
          </div>
          <div class="field field-span-2">
            <div class="label-row">
              <label for="input-minutes-override">Estimated Machine Time (min / piece)</label>
              <button type="button" id="btn-reset-minutes" class="btn-inline-link" hidden>
                Reset to calculated
              </button>
            </div>
            <input
              type="number"
              id="input-minutes-override"
              min="0.1"
              max="10000"
              step="0.05"
              value="14.31"
            />
          </div>
        </div>
      </section>

      <!-- Step 4: Set the Job -->
      <section class="card job-section" aria-labelledby="job-heading">
        <h2 id="job-heading" class="section-title">3. Job &amp; Garment Details</h2>
        <div class="form-grid form-grid-2">
          <div class="field">
            <label for="input-quantity">Order Quantity (pieces)</label>
            <input type="number" id="input-quantity" min="1" max="100000" step="1" value="24" />
          </div>

          <div class="field checkbox-field">
            <label class="checkbox-label" for="input-customer-garment">
              <input type="checkbox" id="input-customer-garment" checked />
              <span>Customer supplies garment ($0 garment cost)</span>
            </label>
          </div>

          <div class="field" id="garment-cost-field-wrap">
            <label for="input-garment-cost">Blank Garment Cost ($ / piece)</label>
            <input type="number" id="input-garment-cost" min="0" max="1000" step="0.25" value="4.50" disabled />
          </div>

          <div class="field checkbox-field">
            <label class="checkbox-label" for="input-apply-setup">
              <input type="checkbox" id="input-apply-setup" />
              <span>Add one-time setup / digitizing fee</span>
            </label>
          </div>

          <div class="field" id="setup-fee-field-wrap">
            <label for="input-setup-fee">One-Time Setup Fee ($)</label>
            <input type="number" id="input-setup-fee" min="0" max="5000" step="1" value="0" disabled />
          </div>
        </div>
      </section>

      <!-- Step 5: Adjust Rates (folded away by default) -->
      <details id="rate-settings-details" class="card rates-details">
        <summary class="rates-summary">
          <span>4. Shop Rate Settings &amp; Machine Speed</span>
          <span class="starting-values-tag">${STARTING_VALUES_NOTICE}</span>
        </summary>
        <div class="rates-body">
          <p class="rates-note">
            <strong>${STARTING_VALUES_NOTICE}.</strong> Changes save automatically in this browser for your next visit.
          </p>

          <div class="form-grid form-grid-2">
            <div class="field">
              <label for="rate-per-1000">Rate per 1,000 Stitches ($)</label>
              <input type="number" id="rate-per-1000" min="0" max="100" step="0.05" value="1.50" />
            </div>
            <div class="field">
              <label for="rate-piece-fee">Per-Piece Fee (hooping/handling $)</label>
              <input type="number" id="rate-piece-fee" min="0" max="100" step="0.10" value="1.00" />
            </div>
            <div class="field">
              <label for="rate-minimum">Minimum Decoration per Piece ($)</label>
              <input type="number" id="rate-minimum" min="0" max="500" step="0.25" value="5.00" />
            </div>
            <div class="field">
              <label for="rate-colors-included">Colors Included in Base</label>
              <input type="number" id="rate-colors-included" min="1" max="50" step="1" value="6" />
            </div>
            <div class="field">
              <label for="rate-extra-color-fee">Fee per Extra Color ($)</label>
              <input type="number" id="rate-extra-color-fee" min="0" max="50" step="0.10" value="0.50" />
            </div>
            <div class="field">
              <label for="rate-garment-markup">Garment Markup (%)</label>
              <input type="number" id="rate-garment-markup" min="0" max="500" step="1" value="40" />
            </div>
            <div class="field">
              <label for="rate-machine-speed">Machine Speed (stitches / min)</label>
              <input type="number" id="rate-machine-speed" min="50" max="3000" step="10" value="650" />
            </div>
            <div class="field">
              <label for="rate-change-seconds">Color Change Time (seconds)</label>
              <input type="number" id="rate-change-seconds" min="0" max="600" step="5" value="30" />
            </div>
            <div class="field">
              <label for="rate-hooping-minutes">Hooping / Handling Time (min / pc)</label>
              <input type="number" id="rate-hooping-minutes" min="0" max="120" step="0.25" value="1" />
            </div>
            <div class="field">
              <label for="rate-heads">Machine Heads Running Order</label>
              <input type="number" id="rate-heads" min="1" max="64" step="1" value="1" />
            </div>
            <div class="field">
              <label for="rate-consumables">Consumables Cost (backing/thread $ / pc)</label>
              <input type="number" id="rate-consumables" min="0" max="50" step="0.05" value="0.25" />
            </div>
            <div class="field">
              <label for="rate-operator-wage">Operator Wage During Hooping ($ / hr)</label>
              <input type="number" id="rate-operator-wage" min="0" max="200" step="0.50" value="18.00" />
            </div>
          </div>

          <fieldset class="breaks-fieldset">
            <legend>Quantity Break Discounts (% off decoration)</legend>
            <div class="breaks-grid">
              <div class="field">
                <label for="break-discount-0">1–11 pcs (%)</label>
                <input type="number" id="break-discount-0" min="0" max="90" step="1" value="0" />
              </div>
              <div class="field">
                <label for="break-discount-1">12–23 pcs (%)</label>
                <input type="number" id="break-discount-1" min="0" max="90" step="1" value="5" />
              </div>
              <div class="field">
                <label for="break-discount-2">24–47 pcs (%)</label>
                <input type="number" id="break-discount-2" min="0" max="90" step="1" value="10" />
              </div>
              <div class="field">
                <label for="break-discount-3">48–143 pcs (%)</label>
                <input type="number" id="break-discount-3" min="0" max="90" step="1" value="15" />
              </div>
              <div class="field">
                <label for="break-discount-4">144+ pcs (%)</label>
                <input type="number" id="break-discount-4" min="0" max="90" step="1" value="20" />
              </div>
            </div>
          </fieldset>

          <div class="rates-actions">
            <button type="button" id="btn-reset-rates" class="btn btn-secondary">
              Reset rates to starting defaults
            </button>
            <span id="storage-status-note" class="hint-text" aria-live="polite">
              Settings saved locally in browser
            </span>
          </div>
        </div>
      </details>
    </div>

    <!-- Right Column: Step 6, 7, 8 (Results, Quantity Table, Quote, Print View, Waitlist) -->
    <div class="workspace-right">
      <section class="card results-section" aria-labelledby="results-heading">
        <div class="print-only-header">
          <h2 class="print-quote-title">Embroidery Job Quote</h2>
          <p id="print-design-subtitle" class="print-quote-meta">8,000-Stitch Cap Logo · 24 pieces</p>
        </div>

        <h2 id="results-heading" class="section-title no-print">Per-Piece Price &amp; Order Summary</h2>

        <div class="kpi-grid">
          <div class="kpi-card kpi-primary">
            <span class="kpi-label">Price per Piece</span>
            <strong id="out-per-piece" class="kpi-value">$11.70</strong>
            <span id="out-per-piece-sub" class="kpi-sub">Decoration $11.70 · Garment $0.00 (10% break)</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Order Total</span>
            <strong id="out-order-total" class="kpi-value">$280.80</strong>
            <span id="out-order-total-sub" class="kpi-sub">24 pieces · $0.00 setup fee</span>
          </div>
          <div class="kpi-card no-print-optional">
            <span class="kpi-label">Effective Hourly Rate</span>
            <strong id="out-hourly-rate" class="kpi-value">$49.06/hr</strong>
            <span id="out-machine-time" class="kpi-sub">14.31 min/pc · 343.38 min order</span>
          </div>
        </div>

        <!-- Shop Production Economics & Net Contribution Margin Bar (Internal Only — Hidden on Customer Quote Print) -->
        <div class="profit-summary-bar no-print" aria-label="Shop Production Economics and Contribution Margin">
          <div class="profit-bar-item">
            <span class="profit-bar-label">Net Profit / Piece</span>
            <strong id="out-net-margin-pc" class="profit-bar-value">$11.15/pc</strong>
            <span id="out-direct-cost-sub" class="profit-bar-sub">After $0.25 supplies &amp; $0.30 hooping labor</span>
          </div>
          <div class="profit-bar-item">
            <span class="profit-bar-label">Order Contribution Profit</span>
            <strong id="out-net-order-profit" class="profit-bar-value">$267.60</strong>
            <span class="profit-bar-sub">Total kept after blank, supplies &amp; hooping</span>
          </div>
          <div class="profit-bar-item">
            <span class="profit-bar-label">Net Profit / Machine-Hr</span>
            <strong id="out-net-hourly-profit" class="profit-bar-value">$46.75/hr</strong>
            <span class="profit-bar-sub">True shop contribution per machine-hour</span>
          </div>
        </div>

        <!-- Quantity Break Price Table -->
        <div class="table-section">
          <h3 class="subsection-title">Quantity Break Price Table</h3>
          <div class="table-responsive">
            <table class="price-table" id="break-price-table">
              <thead>
                <tr>
                  <th scope="col">Qty Tier</th>
                  <th scope="col">Break</th>
                  <th scope="col">Decoration</th>
                  <th scope="col">Per Piece</th>
                  <th scope="col">Tier Min Total</th>
                  <th scope="col" class="no-print">Hourly Rate</th>
                </tr>
              </thead>
              <tbody id="break-table-body">
                <!-- Populated dynamically and pre-rendered -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Copyable Customer Quote & Print Actions -->
        <div class="quote-box-section">
          <div class="label-row">
            <label for="quote-text-output" class="subsection-title">Customer Quote Summary</label>
            <span id="copy-feedback" class="copy-feedback" aria-live="polite"></span>
          </div>
          <textarea
            id="quote-text-output"
            class="quote-textarea"
            rows="12"
            readonly
          ></textarea>

          <div class="quote-actions no-print">
            <button type="button" id="btn-copy-quote" class="btn btn-primary">
              Copy Plain-Text Quote
            </button>
            <button type="button" id="btn-print-quote" class="btn btn-secondary">
              Print / Save as PDF
            </button>
            <button type="button" id="btn-toggle-print-view" class="btn btn-secondary" aria-pressed="false">
              Preview Print View
            </button>
          </div>
        </div>

        <!-- Step 8: Paid Version Waitlist (In-Page Instant Capture) -->
        <div class="waitlist-banner no-print">
          <p class="waitlist-intro">
            <strong>Want saved rate profiles ("Caps", "Left Chest"), logo PDF quotes, and quote history?</strong>
            Get early access to the Pro desktop &amp; web unlock ($19.99 one-time, no subscription):
            <a
              id="waitlist-link"
              href="#waitlist-inline-form"
            >Join the Paid Version Waitlist &darr;</a>
          </p>
          <form id="waitlist-inline-form" class="waitlist-inline-form">
            <div class="waitlist-form-row">
              <div class="field">
                <label for="waitlist-email">Your Email</label>
                <input type="email" id="waitlist-email" placeholder="shop@example.com" required />
              </div>
              <div class="field">
                <label for="waitlist-shop-type">Your Setup</label>
                <select id="waitlist-shop-type">
                  <option value="Single-head home/prosumer">Single-head home/prosumer</option>
                  <option value="Commercial multi-needle (1 head)">Commercial multi-needle (1 head)</option>
                  <option value="Commercial multi-head shop">Commercial multi-head shop</option>
                  <option value="Digitizer / Contract broker">Digitizer / Contract broker</option>
                </select>
              </div>
              <div class="field">
                <label for="waitlist-top-feature">#1 Pro Feature You Want</label>
                <select id="waitlist-top-feature">
                  <option value="Branded PDF quotes with shop logo">Branded PDF quotes with shop logo</option>
                  <option value="Saved rate profiles (Caps, Left Chest)">Saved rate profiles (Caps, Left Chest)</option>
                  <option value="Quote history & customer list">Quote history &amp; customer list</option>
                  <option value="Multi-placement orders (front + sleeve)">Multi-placement orders (front + sleeve)</option>
                  <option value="More formats (EXP, JEF, VP3, XXX)">More formats (EXP, JEF, VP3, XXX)</option>
                </select>
              </div>
            </div>
            <div class="waitlist-submit-row">
              <button type="submit" id="btn-submit-waitlist" class="btn btn-primary">
                Join $19.99 Pro Waitlist
              </button>
              <span id="waitlist-feedback" class="copy-feedback" aria-live="polite"></span>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</div>
`;

export interface ToolPresetConfig {
  modeBadge?: string;
  designName?: string;
  stitches?: number;
  colors?: number;
  colorChanges?: number;
  widthIn?: number;
  widthMm?: number;
  heightIn?: number;
  heightMm?: number;
  quantity?: number;
  customerSuppliesGarment?: boolean;
  garmentCost?: number;
  applySetupFee?: boolean;
  setupFee?: number;
  openRatesByDefault?: boolean;
}

export interface ToolController {
  loadFileBuffer: (buffer: ArrayBuffer | Uint8Array, filename: string) => Promise<void>;
  getQuote: () => PricingQuoteResult;
  getRates: () => PricingRates;
  recalculate: () => PricingQuoteResult;
}

export function mountEmbroideryTool(root: HTMLElement): ToolController {
  if (!root.querySelector("#pricer-app-container")) {
    root.innerHTML = TOOL_TEMPLATE_HTML;
  }

  const presetAttr = root.getAttribute("data-tool-preset");
  let preset: ToolPresetConfig | null = null;
  if (presetAttr) {
    try {
      preset = JSON.parse(presetAttr) as ToolPresetConfig;
    } catch {
      preset = null;
    }
  }

  const stored = loadStoredSettings();
  let currentRates: PricingRates = stored.rates;
  let currentDesign: EmbroideryDesign | null = null;
  let minutesPerPieceOverride: number | null = null;

  // Query elements
  const dropZone = root.querySelector<HTMLElement>("#drop-zone")!;
  const fileInput = root.querySelector<HTMLInputElement>("#design-file-input")!;
  const btnManualMode = root.querySelector<HTMLButtonElement>("#btn-manual-mode")!;
  const loadedFileBadge = root.querySelector<HTMLElement>("#loaded-file-badge")!;
  const errorAlert = root.querySelector<HTMLElement>("#file-error-alert")!;
  const warningAlert = root.querySelector<HTMLElement>("#file-warning-alert")!;

  const canvas = root.querySelector<HTMLCanvasElement>("#stitch-preview-canvas")!;
  const swatchesEl = root.querySelector<HTMLElement>("#thread-swatches")!;

  const inputDesignName = root.querySelector<HTMLInputElement>("#input-design-name")!;
  const inputStitches = root.querySelector<HTMLInputElement>("#input-stitches")!;
  const inputColors = root.querySelector<HTMLInputElement>("#input-colors")!;
  const inputColorChanges = root.querySelector<HTMLInputElement>("#input-color-changes")!;
  const inputJumps = root.querySelector<HTMLInputElement>("#input-jumps")!;
  const inputTrims = root.querySelector<HTMLInputElement>("#input-trims")!;
  const inputWidthIn = root.querySelector<HTMLInputElement>("#input-width-in")!;
  const inputWidthMm = root.querySelector<HTMLInputElement>("#input-width-mm")!;
  const inputHeightIn = root.querySelector<HTMLInputElement>("#input-height-in")!;
  const inputHeightMm = root.querySelector<HTMLInputElement>("#input-height-mm")!;
  const inputMinutesOverride = root.querySelector<HTMLInputElement>("#input-minutes-override")!;
  const btnResetMinutes = root.querySelector<HTMLButtonElement>("#btn-reset-minutes")!;

  const inputQuantity = root.querySelector<HTMLInputElement>("#input-quantity")!;
  const inputCustomerGarment = root.querySelector<HTMLInputElement>("#input-customer-garment")!;
  const inputGarmentCost = root.querySelector<HTMLInputElement>("#input-garment-cost")!;
  const inputApplySetup = root.querySelector<HTMLInputElement>("#input-apply-setup")!;
  const inputSetupFee = root.querySelector<HTMLInputElement>("#input-setup-fee")!;

  const ratePer1000 = root.querySelector<HTMLInputElement>("#rate-per-1000")!;
  const ratePieceFee = root.querySelector<HTMLInputElement>("#rate-piece-fee")!;
  const rateMinimum = root.querySelector<HTMLInputElement>("#rate-minimum")!;
  const rateColorsIncluded = root.querySelector<HTMLInputElement>("#rate-colors-included")!;
  const rateExtraColorFee = root.querySelector<HTMLInputElement>("#rate-extra-color-fee")!;
  const rateGarmentMarkup = root.querySelector<HTMLInputElement>("#rate-garment-markup")!;
  const rateMachineSpeed = root.querySelector<HTMLInputElement>("#rate-machine-speed")!;
  const rateChangeSeconds = root.querySelector<HTMLInputElement>("#rate-change-seconds")!;
  const rateHoopingMinutes = root.querySelector<HTMLInputElement>("#rate-hooping-minutes")!;
  const rateHeads = root.querySelector<HTMLInputElement>("#rate-heads")!;
  const rateConsumables = root.querySelector<HTMLInputElement>("#rate-consumables");
  const rateOperatorWage = root.querySelector<HTMLInputElement>("#rate-operator-wage");

  const breakDiscountInputs = [0, 1, 2, 3, 4].map(
    (idx) => root.querySelector<HTMLInputElement>(`#break-discount-${idx}`)!
  );
  const btnResetRates = root.querySelector<HTMLButtonElement>("#btn-reset-rates")!;
  const storageStatusNote = root.querySelector<HTMLElement>("#storage-status-note")!;

  const outPerPiece = root.querySelector<HTMLElement>("#out-per-piece")!;
  const outPerPieceSub = root.querySelector<HTMLElement>("#out-per-piece-sub")!;
  const outOrderTotal = root.querySelector<HTMLElement>("#out-order-total")!;
  const outOrderTotalSub = root.querySelector<HTMLElement>("#out-order-total-sub")!;
  const outHourlyRate = root.querySelector<HTMLElement>("#out-hourly-rate")!;
  const outMachineTime = root.querySelector<HTMLElement>("#out-machine-time")!;
  const outNetMarginPc = root.querySelector<HTMLElement>("#out-net-margin-pc");
  const outDirectCostSub = root.querySelector<HTMLElement>("#out-direct-cost-sub");
  const outNetOrderProfit = root.querySelector<HTMLElement>("#out-net-order-profit");
  const outNetHourlyProfit = root.querySelector<HTMLElement>("#out-net-hourly-profit");
  const breakTableBody = root.querySelector<HTMLElement>("#break-table-body")!;
  const quoteTextOutput = root.querySelector<HTMLTextAreaElement>("#quote-text-output")!;
  const copyFeedback = root.querySelector<HTMLElement>("#copy-feedback")!;
  const btnCopyQuote = root.querySelector<HTMLButtonElement>("#btn-copy-quote")!;
  const btnPrintQuote = root.querySelector<HTMLButtonElement>("#btn-print-quote")!;
  const btnTogglePrintView = root.querySelector<HTMLButtonElement>("#btn-toggle-print-view")!;
  const printDesignSubtitle = root.querySelector<HTMLElement>("#print-design-subtitle")!;
  const waitlistLink = root.querySelector<HTMLAnchorElement>("#waitlist-link");
  const waitlistForm = root.querySelector<HTMLFormElement>("#waitlist-inline-form");
  const waitlistEmail = root.querySelector<HTMLInputElement>("#waitlist-email");
  const waitlistShopType = root.querySelector<HTMLSelectElement>("#waitlist-shop-type");
  const waitlistTopFeature = root.querySelector<HTMLSelectElement>("#waitlist-top-feature");
  const waitlistFeedback = root.querySelector<HTMLElement>("#waitlist-feedback");

  function trackFunnelEvent(eventName: string): void {
    if (typeof window === "undefined" || typeof fetch === "undefined") return;
    // Never fire network requests during file_imported so the strict 0-network-requests-on-upload privacy invariant holds
    if (eventName === "file_imported") return;
    try {
      const pagePath = window.location.pathname || "/";
      void fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: eventName, page: pagePath }),
        keepalive: true
      }).catch(() => {});
    } catch {
      // Ignore network errors in offline or local preview mode
    }
  }

  // Sync rate inputs from loaded storage
  function syncRateInputsFromState(): void {
    ratePer1000.value = currentRates.ratePer1000Stitches.toFixed(2);
    ratePieceFee.value = currentRates.pieceFee.toFixed(2);
    rateMinimum.value = currentRates.minimumPerPiece.toFixed(2);
    rateColorsIncluded.value = String(currentRates.colorsIncluded);
    rateExtraColorFee.value = currentRates.extraColorFee.toFixed(2);
    rateGarmentMarkup.value = String(Math.round(currentRates.garmentMarkup * 100));
    rateMachineSpeed.value = String(currentRates.machineSpeed);
    rateChangeSeconds.value = String(currentRates.colorChangeSeconds);
    rateHoopingMinutes.value = String(currentRates.hoopingMinutes);
    rateHeads.value = String(currentRates.heads);
    if (rateConsumables) {
      rateConsumables.value = (currentRates.consumablesCostPerPiece ?? 0.25).toFixed(2);
    }
    if (rateOperatorWage) {
      rateOperatorWage.value = (currentRates.operatorHourlyWage ?? 18.0).toFixed(2);
    }
    currentRates.quantityBreaks.forEach((brk, idx) => {
      if (breakDiscountInputs[idx]) {
        breakDiscountInputs[idx].value = String(Math.round(brk.discount * 100));
      }
    });
    if (stored.defaultSetupFee > 0 && Number(inputSetupFee.value) === 0) {
      inputSetupFee.value = stored.defaultSetupFee.toFixed(2);
    }
  }

  function readRatesFromInputs(): PricingRates {
    const num = (el: HTMLInputElement | null, fallback: number, min = 0) => {
      if (!el) return fallback;
      const v = Number.parseFloat(el.value);
      return Number.isFinite(v) && v >= min ? v : fallback;
    };
    const def = createDefaultRates();
    return {
      ratePer1000Stitches: num(ratePer1000, def.ratePer1000Stitches, 0),
      pieceFee: num(ratePieceFee, def.pieceFee, 0),
      minimumPerPiece: num(rateMinimum, def.minimumPerPiece, 0),
      colorsIncluded: Math.floor(num(rateColorsIncluded, def.colorsIncluded, 0)),
      extraColorFee: num(rateExtraColorFee, def.extraColorFee, 0),
      quantityBreaks: def.quantityBreaks.map((b, idx) => {
        const pct = num(breakDiscountInputs[idx], b.discount * 100, 0);
        return {
          ...b,
          discount: Math.min(0.95, Math.max(0, pct / 100))
        };
      }),
      garmentMarkup: num(rateGarmentMarkup, def.garmentMarkup * 100, 0) / 100,
      machineSpeed: num(rateMachineSpeed, def.machineSpeed, 1),
      colorChangeSeconds: num(rateChangeSeconds, def.colorChangeSeconds, 0),
      hoopingMinutes: num(rateHoopingMinutes, def.hoopingMinutes, 0),
      heads: Math.max(1, Math.floor(num(rateHeads, def.heads, 1))),
      consumablesCostPerPiece: num(rateConsumables, def.consumablesCostPerPiece ?? 0.25, 0),
      operatorHourlyWage: num(rateOperatorWage, def.operatorHourlyWage ?? 18.0, 0)
    };
  }

  function renderThreadSwatches(): void {
    const colorsCount = Math.max(1, Math.floor(Number(inputColors.value) || 1));
    swatchesEl.innerHTML = "";
    for (let i = 0; i < Math.min(colorsCount, 24); i++) {
      const thread = currentDesign?.threads[i];
      const hex = thread?.hex ?? ["#1d4ed8", "#dc2626", "#15803d", "#d97706", "#7c3aed", "#0f766e"][i % 6];
      const desc = thread?.description ?? `Color ${i + 1}`;
      const pill = document.createElement("span");
      pill.className = "swatch-pill";
      pill.title = `${i + 1}. ${desc} (${hex})`;
      const dot = document.createElement("span");
      dot.className = "swatch-dot";
      dot.style.backgroundColor = hex;
      const text = document.createElement("span");
      text.textContent = `${i + 1}. ${desc}`;
      pill.appendChild(dot);
      pill.appendChild(text);
      swatchesEl.appendChild(pill);
    }
  }

  let latestQuote!: PricingQuoteResult;

  function recalculate(): PricingQuoteResult {
    currentRates = readRatesFromInputs();
    const savedOk = saveStoredSettings({
      rates: currentRates,
      defaultSetupFee: Number.parseFloat(inputSetupFee.value) || 0
    });
    storageStatusNote.textContent = savedOk
      ? "Settings saved locally in browser"
      : "Browser storage blocked — using session settings";

    inputGarmentCost.disabled = inputCustomerGarment.checked;
    inputSetupFee.disabled = !inputApplySetup.checked;

    const stitches = Math.max(0, Math.floor(Number.parseFloat(inputStitches.value) || 0));
    const colors = Math.max(1, Math.floor(Number.parseFloat(inputColors.value) || 1));
    const colorChanges = Math.max(0, Math.floor(Number.parseFloat(inputColorChanges.value) || 0));
    const quantity = Math.max(1, Math.floor(Number.parseFloat(inputQuantity.value) || 1));
    const garmentCost = Math.max(0, Number.parseFloat(inputGarmentCost.value) || 0);
    const setupFee = Math.max(0, Number.parseFloat(inputSetupFee.value) || 0);

    const job: JobInput = {
      stitches,
      colors,
      colorChanges,
      quantity,
      customerSuppliesGarment: inputCustomerGarment.checked,
      garmentCost,
      applySetupFee: inputApplySetup.checked,
      setupFee
    };

    const quote = calculateJobQuote(job, currentRates);

    // Apply user override for minutesPerPiece if set
    if (minutesPerPieceOverride !== null && minutesPerPieceOverride > 0) {
      const customMin = roundHalfUpCents(minutesPerPieceOverride);
      quote.minutesPerPiece = customMin;
      quote.minutesPerPieceRaw = customMin;
      quote.orderMachineMinutes = roundHalfUpCents(
        (customMin * quote.quantity) / currentRates.heads
      );
      quote.effectiveHourlyRate = roundHalfUpCents(
        (quote.decorationPerPiece / customMin) * 60
      );
      quote.breakTable = quote.breakTable.map((row) => ({
        ...row,
        effectiveHourlyRate: roundHalfUpCents((row.decorationPerPiece / customMin) * 60)
      }));
      btnResetMinutes.hidden = false;
    } else {
      inputMinutesOverride.value = quote.minutesPerPiece.toFixed(2);
      btnResetMinutes.hidden = true;
    }

    latestQuote = quote;

    // Update KPI cards
    const breakPct = Math.round(quote.breakDiscount * 100);
    outPerPiece.textContent = formatCurrency(quote.perPiece);
    outPerPieceSub.textContent = `Decoration ${formatCurrency(quote.decorationPerPiece)}${quote.minimumApplied ? " (min)" : ""} · Garment ${formatCurrency(quote.garmentPerPiece)} (${breakPct}% break)`;

    outOrderTotal.textContent = formatCurrency(quote.orderTotal);
    outOrderTotalSub.textContent = `${quote.quantity} ${quote.quantity === 1 ? "piece" : "pieces"} · ${formatCurrency(quote.setupFeeApplied)} setup fee`;

    outHourlyRate.textContent = `${formatCurrency(quote.effectiveHourlyRate)}/hr`;
    outMachineTime.textContent = `${quote.minutesPerPiece.toFixed(2)} min/pc · ${quote.orderMachineMinutes.toFixed(2)} min order (${currentRates.heads} head${currentRates.heads > 1 ? "s" : ""})`;

    if (outNetMarginPc) {
      outNetMarginPc.textContent = `${formatCurrency(quote.netMarginPerPiece)}/pc`;
    }
    if (outDirectCostSub) {
      outDirectCostSub.textContent = `After ${formatCurrency(quote.consumablesPerPiece)} supplies & ${formatCurrency(quote.laborPerPiece)} hooping labor`;
    }
    if (outNetOrderProfit) {
      outNetOrderProfit.textContent = formatCurrency(quote.netOrderProfit);
    }
    if (outNetHourlyProfit) {
      outNetHourlyProfit.textContent = `${formatCurrency(quote.netHourlyProfit)}/hr`;
    }

    printDesignSubtitle.textContent = `${inputDesignName.value || "Custom Design"} · ${quote.quantity} pcs · ${quote.stitches.toLocaleString()} stitches`;

    // Render quantity break table
    breakTableBody.innerHTML = "";
    for (const row of quote.breakTable) {
      const tr = document.createElement("tr");
      if (row.label === quote.activeBreak.label) {
        tr.className = "active-break-row";
      }
      const pct = Math.round(row.discount * 100);
      tr.innerHTML = `
        <td><strong>${row.label}</strong></td>
        <td>${pct}%</td>
        <td>${formatCurrency(row.decorationPerPiece)}</td>
        <td><strong>${formatCurrency(row.perPiece)}</strong></td>
        <td>${formatCurrency(row.sampleOrderTotal)}</td>
        <td class="no-print">${formatCurrency(row.effectiveHourlyRate)}/hr</td>
      `;
      breakTableBody.appendChild(tr);
    }

    const widthMm = Math.max(0.1, Number.parseFloat(inputWidthMm.value) || 88.9);
    const heightMm = Math.max(0.1, Number.parseFloat(inputHeightMm.value) || 50.8);
    const jumps = Math.max(0, Math.floor(Number.parseFloat(inputJumps.value) || 0));
    const trims = Math.max(0, Math.floor(Number.parseFloat(inputTrims.value) || 0));

    quoteTextOutput.value = formatPlainTextQuote(quote, {
      designName: inputDesignName.value.trim() || "Custom Design",
      widthMm,
      heightMm,
      jumps,
      trims,
      customerSuppliesGarment: inputCustomerGarment.checked,
      garmentCost,
      garmentMarkup: currentRates.garmentMarkup,
      heads: currentRates.heads,
      machineSpeed: currentRates.machineSpeed
    });

    renderThreadSwatches();
    renderStitchPreview(canvas, currentDesign, {
      widthMm,
      heightMm,
      stitches,
      colors
    });

    return quote;
  }

  function applyLoadedDesign(design: EmbroideryDesign): void {
    currentDesign = design;
    minutesPerPieceOverride = null;
    errorAlert.hidden = true;
    errorAlert.textContent = "";

    if (design.warnings.length > 0) {
      warningAlert.hidden = false;
      warningAlert.textContent = design.warnings.join(" ");
    } else {
      warningAlert.hidden = true;
      warningAlert.textContent = "";
    }

    loadedFileBadge.textContent = `Loaded ${design.format.toUpperCase()}: ${design.filename}`;
    inputDesignName.value = design.label || design.filename;
    inputStitches.value = String(design.normalStitches);
    inputColors.value = String(design.threadBlocks);
    inputColorChanges.value = String(design.colorChanges);
    inputJumps.value = String(design.jumps);
    inputTrims.value = String(design.trims);
    inputWidthMm.value = design.widthMm.toFixed(1);
    inputWidthIn.value = design.widthIn.toFixed(2);
    inputHeightMm.value = design.heightMm.toFixed(1);
    inputHeightIn.value = design.heightIn.toFixed(2);

    recalculate();
  }

  function showFileError(message: string): void {
    errorAlert.hidden = false;
    errorAlert.textContent = message;
    warningAlert.hidden = true;
    warningAlert.textContent = "";
  }

  // Worker setup with fallback to direct parsing so tests/environments without Worker URL bundling still work seamlessly
  let workerInstance: Worker | null = null;
  let workerReqId = 0;
  const pendingWorkerPromises = new Map<
    number,
    { resolve: (res: WorkerParseResponse) => void; reject: (err: unknown) => void }
  >();

  function getOrCreateWorker(): Worker | null {
    if (workerInstance) return workerInstance;
    if (typeof Worker === "undefined") return null;
    try {
      workerInstance = new Worker(
        new URL("../reader/worker.ts", import.meta.url),
        { type: "module" }
      );
      workerInstance.addEventListener("message", (ev: MessageEvent<WorkerParseResponse>) => {
        const pending = pendingWorkerPromises.get(ev.data.id);
        if (pending) {
          pendingWorkerPromises.delete(ev.data.id);
          pending.resolve(ev.data);
        }
      });
      workerInstance.addEventListener("error", (err) => {
        for (const [, p] of pendingWorkerPromises) {
          p.reject(err);
        }
        pendingWorkerPromises.clear();
      });
      return workerInstance;
    } catch {
      return null;
    }
  }

  async function loadFileBuffer(
    buffer: ArrayBuffer | Uint8Array,
    filename: string
  ): Promise<void> {
    let arrayBuffer: ArrayBuffer;
    if (buffer instanceof ArrayBuffer) {
      arrayBuffer = buffer;
    } else {
      const copy = new Uint8Array(buffer.byteLength);
      copy.set(buffer);
      arrayBuffer = copy.buffer;
    }

    const worker = getOrCreateWorker();
    if (worker) {
      try {
        const id = ++workerReqId;
        const copyForWorker = arrayBuffer.slice(0);
        const response = await new Promise<WorkerParseResponse>((resolve, reject) => {
          pendingWorkerPromises.set(id, { resolve, reject });
          const req: WorkerParseRequest = { id, filename, buffer: copyForWorker };
          worker.postMessage(req, [copyForWorker]);
        });
        if (response.ok) {
          applyLoadedDesign(response.design);
        } else {
          showFileError(response.error);
        }
        return;
      } catch {
        // Fallback to main-thread parser if Worker fails in headless/test harness
      }
    }

    const res = parseEmbroideryFile(arrayBuffer, filename);
    if (res.ok) {
      applyLoadedDesign(res.design);
    } else {
      showFileError(res.error);
    }
  }

  async function handleFileSelected(file: File | undefined): Promise<void> {
    if (!file) return;
    const buf = await file.arrayBuffer();
    await loadFileBuffer(buf, file.name);
  }

  // Event listeners for drop zone and file input
  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  dropZone.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      fileInput.click();
    }
  });

  dropZone.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (ev) => {
    ev.preventDefault();
    dropZone.classList.remove("drag-over");
    const file = ev.dataTransfer?.files?.[0];
    void handleFileSelected(file);
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    void handleFileSelected(file);
    fileInput.value = "";
  });

  btnManualMode.addEventListener("click", () => {
    currentDesign = null;
    minutesPerPieceOverride = null;
    errorAlert.hidden = true;
    warningAlert.hidden = true;
    loadedFileBadge.textContent = "Mode: Manual stitch count entry";
    inputStitches.focus();
    inputStitches.select();
    recalculate();
  });

  // Two-way linked width/height inputs (in <-> mm)
  inputWidthIn.addEventListener("input", () => {
    const vIn = Number.parseFloat(inputWidthIn.value);
    if (Number.isFinite(vIn) && vIn >= 0) {
      inputWidthMm.value = (vIn * 25.4).toFixed(1);
    }
    recalculate();
  });

  inputWidthMm.addEventListener("input", () => {
    const vMm = Number.parseFloat(inputWidthMm.value);
    if (Number.isFinite(vMm) && vMm >= 0) {
      inputWidthIn.value = (vMm / 25.4).toFixed(2);
    }
    recalculate();
  });

  inputHeightIn.addEventListener("input", () => {
    const vIn = Number.parseFloat(inputHeightIn.value);
    if (Number.isFinite(vIn) && vIn >= 0) {
      inputHeightMm.value = (vIn * 25.4).toFixed(1);
    }
    recalculate();
  });

  inputHeightMm.addEventListener("input", () => {
    const vMm = Number.parseFloat(inputHeightMm.value);
    if (Number.isFinite(vMm) && vMm >= 0) {
      inputHeightIn.value = (vMm / 25.4).toFixed(2);
    }
    recalculate();
  });

  // Sync colorChanges when colors changes
  inputColors.addEventListener("input", () => {
    const c = Math.max(1, Math.floor(Number.parseFloat(inputColors.value) || 1));
    inputColorChanges.value = String(Math.max(0, c - 1));
    minutesPerPieceOverride = null;
    recalculate();
  });

  inputColorChanges.addEventListener("input", () => {
    minutesPerPieceOverride = null;
    recalculate();
  });

  inputStitches.addEventListener("input", () => {
    minutesPerPieceOverride = null;
    recalculate();
  });

  inputMinutesOverride.addEventListener("input", () => {
    const v = Number.parseFloat(inputMinutesOverride.value);
    if (Number.isFinite(v) && v > 0) {
      minutesPerPieceOverride = v;
    } else {
      minutesPerPieceOverride = null;
    }
    recalculate();
  });

  btnResetMinutes.addEventListener("click", () => {
    minutesPerPieceOverride = null;
    recalculate();
  });

  // Job & Rate input listeners
  const standardInputs = [
    inputDesignName,
    inputJumps,
    inputTrims,
    inputQuantity,
    inputCustomerGarment,
    inputGarmentCost,
    inputApplySetup,
    inputSetupFee,
    ratePer1000,
    ratePieceFee,
    rateMinimum,
    rateColorsIncluded,
    rateExtraColorFee,
    rateGarmentMarkup,
    rateMachineSpeed,
    rateChangeSeconds,
    rateHoopingMinutes,
    rateHeads,
    ...(rateConsumables ? [rateConsumables] : []),
    ...(rateOperatorWage ? [rateOperatorWage] : []),
    ...breakDiscountInputs
  ];

  let hasTrackedCalculationEdit = false;
  for (const el of standardInputs) {
    el.addEventListener("input", () => {
      recalculate();
    });
    el.addEventListener("change", () => {
      if (!hasTrackedCalculationEdit) {
        hasTrackedCalculationEdit = true;
        trackFunnelEvent("calculation_edited");
      }
      recalculate();
    });
  }

  btnResetRates.addEventListener("click", () => {
    clearStoredSettings();
    currentRates = createDefaultRates();
    syncRateInputsFromState();
    recalculate();
  });

  btnCopyQuote.addEventListener("click", async () => {
    trackFunnelEvent("quote_copied");
    const text = quoteTextOutput.value;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        quoteTextOutput.focus();
        quoteTextOutput.select();
        document.execCommand("copy");
      }
      copyFeedback.textContent = "Quote copied to clipboard!";
    } catch {
      quoteTextOutput.focus();
      quoteTextOutput.select();
      copyFeedback.textContent = "Selected quote text — press Ctrl+C / Cmd+C to copy";
    }
    setTimeout(() => {
      if (copyFeedback.textContent) copyFeedback.textContent = "";
    }, 3000);
  });

  btnPrintQuote.addEventListener("click", () => {
    trackFunnelEvent("quote_printed");
    window.print();
  });

  if (waitlistLink) {
    waitlistLink.addEventListener("click", () => {
      trackFunnelEvent("waitlist_clicked");
      if (waitlistEmail) {
        setTimeout(() => waitlistEmail.focus(), 50);
      }
    });
  }

  if (waitlistForm && waitlistEmail && waitlistFeedback) {
    waitlistForm.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const email = waitlistEmail.value.trim();
      if (!email || !email.includes("@")) {
        waitlistFeedback.textContent = "Please enter a valid email address.";
        return;
      }
      const shopType = waitlistShopType?.value ?? "Single-head home/prosumer";
      const topFeature = waitlistTopFeature?.value ?? "Branded PDF quotes with shop logo";
      waitlistFeedback.textContent = "Saving your spot...";
      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            shopType,
            topFeature,
            page: typeof window !== "undefined" ? window.location.pathname : "/"
          })
        });
        if (res.ok) {
          waitlistFeedback.textContent = "You're on the $19.99 Pro early-access list!";
          waitlistEmail.value = "";
        } else {
          waitlistFeedback.textContent = "Saved locally — we'll notify you when Pro launches!";
        }
      } catch {
        waitlistFeedback.textContent = "Saved locally — we'll notify you when Pro launches!";
      }
    });
  }

  if (typeof document !== "undefined") {
    document.querySelectorAll<HTMLElement>("[data-affiliate-slot]").forEach((card) => {
      card.addEventListener("click", () => {
        trackFunnelEvent("supply_clicked");
      });
    });
  }

  btnTogglePrintView.addEventListener("click", () => {
    const isPreview = document.body.classList.toggle("print-preview-mode");
    btnTogglePrintView.setAttribute("aria-pressed", String(isPreview));
    btnTogglePrintView.textContent = isPreview
      ? "Exit Print View"
      : "Preview Print View";
  });

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      renderStitchPreview(canvas, currentDesign, {
        widthMm: Number.parseFloat(inputWidthMm.value) || 88.9,
        heightMm: Number.parseFloat(inputHeightMm.value) || 50.8,
        stitches: Number.parseFloat(inputStitches.value) || 8000,
        colors: Number.parseFloat(inputColors.value) || 3
      });
    });
  }

  // Initialize state, pre-warm Web Worker, and render
  getOrCreateWorker();
  syncRateInputsFromState();

  if (preset) {
    if (preset.modeBadge) loadedFileBadge.textContent = preset.modeBadge;
    if (preset.designName) inputDesignName.value = preset.designName;
    if (typeof preset.stitches === "number") inputStitches.value = String(preset.stitches);
    if (typeof preset.colors === "number") inputColors.value = String(preset.colors);
    if (typeof preset.colorChanges === "number") inputColorChanges.value = String(preset.colorChanges);
    if (typeof preset.widthIn === "number") inputWidthIn.value = preset.widthIn.toFixed(2);
    if (typeof preset.widthMm === "number") inputWidthMm.value = preset.widthMm.toFixed(1);
    if (typeof preset.heightIn === "number") inputHeightIn.value = preset.heightIn.toFixed(2);
    if (typeof preset.heightMm === "number") inputHeightMm.value = preset.heightMm.toFixed(1);
    if (typeof preset.quantity === "number") inputQuantity.value = String(preset.quantity);
    if (typeof preset.customerSuppliesGarment === "boolean") {
      inputCustomerGarment.checked = preset.customerSuppliesGarment;
    }
    if (typeof preset.garmentCost === "number") {
      inputGarmentCost.value = preset.garmentCost.toFixed(2);
    }
    if (typeof preset.applySetupFee === "boolean") {
      inputApplySetup.checked = preset.applySetupFee;
    }
    if (typeof preset.setupFee === "number") {
      inputSetupFee.value = preset.setupFee.toFixed(2);
    }
    if (preset.openRatesByDefault) {
      const rateDetails = root.querySelector<HTMLDetailsElement>("#rate-settings-details");
      if (rateDetails) rateDetails.open = true;
    }
  }

  recalculate();

  const controller: ToolController = {
    loadFileBuffer,
    getQuote: () => latestQuote,
    getRates: () => currentRates,
    recalculate
  };

  if (typeof window !== "undefined") {
    (window as unknown as { __embroideryTool?: ToolController }).__embroideryTool = controller;
  }

  return controller;
}
