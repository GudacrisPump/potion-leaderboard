"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Share2, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

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

export function ProfileTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const tokensPerPage = 15
  const totalPages = Math.ceil(tokens.length / tokensPerPage)

  const indexOfLastToken = currentPage * tokensPerPage
  const indexOfFirstToken = indexOfLastToken - tokensPerPage
  const currentTokens = tokens.slice(indexOfFirstToken, indexOfLastToken)

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto overflow-y-auto bg-[#11121B] relative">
          <Table className="min-w-[1500px] table-fixed">
            <TableHeader className="sticky top-0 bg-[#25223D] z-10">
              <TableRow className="border-b border-[#23242C]">
                <TableHead>Token</TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Last Trade <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    MC <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Invested <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Realized PNL <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    ROI <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Trades <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Holding <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Avg Buy <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Avg Sell <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Held <ChevronLeft size={16} />
                  </div>
                </TableHead>
                <TableHead>Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTokens.map((token) => (
                <TableRow key={token.address} className="border-b border-[#23242C] bg-[#11121B]">
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
                      {token.invested.value}{" "}
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-EwjxE5rUhSoNSk5kZC7K3W0N5czTxo.svg"
                        alt="SOL"
                        width={16}
                        height={16}
                        className="w-4 h-4 inline"
                      />
                      <span className="text-[#858585]">${token.invested.usd}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-[#59cc6c]">+{token.realizedPNL.value}</span>
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-EwjxE5rUhSoNSk5kZC7K3W0N5czTxo.svg"
                        alt="SOL"
                        width={16}
                        height={16}
                        className="w-4 h-4 inline"
                      />
                      <span className="text-[#858585]">${token.realizedPNL.usd}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#59cc6c]">{token.roi}%</TableCell>
                  <TableCell>{token.trades}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {token.holding.value}{" "}
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-EwjxE5rUhSoNSk5kZC7K3W0N5czTxo.svg"
                        alt="SOL"
                        width={16}
                        height={16}
                        className="w-4 h-4 inline"
                      />
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
      <div className="flex-shrink-0 flex justify-between items-center py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-t border-[#464558]">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          variant="outline"
          className="bg-[#25223D] text-[#ffffff] border-[#464558] hover:bg-[#464558] h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
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
          className="bg-[#25223D] text-[#ffffff] border-[#464558] hover:bg-[#464558] h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
        >
          Next
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
        </Button>
      </div>
    </div>
  )
}

