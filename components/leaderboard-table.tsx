"use client";

import { useState, useMemo } from "react";
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

// Note: The Trader interface no longer handles rank.
interface Trader {
  name: string;
  avatar: string;
  address: string;
  handle: string;
  followers: number;
  tokens: number;
  winRate: number;
  trades: string; // Format: "buys/sells"
  avgBuy: { value: number; usd: number };
  avgEntry: string;
  avgHold: string;
  realizedPNL: { value: number; usd: number };
}

const traders: Trader[] = [
  {
    // Data for trader "Orangie"
    name: "Orangie",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orangie.jpg-X6YaR1BIWidE4CTmLTuPEz0rh70m7E.jpeg",
    address: "6sdE9C...dD4Sca",
    handle: "@orangie",
    followers: 279,
    tokens: 104,
    winRate: 74,
    trades: "201/321",
    avgBuy: { value: 10.2, usd: 2346 },
    avgEntry: "$212K",
    avgHold: "32 m",
    realizedPNL: { value: 101.2, usd: 23276 },
  },
  {
    name: "CryptoWhale",
    avatar: "/placeholder.svg?height=40&width=40",
    address: "7hdF2C...kL9Pqb",
    handle: "@whale",
    followers: 156,
    tokens: 89,
    winRate: 68,
    trades: "178/298",
    avgBuy: { value: 8.7, usd: 1998 },
    avgEntry: "$180K",
    avgHold: "45 m",
    realizedPNL: { value: 89.5, usd: 20585 },
  },
  // ... (other traders)
];

// Define allowed sort keys. For the "Trades" column we use "tradesTotal"
// which sums the buys and sells.
type SortKey =
  | "followers"
  | "tokens"
  | "winRate"
  | "tradesTotal"
  | "avgBuy"
  | "avgEntry"
  | "avgHold"
  | "realizedPNL";

// Sorting configuration.
interface SortConfig {
  key: SortKey;
  direction: "ascending" | "descending";
}

