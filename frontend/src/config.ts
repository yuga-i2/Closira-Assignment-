const API_BASE_URL = __DEV__
  ? 'http://localhost:8000'
  : process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export { API_BASE_URL };
