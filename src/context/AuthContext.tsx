import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string, company: string, role: string) => Promise<void>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check initial user from backend or local session
    api.getCurrentUser()
      .then(res => {
        if (res.user) setUser(res.user);
      })
      .catch(() => {
        // Fallback demo user
        setUser({
          id: 'usr_demo_1',
          name: 'Alex Morgan',
          email: 'alex.morgan@fintech-enterprise.io',
          role: 'Lead QA Architect & Principal BA',
          company: 'Apex Global Financial Services'
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email);
      if (res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, company: string, role: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, company, role);
      if (res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
