import type { AxiosError } from "axios";
import Snackbar from "react-native-snackbar";

export type ApiErrorInfo = {
  status?: number;
  code?: string;
  message: string;
  raw?: unknown;
};

function isAxiosError(error: unknown): error is AxiosError<any> {
  return typeof error === "object" && error !== null && (error as any).isAxiosError === true;
}

function coerceToString(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const parts = value
      .map((v) => (typeof v === "string" ? v : typeof v === "object" && v && "msg" in v ? String((v as any).msg) : undefined))
      .filter(Boolean) as string[];
    return parts.length ? parts.join("\n") : undefined;
  }
  if (typeof value === "object") {
    const maybeMsg = (value as any).message || (value as any).mensagem || (value as any).error || (value as any).erro;
    if (typeof maybeMsg === "string") return maybeMsg;

    const entries = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => {
        const str = coerceToString(v);
        return str ? `${k}: ${str}` : undefined;
      })
      .filter(Boolean) as string[];

    return entries.length ? entries.join("\n") : undefined;
  }
  try {
    return String(value);
  } catch {
    return undefined;
  }
}

export function extractApiError(error: unknown, defaultMessage = "Ocorreu um erro. Tente novamente."): ApiErrorInfo {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as any | undefined;

    const direct = coerceToString(data);
    const detail = coerceToString(data?.detail);
    const message = coerceToString(data?.message) || coerceToString(data?.mensagem);
    const errorField = coerceToString(data?.error) || coerceToString(data?.erro);
    const errorsField = coerceToString(data?.errors);

    const msg = detail || message || errorField || errorsField || direct || error.message || defaultMessage;

    const normalized = status === 401 || status === 403 ? (msg || "Sessão expirada. Faça login novamente.") : msg;

    return { status, message: normalized, raw: error, code: (error as any).code };
  }

  const message = (error as any)?.message || defaultMessage;
  return { message, raw: error };
}

export type HandleApiErrorOptions = {
  title?: string;
  variant?: "default" | "destructive";
  fallbackMessage?: string;
  logLabel?: string;
};

export function handleApiError(error: unknown, options: HandleApiErrorOptions = {}) {
  const { title = "Opa! Algo deu errado", variant = "destructive", fallbackMessage = "Ocorreu um erro. Tente novamente.", logLabel } = options;

  const info = extractApiError(error, fallbackMessage);

  // Map variant to snackbar colors
  const backgroundColor = variant === "destructive" ? "#e43030ff" : "#323232";

  try {
    // Show message — Snackbar prefers short text; show title + message when title provided
    const text = info.message ? `${info.message}` : title;
    Snackbar.show({ text, duration: Snackbar.LENGTH_LONG, backgroundColor });
  } catch (snackErr) {
    console.warn("[Snackbar] failed to show", snackErr);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(logLabel ? `${logLabel}:` : "API error:", error);
  }

  return info;
}

export async function withErrorSnackbar<T>(promise: Promise<T>, options?: HandleApiErrorOptions): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    handleApiError(error, options);
    throw error;
  }
}
