import { Header } from "@/components/header"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Home() {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen w-screen bg-[#060611] text-white">
        <Header />
        <main className="flex-1 flex flex-col px-2 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6">
          <LeaderboardTable />
        </main>
      </div>
    </TooltipProvider>
  );
}

