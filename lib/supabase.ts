import "server-only";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export async function supabaseRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase belum dikonfigurasi.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Permintaan database gagal (${response.status}): ${body}`);
  return (body ? JSON.parse(body) : undefined) as T;
}
