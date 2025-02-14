import Image from "next/image"

interface StatsGridProps {
  trader: {
    buys: number;
    sells: number;
    invested_sol: number;
    invested_sol_usd: number;
    realized_pnl: number;
    realized_pnl_usd: number;
    roi: number;
    avg_entry_usd: number;
    first_trade: string;
    last_trade: string;
  };
  timeInterval?: TimeInterval;
}

export function StatsGrid({ trader, timeInterval = "all-time" }: StatsGridProps) {
  const calculateWinRate = (trader: { buys: number; sells: number }) => {
    const totalTrades = trader.buys + trader.sells;
    return totalTrades > 0 ? (trader.buys / totalTrades) * 100 : 0;
  };

  const calculateHoldTime = (firstTrade: string, lastTrade: string) => {
    const start = new Date(firstTrade);
    const end = new Date(lastTrade);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  };

  return (
    <div className="grid grid-cols-3">
      {/* First row */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-r border-b border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Tokens</div>
            <div className="text-right">
              <div className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">
                {trader.buys + trader.sells}
              </div>
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
                <span className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">{trader.invested_sol.toFixed(2)}</span>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20(500%20x%20400%20px)%20(1)-ljZ0Ls99wSMA4rHjPOt21BjznDTkok.svg"
                  alt="SOL"
                  width={16}
                  height={16}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] md:text-[12px] text-[#858585]">${trader.invested_sol_usd.toLocaleString()}</span>
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
                  {trader.invested_sol.toFixed(2)}
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
                ${trader.invested_sol_usd.toLocaleString()}
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
                {calculateWinRate(trader)}%
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
              <div className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">{trader.avg_entry_usd.toFixed(2)}</div>
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
                +{trader.roi}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trades */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-r border-b border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Trades</div>
            <div className="text-right">
              <div className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">
                <span className="text-[#59cc6c]">{trader.buys}</span>
                <span className="text-[#858585] mx-1">/</span>
                <span className="text-[#CC5959]">{trader.sells}</span>
              </div>
              <div className="text-[8px] sm:text-[10px] md:text-[12px] text-[#858585]">
                {trader.buys + trader.sells} total
              </div>
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
              <div className="text-[10px] sm:text-[12px] md:text-[14px] font-extralight">
                {calculateHoldTime(trader.first_trade, trader.last_trade)} days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Realized PNL */}
      <div className="bg-[#11121B] p-2 sm:p-3 md:p-4 h-[60px] sm:h-[66px] md:h-[72px] border-[#23242C]">
        <div className="flex flex-col justify-center h-full w-full">
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] sm:text-[12px] md:text-[14px] font-normal text-white">Realized PNL</div>
            <div className="text-right">
              <div className={`text-[10px] sm:text-[12px] md:text-[14px] font-extralight ${trader.realized_pnl >= 0 ? 'text-[#59cc6c]' : 'text-[#CC5959]'}`}>
                {trader.realized_pnl.toFixed(2)} SOL
              </div>
              <div className="text-[8px] sm:text-[10px] md:text-[12px] text-[#858585]">
                ${trader.realized_pnl_usd.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

