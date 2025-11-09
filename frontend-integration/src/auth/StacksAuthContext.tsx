// Stacks wallet authentication context for React
import { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, AppConfig, authenticate } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Proper TypeScript interfaces
interface UserData {
  stxAddress: {
    mainnet: string;
    testnet: string;
  };
  btcAddress: {
    p2wpkh: {
      mainnet: string;
      testnet: string;
    };
  };
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
  };
  username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: any;
}

interface AuthContextType {
  userSession: any;
  userData: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userSession,
  userData: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  signIn: async () => {},
  signOut: () => {},
  clearError: () => {},
});

import type { ReactNode } from 'react';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (userSession.isUserSignedIn()) {
          const loadedUserData = userSession.loadUserData();
          setUserData(loadedUserData);
          // Persist user data to localStorage
          localStorage.setItem('cinex_user_data', JSON.stringify(loadedUserData));
        } else if (userSession.isSignInPending()) {
          const pendingUserData = await userSession.handlePendingSignIn();
          setUserData(pendingUserData);
          // Persist user data to localStorage
          localStorage.setItem('cinex_user_data', JSON.stringify(pendingUserData));
        } else {
          // Try to restore from localStorage
          const storedUserData = localStorage.getItem('cinex_user_data');
          if (storedUserData && userSession.isUserSignedIn()) {
            try {
              const parsedUserData = JSON.parse(storedUserData);
              setUserData(parsedUserData);
            } catch (parseError) {
              console.warn('Failed to parse stored user data:', parseError);
              localStorage.removeItem('cinex_user_data');
            }
          }
        }
      } catch (authError) {
        console.error('Authentication initialization error:', authError);
        setError('Failed to initialize authentication. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      return new Promise<void>((resolve, reject) => {
        authenticate({
          appDetails: {
            name: 'CineX',
            icon: window.location.origin + '/vite.svg',
          },
          userSession,
          onFinish: () => {
            try {
              const loadedUserData = userSession.loadUserData();
              setUserData(loadedUserData);
              // Persist user data to localStorage
              localStorage.setItem('cinex_user_data', JSON.stringify(loadedUserData));
              setIsLoading(false);
              resolve();
            } catch (finishError) {
              console.error('Sign in finish error:', finishError);
              setError('Failed to complete sign in. Please try again.');
              setIsLoading(false);
              reject(finishError);
            }
          },
          onCancel: () => {
            setError('Sign in was cancelled.');
            setIsLoading(false);
            reject(new Error('Sign in cancelled'));
          },
        });
      });
    } catch (signInError) {
      console.error('Sign in error:', signInError);
      setError('Failed to sign in. Please check your wallet connection.');
      setIsLoading(false);
      throw signInError;
    }
  };

  const signOut = (): void => {
    try {
      userSession.signUserOut(window.location.origin);
      setUserData(null);
      // Clear persisted data
      localStorage.removeItem('cinex_user_data');
      localStorage.removeItem('blockstack-session');
      setError(null);
    } catch (signOutError) {
      console.error('Sign out error:', signOutError);
      setError('Failed to sign out properly. Please refresh the page.');
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const isAuthenticated = Boolean(userData && userSession.isUserSignedIn());

  const contextValue: AuthContextType = {
    userSession,
    userData,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
