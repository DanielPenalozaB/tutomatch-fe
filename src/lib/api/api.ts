/**
 * Structured API error type
 */
export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}

/**
 * Custom error class for API errors that preserves the structure
 */
export class ApiResponseError extends Error {
  statusCode: number;
  errorType: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiResponseError';
    this.statusCode = error.statusCode;
    this.errorType = error.error || 'Unknown Error';

    // This is needed for instanceof to work correctly with custom errors
    Object.setPrototypeOf(this, ApiResponseError.prototype);
  }
}

/**
 * Utility function for making API calls
 * @param endpoint - API endpoint (e.g., "/auth/profile")
 * @param options - Fetch options (headers, method, body, etc.)
 * @param token - Optional Bearer token (if not provided, skips Authorization header)
 */
export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("API URL is not defined in environment variables");
  }
  const url = `${baseUrl}${endpoint}`;

  // Initialize headers if not provided
  const headers = new Headers(options.headers || {});

  // Set default Content-Type if not specified
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Add Authorization header if a token is provided
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Always attempt to parse the response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // For non-JSON responses
      const text = await response.text();
      try {
        // Try to parse it anyway in case it's JSON without proper content type
        data = JSON.parse(text);
      } catch {
        // If it's not parseable, use the text as is
        data = { message: text };
      }
    }

    // Check if response is not ok (status code outside 200-299)
    if (!response.ok) {
      // Create a structured error object
      const apiError: ApiError = {
        message: data.message || `API error: ${response.status}`,
        error: data.error || response.statusText,
        statusCode: data.statusCode || response.status
      };

      throw new ApiResponseError(apiError);
    }

    return data as T;
  } catch (error) {
    // If it's already our custom error, rethrow it
    if (error instanceof ApiResponseError) {
      console.error(`API request failed: ${endpoint}`, {
        statusCode: error.statusCode,
        error: error.errorType,
        message: error.message
      });
      throw error;
    }

    // For other errors (like network errors)
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};