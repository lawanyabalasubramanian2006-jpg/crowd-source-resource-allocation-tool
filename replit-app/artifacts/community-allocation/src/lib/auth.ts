import { setAuthTokenGetter } from '@workspace/api-client-react';

const TOKEN_KEY = 'community-allocation-token';

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function configureAuth() {
  setAuthTokenGetter(() => getStoredToken());
}