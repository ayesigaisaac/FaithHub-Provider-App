import { AppError } from "@/core/errors";
import { getAppEnv } from "@/config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HttpRequestOptions = {
  method?: HttpMethod;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = getAppEnv().apiBaseUrl.replace(/\/+$/, "");
  const next = path.startsWith("/") ? path : `/${path}`;
  return `${base}${next}`;
}

export async function httpRequest<TResponse>(options: HttpRequestOptions): Promise<TResponse> {
  const response = await fetch(toAbsoluteUrl(options.path), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  const text = await response.text();
  const payload = text ? safeJsonParse(text) : undefined;

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload && String((payload as { message: unknown }).message)) ||
      `HTTP ${response.status}`;
    throw new AppError(message, {
      code: "HTTP_REQUEST_FAILED",
      status: response.status,
      causeData: payload,
    });
  }

  return payload as TResponse;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

