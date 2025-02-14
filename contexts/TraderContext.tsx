"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Trade {
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
  traders: Trade[];
  rawTrades: Trade[];
  setTraders: (traders: Trade[]) => void;
  loading: boolean;
  aggregateTradesByTimeInterval: (wallet: string, interval: "daily" | "weekly" | "monthly" | "all-time") => Trade | null;
}

const TraderContext = createContext<TraderContextType | undefined>(undefined);

export function TraderProvider({ children }: { children: ReactNode }) {
  const [traders, setTraders] = useState<Trade[]>([]);
  const [rawTrades, setRawTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const aggregateTradesByTimeInterval = (wallet: string, interval: "daily" | "weekly" | "monthly" | "all-time") => {
    const now = new Date();
    let startDate = new Date();

    switch (interval) {
      case "daily":
        startDate.setDate(now.getDate() - 1);
        break;
      case "weekly":
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "all-time":
        startDate = new Date(0); // Beginning of time
        break;
    }

    const filteredTrades = rawTrades.filter(trade => 
      trade.wallet === wallet && 
      new Date(trade.last_trade) >= startDate
    );

    if (filteredTrades.length === 0) return null;

    const firstTrade = filteredTrades[0];
    return {
      ...firstTrade,
      buys: filteredTrades.reduce((sum, trade) => sum + trade.buys, 0),
      sells: filteredTrades.reduce((sum, trade) => sum + trade.sells, 0),
      invested_sol: filteredTrades.reduce((sum, trade) => sum + trade.invested_sol, 0),
      invested_sol_usd: filteredTrades.reduce((sum, trade) => sum + trade.invested_sol_usd, 0),
      realized_pnl: filteredTrades.reduce((sum, trade) => sum + trade.realized_pnl, 0),
      realized_pnl_usd: filteredTrades.reduce((sum, trade) => sum + trade.realized_pnl_usd, 0),
      roi: filteredTrades.reduce((sum, trade) => sum + trade.roi, 0) / filteredTrades.length,
      first_trade: filteredTrades.reduce((earliest, trade) => 
        trade.first_trade < earliest ? trade.first_trade : earliest,
        filteredTrades[0].first_trade
      ),
      last_trade: filteredTrades.reduce((latest, trade) => 
        trade.last_trade > latest ? trade.last_trade : latest,
        filteredTrades[0].last_trade
      ),
    };
  };

  useEffect(() => {
    fetch("/mock-data/leaderboard.json")
      .then((res) => res.json())
      .then((data: Trade[]) => {
        setRawTrades(data);
        // Group trades by wallet
        const walletGroups: { [key: string]: Trade[] } = {};
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
    <TraderContext.Provider value={{ traders, setTraders, rawTrades, loading, aggregateTradesByTimeInterval }}>
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