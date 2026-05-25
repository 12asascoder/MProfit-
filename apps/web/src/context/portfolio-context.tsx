'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';

export interface Portfolio {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  members: any[];
}

interface PortfolioContextType {
  portfolios: Portfolio[];
  activePortfolio: Portfolio | null;
  setActivePortfolioId: (id: string) => void;
  isLoading: boolean;
  refreshPortfolios: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const data = (await ApiClient.getPortfolios()) as Portfolio[];
      setPortfolios(data);
      // If we don't have an active portfolio, pick the default one
      if (data.length > 0 && !activePortfolio) {
        const defaultPortfolio = data.find((p: Portfolio) => p.isDefault) || data[0];
        setActivePortfolio(defaultPortfolio);
      } else if (data.length > 0 && activePortfolio) {
        // Ensure active is refreshed
        const refreshedActive = data.find((p: Portfolio) => p.id === activePortfolio.id);
        if (refreshedActive) setActivePortfolio(refreshedActive);
      }
    } catch (error) {
      console.error('Failed to fetch portfolios', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolios();
    }
  }, [isAuthenticated]);

  const setActivePortfolioId = (id: string) => {
    const portfolio = portfolios.find(p => p.id === id);
    if (portfolio) {
      setActivePortfolio(portfolio);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        activePortfolio,
        setActivePortfolioId,
        isLoading,
        refreshPortfolios: fetchPortfolios,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
