export const API_BASE_URL = 'http://localhost:8085/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  SWEETS: {
    LIST: '/sweets',
    SEARCH: '/sweets/search',
    PURCHASE: (id: string) => `/sweets/${id}/purchase`,
    RESTOCK: (id: string) => `/sweets/${id}/restock`,
    BY_ID: (id: string) => `/sweets/${id}`,
  },
} as const;

export const COOKIE_NAME = 'token';