import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/authentification';
import { getData } from '../services/helper';
import { useAuthService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = useAuthService();

// Actions pour le reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: User };

// État initial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// Reducer pour gérer l'état d'authentification
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

// Provider du contexte d'authentification
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      
      if (!auth.isAuthenticated()) {
        dispatch({ type: 'AUTH_FAILURE', payload: '' });
        return;
      }

      try {
        const user = await auth.getCurrentUser();
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, token: getData("auth_token") || '' } 
        });
      } catch (error) {
        await logout()
        dispatch({ type: 'AUTH_FAILURE', payload: '' });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await auth.login(credentials);
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: response 
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Error' });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await auth.register(credentials);
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: response 
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Erreur lors de l\'inscription' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};