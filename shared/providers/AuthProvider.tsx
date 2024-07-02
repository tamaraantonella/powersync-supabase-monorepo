import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User, UserStatus } from '../types/user';
import { useSupabase } from '@shared/providers/OfflineProvider';
import { db, powerSync } from '@shared/powersync/db';
import { useStatus } from '@powersync/react';
import { getOrganizationDetailsWithUserLocations } from '@shared/powersync/queries';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  user: Partial<User> | null;
  register: (credentials: Credentials) => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface Credentials {
  email: string;
  password: string;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const supabase = useSupabase();
  const { hasSynced } = useStatus();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [user, setUser] = useState<Partial<User> | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const register = async (credentials: Credentials) => {
    setIsLoading(true);
    const { user, session, error } = await supabase.register(
      credentials.email,
      credentials.password
    );
    if (session) {
      setIsAuthenticated(true);
      setUser(user);
    }
    if (error) {
      setIsLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
  };

  const login = (credentials: Credentials) => {
    return new Promise<void>(async (resolve, reject) => {
      setIsLoading(true);
      setError(null);
      if (!supabase) {
        setIsLoading(false);
        setError(new Error('Supabase client not initialized'));
        return reject(new Error('Supabase client not initialized'));
      }

      const { session, error } = await supabase.login(
        credentials.email,
        credentials.password
      );
      if (error) {
        setIsAuthenticated(false);
        setIsLoading(false);
        setError(error);
        await powerSync.disconnect();
        return reject(error);
      }
      if (session) {
        setIsAuthenticated(true);
        setIsLoading(false);
        resolve();
      } else {
        setIsLoading(false);
        reject(new Error('Login failed without specific error'));
      }
    });
  };

  const logout = async () => {
    await supabase.logout();
    await powerSync.disconnect();
    setIsAuthenticated(false);
    setUser(null);

    // Remove authentication state from local storage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };


  const getUserData = async () => {
    const { user: loggedInUser } = await supabase.getLoggedInUser();
    if (!loggedInUser) {
      return null;
    }
    const [user] = await Promise.all([
      db
        .selectFrom('User')
        .selectAll()
        .where('id', '=', loggedInUser.id)
        .executeTakeFirst()
    ]);
    if (!user) {
      return null;
    }

    return {
      user,
    };
  };

  useEffect(() => {
    (async () => {
      if (hasSynced && isAuthenticated) {
        const userData = await getUserData();
        if (!userData) {
          setIsLoading(false);
          setIsAuthenticated(false);
          setUser(null);
        } else {
          setUser(userData.user);
          // Store authentication state in local storage
          localStorage.setItem('isAuthenticated', JSON.stringify(true));
          localStorage.setItem('user', JSON.stringify(userData.user));
        }
      }
    })();
  }, [hasSynced, isAuthenticated]);
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');

    if (storedAuth && storedUser) {
      setIsAuthenticated(JSON.parse(storedAuth));
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        register,
        login,
        logout,
        isLoading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
