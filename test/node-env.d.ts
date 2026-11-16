declare module "node:fs" {
  export function readFileSync(path: string): Buffer;
  export function readFileSync(path: string, encoding: BufferEncoding): string;
}

declare module "node:path" {
  export function join(...paths: string[]): string;
}

type BufferEncoding = "utf-8" | "utf8";
interface Buffer extends Uint8Array {}

declare const process: {
  cwd(): string;
};
