"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Trader {
  id: string;
  wallet: string;
  token_name: string;
  token_address: string;
  first_trade: string;
  last_trade: string;
  buys: number;
  sells: number;
  invested_sol: number;
  invested_sol_usd: number;
  realized_pnl: number;
  realized_pnl_usd: number;
  roi: number;
  name?: string;
  avatar?: string;
  followers: number;
  avg_entry_usd: number;
}

interface TraderContextType {
  traders: Trader[];
  setTraders: (traders: Trader[]) => void;
  loading: boolean;
}

const TraderContext = createContext<TraderContextType | undefined>(undefined);

export function TraderProvider({ children }: { children: ReactNode }) {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/mock-data/leaderboard.json")
      .then((res) => res.json())
      .then((data: Trader[]) => {
        // Group trades by wallet
        const walletGroups: { [key: string]: Trader[] } = {};
        data.forEach((trade) => {
          if (!walletGroups[trade.wallet]) {
            walletGroups[trade.wallet] = [];
          }
          walletGroups[trade.wallet].push(trade);
        });

        // Aggregate data for each wallet
        const aggregatedTraders = Object.entries(walletGroups).map(([wallet, trades]) => {
          const firstTrade = trades[0];
          return {
            id: wallet,
            wallet: wallet,
            token_name: firstTrade.token_name,
            token_address: firstTrade.token_address,
            first_trade: trades.reduce((earliest, trade) => 
              trade.first_trade < earliest ? trade.first_trade : earliest,
              trades[0].first_trade
            ),
            last_trade: trades.reduce((latest, trade) => 
              trade.last_trade > latest ? trade.last_trade : latest,
              trades[0].last_trade
            ),
            buys: trades.reduce((sum, trade) => sum + trade.buys, 0),
            sells: trades.reduce((sum, trade) => sum + trade.sells, 0),
            invested_sol: trades.reduce((sum, trade) => sum + trade.invested_sol, 0),
            invested_sol_usd: trades.reduce((sum, trade) => sum + trade.invested_sol_usd, 0),
            realized_pnl: trades.reduce((sum, trade) => sum + trade.realized_pnl, 0),
            realized_pnl_usd: trades.reduce((sum, trade) => sum + trade.realized_pnl_usd, 0),
            roi: trades.reduce((sum, trade) => sum + trade.roi, 0) / trades.length,
            name: firstTrade.name,
            avatar: firstTrade.avatar,
            followers: firstTrade.followers,
            avg_entry_usd: firstTrade.avg_entry_usd
          };
        });

        setTraders(aggregatedTraders);
        setLoading(false);
      });
  }, []);

  return (
    <TraderContext.Provider value={{ traders, setTraders, loading }}>
      {children}
    </TraderContext.Provider>
  );
}

export function useTraders() {
  const context = useContext(TraderContext);
  if (context === undefined) {
    throw new Error('useTraders must be used within a TraderProvider');
  }
  return context;
} 