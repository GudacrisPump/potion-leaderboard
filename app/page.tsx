import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sliders } from "lucide-react"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Home() {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen w-screen bg-[#060611] text-white">
        <Header />

        <main className="flex-1 flex flex-col px-2 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="flex flex-wrap items-center justify-between gap-1 xs:gap-2 sm:gap-3 md:gap-4 mb-2 xs:mb-3 sm:mb-4 font-[200] text-xs sm:text-sm md:text-base lg:text-sm">
            <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2">
              <Button
                variant="secondary"
                className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-8 px-1.5 xs:px-2 sm:px-3 md:px-4 lg:px-3 text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-sm rounded-full border border-[#464558] bg-[#23242c] text-white hover:bg-[#464558] font-extralight"
              >
                Traders
              </Button>
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-8 px-1.5 xs:px-2 sm:px-3 md:px-4 lg:px-3 text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-sm rounded-full text-[#858585] hover:text-[#858585] hover:bg-transparent font-extralight"
                >
                  Groups
                </Button>
                <div className="absolute top-full left-0 px-1 xs:px-1.5 py-0.5 bg-[#25223d] text-white text-[8px] xs:text-[10px] sm:text-xs lg:text-[10px] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  coming soon...
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2">
              <Button
                variant="secondary"
                className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-8 px-1.5 xs:px-2 sm:px-3 md:px-4 lg:px-3 text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-sm rounded-full border border-[#464558] bg-[#23242c] text-white hover:bg-[#464558] font-extralight"
              >
                Daily
              </Button>
              <Button
                variant="ghost"
                className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-8 px-1.5 xs:px-2 sm:px-3 md:px-4 lg:px-3 text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-sm rounded-full text-[#858585] hover:text-white hover:bg-[#464558] font-extralight"
              >
                Weekly
              </Button>
              <Button
                variant="ghost"
                className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-8 px-1.5 xs:px-2 sm:px-3 md:px-4 lg:px-3 text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-sm rounded-full text-[#858585] hover:text-white hover:bg-[#464558] font-extralight"
              >
                Monthly
              </Button>
              <Button
                variant="ghost"
                className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-8 px-1.5 xs:px-2 sm:px-3 md:px-4 lg:px-3 text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-sm rounded-full text-[#858585] hover:text-white hover:bg-[#464558] font-extralight"
              >
                All-Time
              </Button>
            </div>

            <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-3 w-full xl:w-auto mt-2 md:mt-0">
              <div className="relative flex-grow w-full xl:w-[600px]">
                <svg
                  className="absolute left-1.5 xs:left-2 sm:left-2.5 md:left-3 lg:left-2.5 top-1/2 transform -translate-y-1/2 h-2.5 xs:h-3 sm:h-3.5 md:h-4 lg:h-3.5 w-2.5 xs:w-3 sm:w-3.5 md:w-4 lg:w-3.5 text-[#858585]"
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
                <Input
                  type="search"
                  placeholder="Search by name or wallet"
                  className="w-full h-6 xs:h-7 sm:h-8 md:h-9 lg:h-8 xl:h-10 bg-[#060611] border-[#464558] border rounded-full text-white placeholder-[#858585] text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-sm xl:text-base font-[200] pl-6 xs:pl-7 sm:pl-8 md:pl-10 lg:pl-8 xl:pl-12 pr-1.5 xs:pr-2 sm:pr-2.5 md:pr-3 lg:pr-2.5 xl:pr-4"
                />
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-8 w-[53px] bg-[#23242c] text-white hover:bg-[#464558] rounded-full border border-[#464558] flex-shrink-0"
              >
                <Sliders className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-3.5 lg:w-3.5" />
              </Button>
            </div>
          </div>

          {/* Only the table should scroll */}
          <div className="flex-1">
            <LeaderboardTable />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

