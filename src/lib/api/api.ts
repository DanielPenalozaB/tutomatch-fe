/**
 * Utility function for making API calls
 */
export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("API URL is not defined in environment variables");
  }

  const url = `${baseUrl}${endpoint}`;

  // Set default headers if not provided
  if (!options.headers) {
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await fetch(url, options);

    // Parse JSON response
    const data = await response.json();

    // Handle non-2xx responses
    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }

    return data as T;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};