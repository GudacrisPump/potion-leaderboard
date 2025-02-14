"use client";

import { useState } from "react";
import { Header } from "@/components/header"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Share2, Sliders } from "lucide-react"
import { StatsGrid } from "./stats-grid"
import { Input } from "@/components/ui/input"
import { ProfileTable } from "@/components/profile-table"
import { useTraders } from "@/contexts/TraderContext";

type TimeInterval = "daily" | "weekly" | "monthly" | "all-time";

export default function TraderProfile({ params }: { params: { wallet: string } }) {
  const { traders, loading } = useTraders();
  const [timeInterval, setTimeInterval] = useState<TimeInterval>("daily");
  const trader = traders.find(t => t.wallet === params.wallet);
  const defaultAvatar = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar-placeholder-RU7CnlBGBrQYzHRc6PZqBPqFOlKEOK.png";
  const defaultName = "Anonymous Trader";

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  if (!trader) {
    return <div className="flex items-center justify-center min-h-screen text-white">Trader not found</div>;
  }

  const truncateAddress = (address: string) => {
    if (!address) return '';
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  const getFilteredData = (trader: any, interval: TimeInterval) => {
    const now = new Date();
    const traderData = { ...trader }; // Create a copy to modify

    switch (interval) {
      case "daily":
        const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
        // Filter trades within last 24 hours
        return filterTraderDataByDate(traderData, oneDayAgo);
      
      case "weekly":
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        return filterTraderDataByDate(traderData, oneWeekAgo);
      
      case "monthly":
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return filterTraderDataByDate(traderData, oneMonthAgo);
      
      case "all-time":
      default:
        return traderData;
    }
  };

  const filterTraderDataByDate = (trader: any, startDate: Date) => {
    const lastTradeDate = new Date(trader.last_trade);
    if (lastTradeDate < startDate) {
      // No trades in this period
      return {
        ...trader,
        buys: 0,
        sells: 0,
        invested_sol: 0,
        invested_sol_usd: 0,
        realized_pnl: 0,
        realized_pnl_usd: 0,
        roi: 0
      };
    }
    return trader;
  };

  const filteredTrader = trader ? getFilteredData(trader, timeInterval) : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#060611] text-white">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <main className="px-2 sm:px-4 md:px-6 lg:px-8 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            <div className="w-full lg:w-[480px] flex flex-col">
              <div className="flex items-center mx-2 sm:mx-4 md:mx-0">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mr-4 sm:mr-5 md:mr-6">
                  <AvatarImage
                    src={trader.avatar || defaultAvatar}
                    alt={trader.name || defaultName}
                  />
                  <AvatarFallback>{(trader.name || defaultName)[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{trader.name || defaultName}</h1>
                  <div className="text-xs sm:text-sm md:text-base text-[#858585]">{truncateAddress(trader.wallet)}</div>
                </div>
              </div>

              <div className="flex-grow flex flex-col justify-end mt-4 sm:mt-6 md:mt-8">
                <div className="bg-[#11121B] p-3 sm:p-4 md:p-5 h-16 sm:h-18 md:h-20 border-b border-[#23242C]">
                  <div className="flex justify-between items-center h-full">
                    <div className="text-xs sm:text-sm md:text-base text-white">X Account</div>
                    <Link href={`https://x.com/${trader.name?.toLowerCase()}`} className="text-right hover:text-[#aa00ff]">
                      <div className="text-xs sm:text-sm md:text-base text-white">@{trader.name?.toLowerCase()}</div>
                      <div className="text-xs sm:text-sm text-[#858585]">{trader.followers}K followers</div>
                    </Link>
                  </div>
                </div>

                <div className="bg-[#11121B] p-3 sm:p-4 md:p-5 h-16 sm:h-18 md:h-20">
                  <div className="flex justify-between items-center h-full">
                    <div className="text-xs sm:text-sm md:text-base text-white">Last Trade</div>
                    <div className="flex items-center gap-1 sm:gap-2 text-white">
                      <span className="text-xs sm:text-sm md:text-base">
                        {new Date(trader.last_trade).toLocaleString()}
                      </span>
                      <span className="text-[#59cc6c]">
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-2 h-2 sm:w-3 sm:h-3 md:w-3 md:h-3"
                        >
                          <path d="M6 2.5L9.5 7H2.5L6 2.5Z" fill="currentColor" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <Button
                    variant={timeInterval === "daily" ? "secondary" : "ghost"}
                    className={`h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full ${
                      timeInterval === "daily"
                        ? "bg-[#25223d] text-white border border-[#464558] hover:bg-[#464558]"
                        : "text-[#858585] hover:text-white hover:bg-[#464558]"
                    } font-extralight text-[10px] sm:text-xs md:text-sm`}
                    onClick={() => setTimeInterval("daily")}
                  >
                    Daily
                  </Button>
                  <Button
                    variant={timeInterval === "weekly" ? "secondary" : "ghost"}
                    className={`h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full ${
                      timeInterval === "weekly"
                        ? "bg-[#25223d] text-white border border-[#464558] hover:bg-[#464558]"
                        : "text-[#858585] hover:text-white hover:bg-[#464558]"
                    } font-extralight text-[10px] sm:text-xs md:text-sm`}
                    onClick={() => setTimeInterval("weekly")}
                  >
                    Weekly
                  </Button>
                  <Button
                    variant={timeInterval === "monthly" ? "secondary" : "ghost"}
                    className={`h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full ${
                      timeInterval === "monthly"
                        ? "bg-[#25223d] text-white border border-[#464558] hover:bg-[#464558]"
                        : "text-[#858585] hover:text-white hover:bg-[#464558]"
                    } font-extralight text-[10px] sm:text-xs md:text-sm`}
                    onClick={() => setTimeInterval("monthly")}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={timeInterval === "all-time" ? "secondary" : "ghost"}
                    className={`h-7 sm:h-8 md:h-9 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full ${
                      timeInterval === "all-time"
                        ? "bg-[#25223d] text-white border border-[#464558] hover:bg-[#464558]"
                        : "text-[#858585] hover:text-white hover:bg-[#464558]"
                    } font-extralight text-[10px] sm:text-xs md:text-sm`}
                    onClick={() => setTimeInterval("all-time")}
                  >
                    All-Time
                  </Button>
                </div>
                <div className="flex items-center">
                  <span className="text-[#858585] font-extralight mr-1 text-[10px] sm:text-xs">
                    Last refreshed seconds ago
                  </span>
                  <Button variant="ghost" size="icon" className="text-[#858585] hover:text-white mr-1 sm:mr-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#aa00ff] hover:text-[#aa00ff] hover:bg-[#aa00ff]/20"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>

              <StatsGrid trader={filteredTrader} />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="h-8 px-4 rounded-full bg-[#25223d] text-white border-none hover:bg-[#464558]"
                >
                  Trades
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 px-4 rounded-full text-[#858585] hover:text-white hover:bg-[#464558]"
                >
                  Tokens
                </Button>
                <div className="relative group">
                  <Button
                    variant="ghost"
                    className="h-8 px-4 rounded-full text-[#858585] hover:text-[#858585] hover:bg-transparent"
                  >
                    Groups
                  </Button>
                  <div className="absolute top-1/2 right-0 transform translate-y-[-50%] translate-x-[-10%] px-1.5 py-0.5 bg-[#25223d] text-white text-[10px] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    coming soon...
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search by token or contract address"
                    className="w-[414px] h-[37px] bg-[#060611] border-[#464558] border rounded-[20px] text-white placeholder-[#858585] font-normal typography-button"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#858585]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <Button
                  variant="secondary"
                  className="bg-[#23242c] text-white hover:bg-[#464558] h-[37px] px-3 rounded-[20px] border border-[#464558]"
                >
                  <Sliders className="w-4 h-4" />
                  <div className="ml-2 bg-[#aa00ff] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    2
                  </div>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <ProfileTable trader={trader} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 