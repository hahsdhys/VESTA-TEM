import { createClient } from '@supabase/supabase-js';

// Publishable (public) values: safe to ship in the browser. Data is protected on the server.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nlupwqdvklqwruxabbgx.supabase.co';
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_RcI9TcwbOH5mi2iBZsq8Ow_ki3C7mYn';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

const FN = `${SUPABASE_URL}/functions/v1/api`;

interface ApiResult<T = any> {
  data: T;
}

async function call(method: 'GET' | 'POST', path: string, body?: unknown): Promise<ApiResult> {
  const { data: s } = await supabase.auth.getSession();
  const token = s.session?.access_token;
  const res = await fetch(`${FN}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`) as Error & {
      response?: { status: number; data: unknown };
    };
    err.response = { status: res.status, data };
    throw err;
  }
  return { data };
}

// Same shape the pages already use (api.get / api.post -> { data }).
export const api = {
  get: (path: string) => call('GET', path),
  post: (path: string, body?: unknown) => call('POST', path, body),
};
