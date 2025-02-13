"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Share2, Waves } from "lucide-react"

interface Token {
  name: string
  symbol: string
  avatar: string
  address: string
  lastTrade: string
  mc: string
  invested: { value: number; usd: number }
  realizedPNL: { value: number; usd: number }
  roi: number
  trades: string
  holding: { value: number; usd: number }
  avgBuy: string
  avgSell: string
  held: string
}

const tokens: Token[] = [
  {
    name: "ORANGIE",
    symbol: "ORNG",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orangie.jpg-X6YaR1BIWidE4CTmLTuPEz0rh70m7E.jpeg",
    address: "6sdE9C...dDpump",
    lastTrade: "2 min",
    mc: "279K",
    invested: { value: 10.2, usd: 2346 },
    realizedPNL: { value: 101.2, usd: 23276 },
    roi: 74,
    trades: "2/8",
    holding: { value: 1.2, usd: 246 },
    avgBuy: "$69K",
    avgSell: "$225K",
    held: "3 min",
  },
  // Add more tokens as needed
]

export function TokensTable() {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-[900px] px-4 sm:px-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#464558]">
              <TableHead>Token</TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  Last Trade <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  MC <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  Invested <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  Realized PNL <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  ROI <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  Trades <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  Holding <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  Avg Buy <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  Avg Sell <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  Held <ArrowUpDown size={16} />
                </div>
              </TableHead>
              <TableHead>Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.address} className="border-b border-[#464558]">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={token.avatar} alt={token.name} />
                      <AvatarFallback>{token.symbol[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{token.name}</span>
                      <span className="text-sm text-[#858585]">{token.address}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{token.lastTrade}</TableCell>
                <TableCell>{token.mc}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {token.invested.value} <Waves className="w-4 h-4 text-blue-400" />
                    <span className="text-[#858585]">${token.invested.usd}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-[#59cc6c]">+{token.realizedPNL.value}</span>
                    <Waves className="w-4 h-4 text-blue-400" />
                    <span className="text-[#858585]">${token.realizedPNL.usd}</span>
                  </div>
                </TableCell>
                <TableCell className="text-[#59cc6c]">{token.roi}%</TableCell>
                <TableCell>{token.trades}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {token.holding.value} <Waves className="w-4 h-4 text-blue-400" />
                    <span className="text-[#858585]">${token.holding.usd}</span>
                  </div>
                </TableCell>
                <TableCell>{token.avgBuy}</TableCell>
                <TableCell>{token.avgSell}</TableCell>
                <TableCell>{token.held}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#aa00ff] hover:text-[#aa00ff] hover:bg-[#aa00ff]/20"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

