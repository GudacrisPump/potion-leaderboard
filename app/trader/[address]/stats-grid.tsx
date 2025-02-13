import Image from "next/image"

interface TraderStats {
  tokens: number
  avgBuy: { value: number; usd: number }
  totalInvested: { value: number; usd: number }
  winRate: number
  avgEntry: string
  roi: number
  trades: { wins: number; total: number }
  avgHold: string
  realizedPNL: { value: number; usd: number }
}

const dummyData: TraderStats = {
  tokens: 104,
  avgBuy: { value: 10.2, usd: 2346 },
  totalInvested: { value: 100.2, usd: 23460 },
  winRate: 74,
  avgEntry: "$212K",
  roi: 304,
  trades: { wins: 201, total: 321 },
  avgHold: "32",
  realizedPNL: { value: 301.3, usd: 69420 },
}

export function StatsGrid() {
  const stats = dummyData

  return (
    <div className="grid grid-cols-3">
      {/* Tokens */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-r border-b border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Tokens</div>
            <div className="text-right">
              <div className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">{stats.tokens}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Average Buy */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-r border-b border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Average Buy</div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">{stats.avgBuy.value}</span>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-ljZ0Ls99wSMA4rHjPOt21BjznDTkok.svg"
                  alt="SOL"
                  width={16}
                  height={16}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-[12px] text-[#858585]">${stats.avgBuy.usd}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Invested */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-b border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Total Invested</div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">
                  {stats.totalInvested.value}
                </span>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-ljZ0Ls99wSMA4rHjPOt21BjznDTkok.svg"
                  alt="SOL"
                  width={16}
                  height={16}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-[12px] text-[#858585]">
                ${stats.totalInvested.usd}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Win Rate */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-r border-b border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Win Rate</div>
            <div className="text-right">
              <div className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight text-[#59cc6c]">
                {stats.winRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Average Entry */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-r border-b border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Average Entry</div>
            <div className="text-right">
              <div className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">{stats.avgEntry}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-b border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">ROI</div>
            <div className="text-right">
              <div className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight text-[#59cc6c]">
                +{stats.roi}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trades */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-r border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Trades</div>
            <div className="text-right flex items-center">
              <span className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight text-[#59cc6c]">
                {stats.trades.wins}
              </span>
              <span className="text-[10px] sm:text-[12px] md:text-[14px] text-[#858585] mx-0.5">/</span>
              <span className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight text-[#CC5959]">
                {stats.trades.total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Average Hold */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-r border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Average Hold</div>
            <div className="text-right">
              <div className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">{stats.avgHold}m</div>
            </div>
          </div>
        </div>
      </div>

      {/* Realized PNL */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Realized PNL</div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-1">
                <span className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight text-[#59cc6c]">
                  +{stats.realizedPNL.value}
                </span>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-ljZ0Ls99wSMA4rHjPOt21BjznDTkok.svg"
                  alt="SOL"
                  width={16}
                  height={16}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-[12px] text-[#858585]">${stats.realizedPNL.usd}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

