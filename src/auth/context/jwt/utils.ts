import Cookies from 'js-cookie';

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token format');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    // console.warn('Error decoding token:', error);
    return null;
  }
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  if (!decoded || !decoded.exp) {
    return true;
  }

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  let expiredTimer;

  const currentTime = Date.now();

  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    Cookies.remove('accessToken', { path: '/' });

    window.location.href = paths.auth.jwt.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null, userData: string | null) => {
  if (accessToken) {
    Cookies.set('accessToken', accessToken, { path: '/' });

    Cookies.set('user', userData || "", { path: '/' });

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    const decoded: any = jwtDecode(accessToken);

    if (decoded?.exp) {
      tokenExpired(decoded.exp);
    }
  } else {
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('user', { path: '/' });

    delete axios.defaults.headers.common.Authorization;
  }
};