/*
  The SVG in this component draws an arrow that by default (unrotated) points down.
  To indicate ascending sorting we add a rotate-180, which flips the arrow to point up.
  Columns that are not sorted receive no direction, so they show the default (down) arrow.
*/
const SortIcon = ({
  fill = "#AA00FF",
  direction,
}: {
  fill?: string;
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
    <path d="M5.78125 6L0.585098 0L10.9774 0L5.78125 6Z" fill={fill} />
  </svg>
);

// Helper to calculate total trades from a trader's "buys/sells" string.
const getTradesTotal = (trader: Trader) => {
  const parts = trader.trades.split("/");
  if (parts.length !== 2) return 0;
  const buy = Number(parts[0]);
  const sell = Number(parts[1]);
  return buy + sell;
};

export function LeaderboardTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const tradersPerPage = 15;
  const totalPages = Math.ceil(traders.length / tradersPerPage);

  // This flag indicates whether data has been fetched.
  // When loading is true, our display rows will be empty.
  const [loading, setLoading] = useState(false);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "followers",
    direction: "ascending",
  });

  // Called when a header is clicked to change the sort configuration.
  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Sort traders using the currently selected key.
  const sortedTraders = useMemo(() => {
    const sorted = [...traders].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      switch (sortConfig.key) {
        case "tradesTotal":
          aValue = getTradesTotal(a);
          bValue = getTradesTotal(b);
          break;
        case "avgBuy":
          aValue = a.avgBuy.value;
          bValue = b.avgBuy.value;
          break;
        case "realizedPNL":
          aValue = a.realizedPNL.value;
          bValue = b.realizedPNL.value;
          break;
        default:
          // For followers, tokens, winRate, avgEntry, and avgHold
          aValue = a[sortConfig.key as keyof Trader] as number | string;
          bValue = b[sortConfig.key as keyof Trader] as number | string;
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
  }, [traders, sortConfig]);

  // Calculate pagination indices.
  const indexOfLastTrader = currentPage * tradersPerPage;
  const indexOfFirstTrader = indexOfLastTrader - tradersPerPage;

  // When loading (or no data) we create an array of "empty" rows.
  const displayRows = loading ? new Array(tradersPerPage).fill(null) : sortedTraders.slice(indexOfFirstTrader, indexOfLastTrader);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto overflow-y-auto bg-[#11121B] relative scrollbar-custom">
          <Table
            className="table-fixed 
              min-w-[1000px] sm:min-w-[1200px] md:min-w-[1500px]
              text-xs sm:text-sm md:text-base"
          >
            <TableHeader className="bg-[#25223D] z-10 h-8 sm:h-10 md:h-12">
              <TableRow className="border-b border-[#23242C]">
                {/* Rank column */}
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
                      direction={
                        sortConfig.key === "followers" 
                          ? sortConfig.direction 
                          : undefined
                      } 
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
                    <SortIcon direction={sortConfig.key === "tokens" ? sortConfig.direction : undefined} />
                  </div>
                </TableHead>
                {/* Win Rate */}
                <TableHead
                  onClick={() => handleSort("winRate")}
                  className="w-[80px] sm:w-[90px] text-right whitespace-nowrap px-2 text-white cursor-pointer"
                >
                  <div className="flex items-center justify-end gap-1">
                    Win Rate
                    <SortIcon direction={sortConfig.key === "winRate" ? sortConfig.direction : undefined} />
                  </div>
                </TableHead>
                {/* Trades */}
                <TableHead
                  onClick={() => handleSort("tradesTotal")}
                  className="w-[80px] sm:w-[100px] text-right whitespace-nowrap px-2 text-white cursor-pointer"
                >
                  <div className="flex items-center justify-end gap-1">
                    Trades
                    <SortIcon direction={sortConfig.key === "tradesTotal" ? sortConfig.direction : undefined} />
                  </div>
                </TableHead>
                {/* Avg Buy */}
                <TableHead
                  onClick={() => handleSort("avgBuy")}
                  className="w-[80px] sm:w-[100px] text-right whitespace-nowrap px-2 text-white cursor-pointer"
                >
                  <div className="flex items-center justify-end gap-1">
                    Avg Buy
                    <SortIcon direction={sortConfig.key === "avgBuy" ? sortConfig.direction : undefined} />
                  </div>
                </TableHead>
                {/* Avg Entry */}
                <TableHead
                  onClick={() => handleSort("avgEntry")}
                  className="w-[80px] sm:w-[100px] text-right whitespace-nowrap px-2 text-white cursor-pointer"
                >
                  <div className="flex items-center justify-end gap-1">
                    Avg Entry
                    <SortIcon direction={sortConfig.key === "avgEntry" ? sortConfig.direction : undefined} />
                  </div>
                </TableHead>
                {/* Avg Hold */}
                <TableHead
                  onClick={() => handleSort("avgHold")}
                  className="w-[100px] sm:w-[120px] text-right whitespace-nowrap px-2 text-white cursor-pointer"
                >
                  <div className="flex items-center justify-end gap-1">
                    Avg Hold
                    <SortIcon direction={sortConfig.key === "avgHold" ? sortConfig.direction : undefined} />
                  </div>
                </TableHead>
                {/* Realized PNL */}
                <TableHead
                  onClick={() => handleSort("realizedPNL")}
                  className="w-[120px] sm:w-[150px] text-right whitespace-nowrap px-2 text-white cursor-pointer"
                >
                  <div className="flex items-center justify-end gap-1">
                    Realized PNL
                    <SortIcon fill="#CCAD59" direction={sortConfig.key === "realizedPNL" ? sortConfig.direction : undefined} />
                  </div>
                </TableHead>
                {/* Share */}
                <TableHead className="w-[60px] sm:w-[80px] text-center whitespace-nowrap px-2 text-white">
                  Share
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRows.map((trader, index) => {
                // Compute the global rank regardless of data availability.
                const globalRank = indexOfFirstTrader + index + 1;
                return (
                  <TableRow
                    key={trader ? trader.address : index}
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
                        <Link href={`/trader/${trader.address}`} className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10">
                            <AvatarImage src={trader.avatar} alt={trader.name} />
                            <AvatarFallback>{trader.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col whitespace-nowrap">
                            <span className="font-medium hover:text-[#aa00ff] text-xs sm:text-sm md:text-base">
                              {trader.name}
                            </span>
                            <span className="text-[10px] sm:text-xs md:text-sm text-[#858585] font-extralight">
                              {trader.address}
                            </span>
                          </div>
                        </Link>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                    {/* Followers */}
                    <TableCell className="w-[100px] sm:w-[125px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                      {trader ? (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold">{trader.followers}K</span>
                          <span className="text-[#858585] text-xs font-extralight">{trader.handle}</span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                    {/* Tokens */}
                    <TableCell className="w-[110px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                      {trader ? trader.tokens : <span>-</span>}
                    </TableCell>
                    {/* Win Rate */}
                    <TableCell className="w-[80px] sm:w-[90px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                      {trader ? `${trader.winRate}%` : <span>-</span>}
                    </TableCell>
                    {/* Trades */}
                    <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                      {trader ? (
                        <>
                          <span className="text-[#59cc6c] font-bold">
                            {trader.trades.split("/")[0]}
                          </span>
                          <span className="text-[#858585]">/</span>
                          <span className="text-[#CC5959]">
                            {trader.trades.split("/")[1]}
                          </span>
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                    {/* Avg Buy */}
                    <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                      {trader ? (
                        <>
                          {trader.avgBuy.value}{" "}
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-EwjxE5rUhSoNSk5kZC7K3W0N5czTxo.svg"
                            alt="SOL"
                            width={16}
                            height={16}
                            className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                          />
                        </>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                    {/* Avg Entry */}
                    <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                      {trader ? trader.avgEntry : <span>-</span>}
                    </TableCell>
                    {/* Avg Hold */}
                    <TableCell className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 overflow-hidden p-1 sm:p-2 md:p-3">
                      {trader ? trader.avgHold : <span>-</span>}
                    </TableCell>
                    {/* Realized PNL */}
                    <TableCell className="w-[120px] sm:w-[150px] text-right whitespace-nowrap pr-4 overflow-hidden p-1 sm:p-2 md:p-3">
                      {trader ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <div className="flex items-center gap-1 text-sm font-bold">
                            <span className="text-[#59cc6c]">
                              +{trader.realizedPNL.value}
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
                            ${trader.realizedPNL.usd}
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
      <div className="flex-shrink-0 flex justify-between items-center py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-t border-[#464558]">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          variant="outline"
          className="bg-[#25223D] text-white border-[#464558] hover:bg-[#464558] h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
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
          className="bg-[#25223D] text-white border-[#464558] hover:bg-[#464558] h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
        >
          Next
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
        </Button>
      </div>
    </div>
  );
}

