import "server-only";

const API_BASE_URL = process.env.FCP_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ApiInit = Omit<RequestInit, "headers"> & { token?: string; headers?: Record<string, string> };

export async function apiRequest(path: string, init?: ApiInit): Promise<Response> {
  if (!API_BASE_URL) {
    throw new Error("FCP_API_BASE_URL is not configured");
  }

  const { token, headers, ...rest } = init ?? {};

  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(503, "Billing service is unreachable");
  }
}

export async function readApiError(response: Response): Promise<ApiError> {
  const body = (await response.json().catch(() => null)) as { message?: string } | null;
  return new ApiError(response.status, body?.message ?? response.statusText);
}

export async function apiFetch<T>(path: string, init?: ApiInit): Promise<T> {
  const response = await apiRequest(path, init);
  if (!response.ok) throw await readApiError(response);
  return response.json() as Promise<T>;
}
