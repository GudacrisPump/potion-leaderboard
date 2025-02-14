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
import { Share2, ChevronLeft, ChevronRight, Search, Sliders } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";

// Import the Trader interface from leaderboard
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

interface TraderTableProps {
  trader: Trader;
}

// Add utility functions at the top of the file
const formatAvgEntryAmount = (amount: number) => {
  if (!amount) return '$0';
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const formatUsdAmount = (amount: number) => {
  if (amount === 0) return '$0';
  if (amount < 0.01) return '<$0.01';
  if (amount < 1) return `$${amount.toFixed(2)}`;
  if (amount < 1000) return `$${amount.toFixed(2)}`;
  if (amount < 1000000) return `$${(amount / 1000).toFixed(1)}K`;
  if (amount < 1000000000) return `$${(amount / 1000000).toFixed(1)}M`;
  return `$${(amount / 1000000000).toFixed(1)}B`;
};

const formatSolAmount = (amount: number) => {
  if (amount === 0) return '0';
  if (Math.abs(amount) < 0.01) return '<0.01';
  if (Math.abs(amount) < 1) return amount.toFixed(2);
  if (Math.abs(amount) < 10) return amount.toFixed(2);
  if (Math.abs(amount) < 100) return amount.toFixed(1);
  return Math.round(amount).toString();
};

const formatHoldTime = (minutes: number) => {
  if (!minutes) return '0m';
  if (minutes < 60) return `${Math.round(minutes)}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
};

const truncateAddress = (address: string) => {
  if (!address) return '';
  const start = address.slice(0, 6);
  const end = address.slice(-4);
  return `${start}...${end}`;
};

export function TraderTable({ trader }: TraderTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const tradesPerPage = 20;
  const defaultAvatar = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar-placeholder-RU7CnlBGBrQYzHRc6PZqBPqFOlKEOK.png";

  // Add search handler
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  // Add console log to debug
  console.log('Trader Data in Table:', trader);

  return (
    <div className="flex flex-col h-full pb-2">
      {/* Top section with search and filters */}
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-0 xl:items-center xl:justify-between mb-6">
        {/* Top row - Contains Trades/Tokens/Groups buttons */}
        <div className="flex items-center justify-between xl:justify-start">
          {/* Left side - Trades/Tokens/Groups buttons */}
          <div className="flex items-center gap-2 xl:mr-8">
            <Button
              variant="secondary"
              className="h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-[10px] sm:text-xs md:text-sm rounded-full bg-[#25223d] text-white border border-[#464558] hover:bg-[#464558] font-extralight"
            >
              Trades
            </Button>
            <Button
              variant="ghost"
              className="h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 text-[10px] sm:text-xs md:text-sm rounded-full text-[#858585] hover:text-white hover:bg-[#464558] font-extralight"
            >
              Tokens
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
        </div>

        {/* Search and filter section */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 xl:w-[280px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
            <Input
              type="text"
              placeholder="Search by name or wallet"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-7 sm:h-8 md:h-9 pl-8 pr-4 bg-[#25223D] border-[#464558] text-[10px] sm:text-xs md:text-sm rounded-full placeholder:text-[#858585] focus-visible:ring-1 focus-visible:ring-[#aa00ff]"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full bg-[#25223D] border-[#464558] hover:bg-[#464558] hover:text-white"
          >
            <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>
      </div>

      {/* Table section */}
      <div className="w-full relative">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[1000px] sm:min-w-[1200px] md:min-w-[1500px] text-xs sm:text-sm md:text-base">
            <TableHeader className="bg-[#25223D] sticky top-0 z-10 h-8 sm:h-10 md:h-12">
              <TableRow className="border-b border-[#23242C]">
                <TableHead className="w-[160px] sm:w-[200px] text-left whitespace-nowrap px-2 text-white">Token</TableHead>
                <TableHead className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">Last Trade</TableHead>
                <TableHead className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">MC</TableHead>
                <TableHead className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">Invested</TableHead>
                <TableHead className="w-[120px] sm:w-[150px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">Realized PNL</TableHead>
                <TableHead className="w-[80px] sm:w-[90px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">ROI</TableHead>
                <TableHead className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">Trades</TableHead>
                <TableHead className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">Holding</TableHead>
                <TableHead className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">Avg Buy</TableHead>
                <TableHead className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">Avg Sell</TableHead>
                <TableHead className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3 text-white">Held</TableHead>
                <TableHead className="w-[60px] sm:w-[80px] text-center whitespace-nowrap pr-8 p-1 sm:p-2 md:p-3 text-white">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trader ? (
                <TableRow className="border-b border-[#23242C] bg-[#11121B] h-10 sm:h-12 md:h-14">
                  <TableCell className="w-[160px] sm:w-[200px] text-left whitespace-nowrap p-1 sm:p-2 md:p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10">
                        <AvatarImage src={trader?.avatar || defaultAvatar} />
                        <AvatarFallback>{trader?.token_name?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col whitespace-nowrap">
                        <span className="font-medium text-xs sm:text-sm md:text-base">{trader?.token_name || 'Unknown'}</span>
                        <span className="text-[10px] sm:text-xs md:text-sm text-[#858585] font-extralight">{truncateAddress(trader?.token_address || '')}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                    {trader?.last_trade ? new Date(trader.last_trade).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                    <span className="text-[#59cc6c] font-bold">{trader?.buys || 0}</span>
                    <span className="text-[#858585]">/</span>
                    <span className="text-[#CC5959]">{trader?.sells || 0}</span>
                  </TableCell>
                  <TableCell className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        <span>{formatSolAmount(trader?.invested_sol || 0)}</span>
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-EwjxE5rUhSoNSk5kZC7K3W0N5czTxo.svg"
                          alt="SOL"
                          width={16}
                          height={16}
                          className="inline w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                        />
                      </div>
                      <span className="text-[#858585] text-xs font-extralight">{formatUsdAmount(trader?.invested_sol_usd || 0)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[120px] sm:w-[150px] text-right whitespace-nowrap pr-4 overflow-hidden p-1 sm:p-2 md:p-3">
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <span className={`${(trader?.realized_pnl || 0) >= 0 ? 'text-[#59cc6c]' : 'text-[#CC5959]'}`}>
                          {(trader?.realized_pnl || 0) >= 0 ? '+' : '-'}{formatSolAmount(Math.abs(trader?.realized_pnl || 0))}
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
                        {formatUsdAmount(trader?.realized_pnl_usd || 0)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[80px] sm:w-[90px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                    {trader?.roi ? `${trader.roi.toFixed(2)}%` : '-'}
                  </TableCell>
                  <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                    <span className="text-[#59cc6c] font-bold">{trader?.buys || 0}</span>
                    <span className="text-[#858585]">/</span>
                    <span className="text-[#CC5959]">{trader?.sells || 0}</span>
                  </TableCell>
                  <TableCell className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                    {formatHoldTime(0)}
                  </TableCell>
                  <TableCell className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                    {formatAvgEntryAmount(trader?.avg_entry_usd || 0)}
                  </TableCell>
                  <TableCell className="w-[100px] sm:w-[120px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                    {formatAvgEntryAmount(trader?.avg_entry_usd || 0)}
                  </TableCell>
                  <TableCell className="w-[80px] sm:w-[100px] text-right whitespace-nowrap pr-4 p-1 sm:p-2 md:p-3">
                    {formatHoldTime(0)}
                  </TableCell>
                  <TableCell className="w-[60px] sm:w-[80px] text-center whitespace-nowrap pr-8 p-1 sm:p-2 md:p-3">
                    <Button variant="ghost" size="icon" className="text-[#aa00ff] hover:text-[#aa00ff] hover:bg-[#aa00ff]/20">
                      <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow className="border-b border-[#23242C] bg-[#11121B] h-10 sm:h-12 md:h-14">
                  <TableCell colSpan={12} className="text-center text-[#858585]">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 