export type ApiResponse<TData = unknown> = {
  success: true;
  message: string;
  data?: TData | null;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
  };
};

export type ApiResponseBody<TData = unknown> =
  | ApiResponse<TData>
  | ApiErrorResponse;

export type CommonApiErrorType =
  | 'network'
  | 'timeout'
  | 'server'
  | 'business'
  | 'auth'
  | 'unknown';

export type ApiRequestConfig = {
  skipAuth?: boolean;
  skipAuthRefresh?: boolean;
  skipGlobalErrorToast?: boolean;
  retryable?: boolean;
  onRetry?: () => Promise<void> | void;
  _retry?: boolean;
};

export class ApiRequestError extends Error {
  status?: number;
  code?: string;
  response?: ApiErrorResponse;
  type: CommonApiErrorType;
  retryable: boolean;

  constructor({
    message,
    status,
    code,
    response,
    type = 'unknown',
    retryable = false,
  }: {
    message: string;
    status?: number;
    code?: string;
    response?: ApiErrorResponse;
    type?: CommonApiErrorType;
    retryable?: boolean;
  }) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.response = response;
    this.type = type;
    this.retryable = retryable;
  }
}

export function isApiErrorResponse(
  value: unknown,
): value is ApiErrorResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const response = value as Partial<ApiErrorResponse>;

  return (
    response.success === false &&
    typeof response.message === 'string' &&
    typeof response.error?.code === 'string'
  );
}

export function isCommonRetryableApiError(error: unknown) {
  return (
    error instanceof ApiRequestError &&
    error.retryable &&
    (error.type === 'network' ||
      error.type === 'timeout' ||
      error.type === 'server')
  );
}