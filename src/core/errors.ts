export class AppError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly causeData?: unknown;

  constructor(message: string, options?: { code?: string; status?: number; causeData?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = options?.code ?? "APP_ERROR";
    this.status = options?.status;
    this.causeData = options?.causeData;
  }
}

export function normalizeError(input: unknown, fallbackMessage = "Something went wrong"): AppError {
  if (input instanceof AppError) return input;
  if (input instanceof Error) {
    return new AppError(input.message || fallbackMessage, { causeData: input });
  }
  if (typeof input === "string" && input.trim()) {
    return new AppError(input.trim());
  }
  return new AppError(fallbackMessage, { causeData: input });
}

