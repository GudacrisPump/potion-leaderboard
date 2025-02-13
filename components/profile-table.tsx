"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Share2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ProfileTableProps {
  trader: {
    token_name: string;
    token_address: string;
    last_trade: string;
    invested_sol: number;
    invested_sol_usd: number;
    realized_pnl: number;
    realized_pnl_usd: number;
    roi: number;
    buys: number;
    sells: number;
    name?: string;
    avatar?: string;
  };
}

export function ProfileTable({ trader }: ProfileTableProps) {
  const defaultAvatar = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avatar-placeholder-RU7CnlBGBrQYzHRc6PZqBPqFOlKEOK.png";
  const defaultName = "Anonymous Trader";

  const truncateAddress = (address: string) => {
    if (!address) return '';
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  return (
    <div className="rounded-lg border border-[#464558] bg-[#11121B] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#464558] hover:bg-transparent">
            <TableHead className="text-left">Token</TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer">
                Last Trade <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer">
                Invested <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer">
                PNL <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer">
                ROI <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Trades</TableHead>
            <TableHead>Share</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b border-[#464558] hover:bg-[#1a1b26]">
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={trader.avatar || defaultAvatar} />
                  <AvatarFallback>{trader.token_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{trader.token_name}</span>
                  <span className="text-xs text-[#858585]">{truncateAddress(trader.token_address)}</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-sm">
              {new Date(trader.last_trade).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <span>{trader.invested_sol.toFixed(2)}</span>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-EwjxE5rUhSoNSk5kZC7K3W0N5czTxo.svg"
                  alt="SOL"
                  width={16}
                  height={16}
                  className="w-4 h-4 inline"
                />
                <span className="text-[#858585]">${trader.invested_sol_usd.toLocaleString()}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <span className={trader.realized_pnl >= 0 ? "text-[#59cc6c]" : "text-[#CC5959]"}>
                  {trader.realized_pnl >= 0 ? "+" : ""}{trader.realized_pnl.toFixed(2)}
                </span>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-EwjxE5rUhSoNSk5kZC7K3W0N5czTxo.svg"
                  alt="SOL"
                  width={16}
                  height={16}
                  className="w-4 h-4 inline"
                />
                <span className="text-[#858585]">${trader.realized_pnl_usd.toLocaleString()}</span>
              </div>
            </TableCell>
            <TableCell className={trader.roi >= 0 ? "text-[#59cc6c]" : "text-[#CC5959]"}>
              {trader.roi >= 0 ? "+" : ""}{trader.roi}%
            </TableCell>
            <TableCell>
              <span className="text-[#59cc6c]">{trader.buys}</span>
              <span className="text-[#858585] mx-1">/</span>
              <span className="text-[#CC5959]">{trader.sells}</span>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#aa00ff] hover:text-[#aa00ff] hover:bg-[#aa00ff]/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

