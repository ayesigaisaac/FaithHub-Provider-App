type AppEnv = {
  mode: "development" | "production" | "test";
  apiBaseUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  useSupabase: boolean;
};

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseBoolean(value: unknown): boolean {
  const raw = readString(value).toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

function resolveMode(value: string): AppEnv["mode"] {
  if (value === "production" || value === "test") return value;
  return "development";
}

export function getAppEnv(): AppEnv {
  const mode = resolveMode(readString(import.meta.env.MODE));
  const apiBaseUrl = readString(import.meta.env.VITE_API_BASE_URL) || "/api";
  const supabaseUrl = readString(import.meta.env.VITE_SUPABASE_URL);
  const supabaseAnonKey = readString(import.meta.env.VITE_SUPABASE_ANON_KEY);
  const useSupabase = parseBoolean(import.meta.env.VITE_USE_SUPABASE);

  return {
    mode,
    apiBaseUrl,
    supabaseUrl,
    supabaseAnonKey,
    useSupabase,
  };
}

export function assertAppEnv(): void {
  const env = getAppEnv();
  const errors: string[] = [];

  if (env.useSupabase) {
    if (!env.supabaseUrl) errors.push("Missing VITE_SUPABASE_URL while VITE_USE_SUPABASE=true");
    if (!env.supabaseAnonKey) errors.push("Missing VITE_SUPABASE_ANON_KEY while VITE_USE_SUPABASE=true");
  }

  if (errors.length > 0) {
    throw new Error(`Environment configuration error: ${errors.join("; ")}`);
  }
}
