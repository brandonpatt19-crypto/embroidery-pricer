import { parseEmbroideryFile } from "./index";
import type { WorkerParseRequest, WorkerParseResponse } from "./types";

/**
 * Pure message handler that can be invoked both inside the Web Worker and in tests.
 */
export function handleWorkerMessage(req: WorkerParseRequest): WorkerParseResponse {
  const result = parseEmbroideryFile(req.buffer, req.filename);
  if (result.ok) {
    return {
      id: req.id,
      ok: true,
      design: result.design
    };
  }
  return {
    id: req.id,
    ok: false,
    error: result.error
  };
}

// Attach to Web Worker global scope when running inside a browser Worker
if (typeof self !== "undefined" && typeof (self as unknown as Worker).postMessage === "function") {
  self.addEventListener("message", (event: MessageEvent<WorkerParseRequest>) => {
    const response = handleWorkerMessage(event.data);
    self.postMessage(response);
  });
}
