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
import { Share2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export function LeaderboardTable() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [uniqueTokenCounts, setUniqueTokenCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tradersPerPage = 20;

  // Use ROI (return on investment) as our default sort key
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "roi",
    direction: "descending",
  });

  // Fetch data and aggregate by wallet
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
          const firstTrade = trades[0]; // Use first trade for wallet info
          return {
            id: wallet,
            wallet: wallet,
            token_name: "", // Not needed for aggregated view
            token_address: "", // Not needed for aggregated view
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
            roi: trades.reduce((sum, trade) => sum + trade.roi, 0) / trades.length, // Average ROI
            name: firstTrade.name,
            avatar: firstTrade.avatar,
            followers: firstTrade.followers,
            avg_entry_usd: firstTrade.avg_entry_usd
          };
        });

        setTraders(aggregatedTraders);
        
        // Calculate unique tokens per wallet
        const tokenCounts: { [key: string]: Set<string> } = {};
        data.forEach((trade) => {
          if (!tokenCounts[trade.wallet]) {
            tokenCounts[trade.wallet] = new Set();
          }
          tokenCounts[trade.wallet].add(trade.token_address);
        });

        // Convert Sets to counts
        const counts: { [key: string]: number } = {};
        Object.entries(tokenCounts).forEach(([wallet, tokens]) => {
          counts[wallet] = tokens.size;
        });

        setUniqueTokenCounts(counts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

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
  const displayRows = loading
    ? new Array(tradersPerPage).fill(null)
    : sortedTraders.slice(indexOfFirstTrader, indexOfLastTrader);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Default values for when manual data isn't available.
  const defaultAvatar = "/placeholder.svg?height=40&width=40";
  const defaultName = "RandomTrader";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-x-auto overflow-y-auto scrollbar-custom [&:not(:hover)::-webkit-scrollbar-thumb]:opacity-0 [&:not(:hover)]:scrollbar-thumb-transparent">
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
                            <span className="text-[10px] sm:text-xs md:text-sm text-[#858585] font-extralight">
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
  );
}

