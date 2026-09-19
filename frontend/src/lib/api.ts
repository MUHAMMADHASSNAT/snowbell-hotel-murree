const TOKEN_KEY = "snowbell-staff-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: StaffUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem("snowbell-staff-user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("snowbell-staff-user");
}

export function getStaffUser(): StaffUser | null {
  try {
    const raw = localStorage.getItem("snowbell-staff-user");
    return raw ? (JSON.parse(raw) as StaffUser) : null;
  } catch {
    return null;
  }
}

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "receptionist";
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  const base = import.meta.env.VITE_API_URL || "";
  try {
    res = await fetch(`${base}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Network error. Check that the hotel API is running.", 0);
  }

  const data = (await res.json().catch(() => ({}))) as { message?: string } & T;
  if (!res.ok) {
    throw new ApiError(data.message || "Request failed.", res.status);
  }
  return data;
}
