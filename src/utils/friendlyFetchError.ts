// Utility to return a user-friendly error message for 'Failed to fetch'
export function friendlyFetchError(error: string | null | undefined): string | null | undefined {
  if (error === 'Failed to fetch') {
    return 'The server is currently unavailable. This may be due to a cold start or temporary downtime. Please try again in a moment.';
  }
  return error;
} 