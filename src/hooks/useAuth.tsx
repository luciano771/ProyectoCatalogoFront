import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';
import { apiClient } from '../api/client';
import * as authApi from '../api/auth-api';

interface AuthState {
  user: authApi.AuthUser | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'catalogo_auth_token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true
  });

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem(STORAGE_KEY);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete apiClient.defaults.headers.common.Authorization;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      setState(s => ({ ...s, loading: false }));
      return;
    }
    setToken(token);
    authApi
      .getMe()
      .then(res => {
        setState({ user: res.user, token, loading: false });
      })
      .catch(() => {
        setToken(null);
        setState({ user: null, token: null, loading: false });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setToken(res.token);
    setState({ user: res.user, token: res.token, loading: false });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.registerMerchant(name, email, password);
    setToken(res.token);
    setState({ user: res.user, token: res.token, loading: false });
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setState({ user: null, token: null, loading: false });
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

