export class ApiError extends Error {
  status: number;
  messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages[0] || 'Request failed');
    this.status = status;
    this.messages = messages;
  }
}

interface BackendErrorBody {
  statusCode?: number;
  success?: boolean;
  message?: string | string[];
  timestamp?: string;
  path?: string;
}

export function normalizeApiError(status: number, body: unknown): ApiError {
  const b = (body || {}) as BackendErrorBody;
  const messages = Array.isArray(b.message) ? b.message : b.message ? [b.message] : ['Request failed'];
  return new ApiError(status, messages);
}
