// Talks to the VESTA TEM API (Vercel serverless functions in /api). No third-party backend.
const TOKEN_KEY = 'vesta-tem-token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

interface ApiResult<T = any> {
  data: T;
}

async function call(method: 'GET' | 'POST', path: string, body?: unknown): Promise<ApiResult> {
  const token = getToken();
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
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

export const api = {
  get: (path: string) => call('GET', path),
  post: (path: string, body?: unknown) => call('POST', path, body),
};

export type CodePurpose = 'signup' | 'reset';

export const auth = {
  sendCode: (email: string, purpose: CodePurpose) => call('POST', '/api/auth/send-code', { email, purpose }),
  async signup(email: string, password: string, code: string) {
    const { data } = await call('POST', '/api/auth/signup', { email, password, code });
    setToken(data.token);
  },
  async login(email: string, password: string) {
    const { data } = await call('POST', '/api/auth/login', { email, password });
    setToken(data.token);
  },
  async reset(email: string, code: string, password: string) {
    const { data } = await call('POST', '/api/auth/reset', { email, code, password });
    setToken(data.token);
  },
  async logout() {
    try {
      await call('POST', '/api/auth/logout');
    } catch {
      // ignore
    }
    setToken(null);
  },
};
