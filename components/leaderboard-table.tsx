"use client";

import { useState, useMemo, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Share2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Sliders } from "lucide-react";

// The Trader interface reflects the JSON API structure.
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
  // Optional properties for later admin overrides.
  name?: string;
  avatar?: string;
  followers: number;
  avg_entry_usd: number;
}

// Allowed sort keys for columns that have numerical data.
type SortKey = "roi" | "tradesTotal" | "avgBuy" | "realizedPNL" | "followers" | "tokens" | "winRate" | "avgEntry" | "avgHold";

// Sorting configuration interface.
interface SortConfig {
  key: SortKey;
  direction: "ascending" | "descending";
}

// SortIcon component: The SVG arrow flips based on sort direction.
const SortIcon = ({
  direction,
}: {
  direction?: "ascending" | "descending";
}) => (
  <svg
    width="11.5625"
    height="6"
    viewBox="0 0 11.5625 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`ml-1 flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 transition-transform duration-200 ${
      direction === "ascending" ? "rotate-180" : ""
    }`}
  >
    <path d="M5.78125 6L0.585098 0L10.9774 0L5.78125 6Z" fill="#AA00FF" />
  </svg>
);

// Add this utility function at the top of the file
const truncateAddress = (address: string) => {
  if (!address) return '';
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
};

// Add this utility function to format hold time
const formatHoldTime = (minutes: number) => {
  if (minutes < 240) { // Less than 4 hours
    return `${Math.round(minutes)}m`;
  } else {
    return `${Math.round(minutes / 60)}h`;
  }
};

// Add this utility function for SOL amount formatting
const formatSolAmount = (amount: number) => {
  if (amount < 1) {
    return amount.toFixed(2); // 0.01
  } else if (amount < 10) {
    return amount.toFixed(2); // 1.02
  } else if (amount < 100) {
    return amount.toFixed(1); // 10.2
  } else {
    return Math.round(amount).toString(); // 100
  }
};

// Add this utility function for USD amount formatting
const formatUsdAmount = (amount: number) => {
  if (amount < 100) {
    return `$${amount.toFixed(2)}`; // $0.01, $99.99
  } else if (amount < 1000) {
    return `$${amount.toFixed(2)}`; // $100.22, $999.99
  } else {
    return `$${Math.round(amount).toLocaleString()}`; // $1,000, $10,000
  }
};

// Add utility function for average entry amount formatting
const formatAvgEntryAmount = (amount: number) => {
  if (amount < 1000) {
    return `<$1K`;
  } else if (amount < 10000) {
    return `$${Math.floor(amount/1000)}K`;
  } else if (amount < 100000) {
    return `$${Math.floor(amount/1000)}K`;
  } else if (amount < 1000000) {
    return `$${Math.floor(amount/1000)}K`;
  } else if (amount < 1000000000) {
    return `$${(amount/1000000).toFixed(1)}M`;
  } else {
    return `$${(amount/1000000000).toFixed(1)}B`;
  }
};

// Add this utility function near the other utility functions
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

interface CopiedTooltip {
  wallet: string;
  x: number;
  y: number;
}

export function LeaderboardTable() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [uniqueTokenCounts, setUniqueTokenCounts] = useState<{ [key: string]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const tradersPerPage = 20;
  const [timeInterval, setTimeInterval] = useState<"daily" | "weekly" | "monthly" | "all-time">("daily");
  const [allTraders, setAllTraders] = useState<Trader[]>([]); // Store all traders data

  // Use ROI (return on investment) as our default sort key
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "roi",
    direction: "descending",
  });

  // Add state for managing copy feedback
  const [copiedTooltip, setCopiedTooltip] = useState<CopiedTooltip | null>(null);

  const intervals = ["daily", "weekly", "monthly", "all-time"] as const;
  type TimeInterval = typeof intervals[number];

  // Update the handler function
  const handleCopyWallet = (wallet: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    copyToClipboard(wallet);
    setCopiedTooltip({
      wallet,
      x: event.clientX,
      y: event.clientY
    });
    setTimeout(() => setCopiedTooltip(null), 500);
  };

  // Add a function to check if a trade falls within the selected time interval
  const isTradeInTimeInterval = (firstTrade: string, lastTrade: string) => {
    try {
      // Use a fixed date for testing (January 16, 2024)
      const now = new Date('2024-01-16T12:00:00Z');
      
      // Validate date strings and create Date objects
      const startDate = new Date(firstTrade);
      const endDate = new Date(lastTrade);

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date detected:', { firstTrade, lastTrade });
        return false;
      }
      
      switch (timeInterval) {
        case "daily":
          // Compare only the date part (year, month, day), ignoring time
          const today = now.toISOString().split('T')[0];
          const tradeDate = endDate.toISOString().split('T')[0];
          return today === tradeDate;
          
        case "weekly":
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return endDate >= weekAgo;
          
        case "monthly":
          const monthAgo = new Date(now);
          monthAgo.setDate(now.getDate() - 30);
          return endDate >= monthAgo;
          
        case "all-time":
          return true;
          
        default:
          return false;
      }
    } catch (error) {
      console.error('Error processing dates:', error, { firstTrade, lastTrade });
      return false;
    }
  };

  // Move the data fetching and processing into a separate function
  const fetchAndProcessData = async () => {
    try {
      const response = await fetch("/mock-data/leaderboard.json");
      const data: Trader[] = await response.json();
      setAllTraders(data);
      processTraders(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call fetchAndProcessData when component mounts or timeInterval changes
  useEffect(() => {
    fetchAndProcessData();
  }, [timeInterval]);

  // Handle interval button clicks
  const handleIntervalChange = (newInterval: typeof timeInterval) => {
    setTraders([]); // Clear existing data
    setTimeInterval(newInterval); // This will trigger the useEffect
  };

  // Handle sorting when a header is clicked.
  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Calculate win rate for a trader (wins / total trades)
  const calculateWinRate = (trader: Trader) => {
    const totalTrades = trader.buys + trader.sells;
    if (totalTrades === 0) return 0;
    // For this example, let's consider sells as winning trades
    // You might want to adjust this logic based on your actual win/loss criteria
    return (trader.sells / totalTrades) * 100;
  };

  // Calculate average hold time for a trader (in minutes)
  const calculateAvgHoldTime = (trader: Trader) => {
    const firstDate = new Date(trader.first_trade);
    const lastDate = new Date(trader.last_trade);
    const diffInMinutes = Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60));
    return diffInMinutes;
  };

  // Sort traders based on the current sort configuration.
  const sortedTraders = useMemo(() => {
    const sorted = [...traders].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      switch (sortConfig.key) {
        case "followers":
          aValue = a.followers || 0;
          bValue = b.followers || 0;
          break;
        case "tokens":
          aValue = uniqueTokenCounts[a.wallet] || 0;
          bValue = uniqueTokenCounts[b.wallet] || 0;
          break;
        case "winRate":
          aValue = calculateWinRate(a);
          bValue = calculateWinRate(b);
          break;
        case "tradesTotal":
          aValue = a.buys + a.sells;
          bValue = b.buys + b.sells;
          break;
        case "avgBuy":
          aValue = a.invested_sol;
          bValue = b.invested_sol;
          break;
        case "realizedPNL":
          aValue = a.realized_pnl;
          bValue = b.realized_pnl;
          break;
        case "roi":
          aValue = a.roi;
          bValue = b.roi;
          break;
        case "avgHold":
          aValue = calculateAvgHoldTime(a);
          bValue = calculateAvgHoldTime(b);
          break;
        case "avgEntry":
          aValue = a.avg_entry_usd;
          bValue = b.avg_entry_usd;
          break;
        default:
          aValue = "";
          bValue = "";
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }
      return sortConfig.direction === "ascending"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [traders, sortConfig, uniqueTokenCounts]);

  // Calculate pagination indices.
  const totalPages = Math.ceil(traders.length / tradersPerPage);
  const indexOfLastTrader = currentPage * tradersPerPage;
  const indexOfFirstTrader = indexOfLastTrader - tradersPerPage;
  const displayRows = sortedTraders.slice(indexOfFirstTrader, indexOfLastTrader);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Default values for when manual data isn't available.
  const defaultAvatar = "/placeholder.svg?height=40&width=40";
  const defaultName = "RandomTrader";

  // Process traders and calculate unique token counts
  const processTraders = (data: Trader[]) => {
    // First, group all trades by wallet
    const walletGroups: { [key: string]: Trader[] } = {};
    data.forEach((trade) => {
      if (!walletGroups[trade.wallet]) {
        walletGroups[trade.wallet] = [];
      }
      walletGroups[trade.wallet].push(trade);
    });

    // Filter and aggregate data for each wallet based on the time interval
    const aggregatedTraders = Object.entries(walletGroups)
      .map(([wallet, trades]) => {
        // Filter trades for the current time interval
        const filteredTrades = trades.filter(trade => 
          isTradeInTimeInterval(trade.first_trade, trade.last_trade)
        );

        // If no trades in the current interval, return null
        if (filteredTrades.length === 0) {
          return null;
        }

        // Aggregate the filtered trades
        const firstTrade = filteredTrades[0];
        return {
          id: wallet,
          wallet: wallet,
          token_name: "",
          token_address: "",
          first_trade: filteredTrades.reduce((earliest, trade) => 
            trade.first_trade < earliest ? trade.first_trade : earliest,
            filteredTrades[0].first_trade
          ),
          last_trade: filteredTrades.reduce((latest, trade) => 
            trade.last_trade > latest ? trade.last_trade : latest,
            filteredTrades[0].last_trade
          ),
          buys: filteredTrades.reduce((sum, trade) => sum + trade.buys, 0),
          sells: filteredTrades.reduce((sum, trade) => sum + trade.sells, 0),
          invested_sol: filteredTrades.reduce((sum, trade) => sum + trade.invested_sol, 0),
          invested_sol_usd: filteredTrades.reduce((sum, trade) => sum + trade.invested_sol_usd, 0),
          realized_pnl: filteredTrades.reduce((sum, trade) => sum + trade.realized_pnl, 0),
          realized_pnl_usd: filteredTrades.reduce((sum, trade) => sum + trade.realized_pnl_usd, 0),
          roi: filteredTrades.reduce((sum, trade) => sum + trade.roi, 0) / filteredTrades.length,
          name: firstTrade.name,
          avatar: firstTrade.avatar,
          followers: firstTrade.followers,
          avg_entry_usd: firstTrade.avg_entry_usd
        };
      })
      .filter((trader): trader is Trader => trader !== null);

    setTraders(aggregatedTraders);
    
    // Calculate unique tokens per wallet for the filtered period
    const tokenCounts: { [key: string]: Set<string> } = {};
    data.forEach((trade) => {
      if (isTradeInTimeInterval(trade.first_trade, trade.last_trade)) {
        if (!tokenCounts[trade.wallet]) {
          tokenCounts[trade.wallet] = new Set();
        }
        tokenCounts[trade.wallet].add(trade.token_address);
      }
    });

    // Convert Sets to counts
    const counts: { [key: string]: number } = {};
    Object.entries(tokenCounts).forEach(([wallet, tokens]) => {
      counts[wallet] = tokens.size;
    });

    setUniqueTokenCounts(counts);
  };

  return (
    <>
      <div className="flex flex-col h-full pb-2">
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-0 xl:items-center xl:justify-between mb-6">
          {/* Top row in tablet/small desktop - Contains Traders/Groups and interval buttons */}
          <div className="flex items-center justify-between xl:justify-start">
            {/* Left side - Traders/Groups buttons */}
            <div className="flex items-center gap-2 xl:mr-8">
              <Button
                variant="secondary"
                className="h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-[10px] sm:text-xs md:text-sm rounded-full bg-[#25223d] text-white border border-[#464558] hover:bg-[#464558] font-extralight"
              >
                Traders
              </Button>
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-[10px] sm:text-xs md:text-sm rounded-full text-[#858585] hover:text-white hover:bg-[#464558] font-extralight"
                >
                  Groups
                </Button>
                <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-[#25223d] text-white text-[8px] sm:text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  coming soon...
                </div>
              </div>
            </div>

            {/* Middle - Time interval buttons */}
            <div className="flex items-center gap-2">
              {intervals.map((interval) => (
                <Button
                  key={interval}
                  variant={timeInterval === interval ? "secondary" : "ghost"}
                  className={`h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-[10px] sm:text-xs md:text-sm rounded-full ${
                    timeInterval === interval
                      ? "bg-[#25223d] text-white border border-[#464558] hover:bg-[#464558]"
                      : "text-[#858585] hover:text-white hover:bg-[#464558]"
                  } font-extralight`}
                  onClick={() => handleIntervalChange(interval)}
                >
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Bottom row in tablet/small desktop - Search and filter */}
          <div className="flex items-center gap-2 w-full xl:w-auto">
            <div className="relative flex-1 xl:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-[#858585]" />
              <Input
                type="text"
                placeholder="Search by name or wallet"
                className="h-[37px] w-full xl:w-[414px] bg-[#060611] border-[#464558] border text-white placeholder:text-[#858585] text-[10px] sm:text-xs md:text-sm font-extralight rounded-[20px] pl-9 pr-3 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#464558]"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-[37px] w-[53px] rounded-[20px] bg-[#11121B] border-[#464558] border text-[#858585] hover:text-white hover:bg-[#464558]"
            >
              <Sliders className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-x-auto overflow-y-auto scrollbar-custom [.scrolling-active_&]:scrollbar-thumb-visible scrollbar-thumb-transparent scrollbar-y-transparent [.scrolling-active_&]:scrollbar-y-visible">
            <Table className="table-fixed w-full min-w-[1000px] sm:min-w-[1200px] md:min-w-[1500px] text-xs sm:text-sm md:text-base">
              <TableHeader className="bg-[#25223D] sticky top-0 z-10 h-8 sm:h-10 md:h-12">
                <TableRow className="border-b border-[#23242C]">
                  {/* Rank */}
                  <TableHead className="w-[40px] sm:w-[60px] text-center whitespace-nowrap px-2 text-white">
                    Rank
                  </TableHead>
                  {/* Trader */}
                  <TableHead className="w-[160px] sm:w-[200px] text-left whitespace-nowrap px-2 text-white">
                    Trader
                  </TableHead>
                  {/* Followers */}
                  <TableHead
                    onClick={() => handleSort("followers")}
                    className="w-[100px] sm:w-[125px] text-right whitespace-nowrap px-2 text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Followers
                      <SortIcon
                        direction={sortConfig.key === "followers" ? sortConfig.direction : undefined}
                      />
                    </div>
                  </TableHead>
                  {/* Tokens */}
                  <TableHead
                    onClick={() => handleSort("tokens")}
                    className="w-[110px] sm:w-[120px] text-right whitespace-nowrap px-2 text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Tokens
                      <SortIcon
                        direction={sortConfig.key === "tokens" ? sortConfig.direction : undefined}
                      />
                    </div>
                  </TableHead>
                  {/* Win Rate */}
                  <TableHead
                    onClick={() => handleSort("winRate")}
                    className="w-[80px] sm:w-[90px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Win Rate
                      <SortIcon
                        direction={sortConfig.key === "winRate" ? sortConfig.direction : undefined}
                      />
                    </div>
                  </TableHead>
                  {/* ROI */}
                  <TableHead
                    onClick={() => handleSort("roi")}
                    className="w-[80px] sm:w-[90px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-end gap-1">
                      ROI
                      <SortIcon
                        direction={sortConfig.key === "roi" ? sortConfig.direction : undefined}
                      />
                    </div>
                  </TableHead>
                  {/* Trades */}
                  <TableHead
                    onClick={() => handleSort("tradesTotal")}
                    className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Trades
                      <SortIcon
                        direction={sortConfig.key === "tradesTotal" ? sortConfig.direction : undefined}
                      />
                    </div>
                  </TableHead>
                  {/* Avg Buy */}
                  <TableHead
                    onClick={() => handleSort("avgBuy")}
                    className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Avg Buy
                      <SortIcon
                        direction={sortConfig.key === "avgBuy" ? sortConfig.direction : undefined}
                      />
                    </div>
                  </TableHead>
                  {/* Avg Entry */}
                  <TableHead
                    onClick={() => handleSort("avgEntry")}
                    className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Avg Entry
                      <SortIcon
                        direction={sortConfig.key === "avgEntry" ? sortConfig.direction : undefined}
                      />
                    </div>
                  </TableHead>
                  {/* Avg Hold */}
                  <TableHead
                    onClick={() => handleSort("avgHold")}
                    className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Avg Hold
                      <SortIcon
                        direction={sortConfig.key === "avgHold" ? sortConfig.direction : undefined}
                      />
                    </div>
                  </TableHead>
                  {/* Realized PNL */}
                  <TableHead
                    onClick={() => handleSort("realizedPNL")}
                    className="w-[120px] sm:w-[150px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white cursor-pointer"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Realized PNL
                      <SortIcon
                        direction={sortConfig.key === "realizedPNL" ? sortConfig.direction : undefined}
                      />
                    </div>
                  </TableHead>
                  {/* Share */}
                  <TableHead className="w-[60px] sm:w-[80px] text-center whitespace-nowrap pr-8 p-1 sm:p-2 md:p-3 text-white">
                    Share
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayRows.map((trader, index) => {
                  const globalRank = indexOfFirstTrader + index + 1;
                  return (
                    <TableRow
                      key={trader ? trader.wallet : index}
                      className="border-b border-[#23242C] bg-[#11121B] h-10 sm:h-12 md:h-14"
                    >
                      {/* Rank */}
                      <TableCell className="w-[40px] sm:w-[60px] text-center whitespace-nowrap p-1 sm:p-2 md:p-3">
                        <div
                          className={`inline-flex items-center justify-center rounded-full w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${
                            globalRank === 1
                              ? "bg-[#CCAD59] text-[#060611]"
                              : globalRank === 2
                              ? "bg-[#BFBFBF] text-[#060611]"
                              : globalRank === 3
                              ? "bg-[#B2835F] text-[#060611]"
                              : "bg-[#aa00ff]/20 text-[#ffffff]"
                          }`}
                        >
                          {globalRank}
                        </div>
                      </TableCell>
                      {/* Trader */}
                      <TableCell className="w-[160px] sm:w-[200px] text-left whitespace-nowrap p-1 sm:p-2 md:p-3">
                        {trader ? (
                          <Link href={`/trader/${trader.wallet}`} className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10">
                              <AvatarImage
                                src={trader.avatar || defaultAvatar}
                                alt={(trader.name || defaultName)}
                              />
                              <AvatarFallback>
                                {(trader.name || defaultName)[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col whitespace-nowrap">
                              <span className="font-medium hover:text-[#aa00ff] text-xs sm:text-sm md:text-base">
                                {trader.name || defaultName}
                              </span>
                              <span 
                                onClick={(e) => handleCopyWallet(trader.wallet, e)}
                                className={`text-[10px] sm:text-xs md:text-sm text-[#858585] font-extralight cursor-pointer hover:text-[#aa00ff] transition-colors duration-200 ${
                                  copiedTooltip?.wallet === trader.wallet ? 'text-[#aa00ff]' : ''
                                }`}
                              >
                                {truncateAddress(trader.wallet)}
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      {/* Followers */}
                      <TableCell className="w-[100px] sm:w-[125px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                        {trader ? trader.followers : <span>-</span>}
                      </TableCell>
                      {/* Tokens */}
                      <TableCell className="w-[110px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                        {trader ? uniqueTokenCounts[trader.wallet] || 0 : <span>-</span>}
                      </TableCell>
                      {/* Win Rate */}
                      <TableCell className="w-[80px] sm:w-[90px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                        {trader ? `${calculateWinRate(trader).toFixed(1)}%` : <span>-</span>}
                      </TableCell>
                      {/* ROI */}
                      <TableCell className="w-[80px] sm:w-[90px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                        {trader ? `${trader.roi}%` : <span>-</span>}
                      </TableCell>
                      {/* Trades */}
                      <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                        {trader ? (
                          <>
                            <span className="text-[#59cc6c] font-bold">{trader.buys}</span>
                            <span className="text-[#858585]">/</span>
                            <span className="text-[#CC5959]">{trader.sells}</span>
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      {/* Avg Buy */}
                      <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                        {trader ? (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                              <span>{formatSolAmount(trader.invested_sol)}</span>
                              <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-EwjxE5rUhSoNSk5kZC7K3W0N5czTxo.svg"
                                alt="SOL"
                                width={16}
                                height={16}
                                className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                              />
                            </div>
                            <span className="text-[#858585] font-extralight">
                              {formatUsdAmount(trader.invested_sol_usd)}
                            </span>
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      {/* Avg Entry */}
                      <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                        {trader ? formatAvgEntryAmount(trader.avg_entry_usd) : <span>-</span>}
                      </TableCell>
                      {/* Avg Hold */}
                      <TableCell className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                        {trader ? formatHoldTime(calculateAvgHoldTime(trader)) : <span>-</span>}
                      </TableCell>
                      {/* Realized PNL */}
                      <TableCell className="w-[120px] sm:w-[150px] text-right whitespace-nowrap pr-4 overflow-hidden p-1 sm:p-2 md:p-3">
                        {trader ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <div className="flex items-center gap-1 text-sm font-bold">
                              <span className={trader.realized_pnl >= 0 ? "text-[#59cc6c]" : "text-[#CC5959]"}>
                                {trader.realized_pnl >= 0 ? '+' : '-'}{formatSolAmount(Math.abs(trader.realized_pnl))}
                              </span>
                              <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-EwjxE5rUhSoNSk5kZC7K3W0N5czTxo.svg"
                                alt="SOL"
                                width={16}
                                height={16}
                                className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                              />
                            </div>
                            <span className="text-[#858585] text-xs font-extralight">
                              {formatUsdAmount(trader.realized_pnl_usd)}
                            </span>
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      {/* Share */}
                      <TableCell className="w-[60px] sm:w-[80px] text-center whitespace-nowrap pr-8 p-1 sm:p-2 md:p-3">
                        {trader ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#aa00ff] hover:text-[#aa00ff] hover:bg-[#aa00ff]/20"
                          >
                            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                          </Button>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Pagination - Fixed at bottom */}
        <div className="flex-shrink-0 flex justify-between items-center py-1 px-2 sm:px-3 md:px-4 border-t border-[#464558] bg-[#11121B]">
          <Button
            onClick={prevPage}
            disabled={currentPage === 1}
            variant="outline"
            className="bg-[#25223D] text-white border-[#464558] hover:bg-[#464558] h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Previous
          </Button>
          <span className="text-[#858585] text-xs sm:text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            className="bg-[#25223D] text-white border-[#464558] hover:bg-[#464558] h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
          >
            Next
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          </Button>
        </div>
      </div>

      {/* Add the tooltip */}
      {copiedTooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs bg-[#25223D] text-white rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: copiedTooltip.x,
            top: copiedTooltip.y - 10
          }}
        >
          Copied to clipboard
        </div>
      )}
    </>
  );
}

