"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

export function Header() {
  return (
    <TooltipProvider>
      <header className="w-full h-16 sm:h-20 md:h-24 bg-[#060611]">
        <div className="h-full px-4 sm:px-6 md:px-8 w-full">
          <div className="flex items-center justify-between h-full w-full">
            {/* Left side: Logo & Navigation */}
            <div className="flex items-center gap-24">
              <Link
                href="/"
                className="relative w-[140px] xs:w-[180px] sm:w-[220px] md:w-[254px] h-[36px] xs:h-[46px] sm:h-[56px] md:h-[67px]"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/J6yeS6ZH-82mF0LAapCPe9oPetkfiT8Sx200966.png"
                  alt="Potion Leaderboard"
                  className="w-full h-full object-contain"
                />
              </Link>

              <nav className="hidden lg:flex items-center gap-16">
                <Link
                  href="/leaderboards"
                  className="font-normal text-sm sm:text-base md:text-lg text-[#ffffff] hover:text-[#aa00ff]"
                >
                  Leaderboards
                </Link>
                <Link
                  href="https://docs.potionleaderboard.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-normal text-sm sm:text-base md:text-lg text-[#ffffff] hover:text-[#aa00ff]"
                >
                  Learn
                </Link>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-not-allowed font-normal text-sm sm:text-base md:text-lg text-[#ffffff]">
                      Prizes
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming soon</p>
                  </TooltipContent>
                </Tooltip>
              </nav>
            </div>

            {/* Right side: Social Icons, Avatar & Mobile Menu */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              <div className="hidden lg:flex items-center gap-6">
                <Link href="#" className="text-[#858585] hover:text-[#ffffff]">
                  <svg viewBox="0 0 30 30" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current">
                    <path d="M26.37,26l-8.795,-12.822l0.015,0.012l7.93,-9.19h-2.65l-6.46,7.48l-5.13,-7.48h-6.95l8.211,11.971l-0.001,-0.001l-8.66,10.03h2.65l7.182,-8.322l5.708,8.322zM10.23,6l12.34,18h-2.1l-12.35,-18z" />
                  </svg>
                </Link>
                <Link href="#" className="text-[#858585] hover:text-[#ffffff]">
                  <svg viewBox="0 0 30 30" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current">
                    <path d="M25.12,7.48c-1.96-0.91-4.06-1.58-6.25-1.96c-0.27,0.49-0.59,1.14-0.81,1.66c-2.32-0.35-4.62-0.35-6.9,0 c-0.22-0.52-0.54-1.17-0.82-1.66c-2.19,0.38-4.29,1.05-6.25,1.96c-3.95,5.95-5.02,11.76-4.49,17.5c2.62,1.96,5.16,3.15,7.67,3.93 c0.62-0.85,1.17-1.75,1.65-2.71c-0.91-0.34-1.77-0.76-2.58-1.24c0.22-0.16,0.43-0.33,0.63-0.5c4.97,2.33,10.37,2.33,15.27,0 c0.21,0.17,0.42,0.34,0.63,0.5c-0.82,0.49-1.68,0.91-2.59,1.24c0.48,0.96,1.03,1.86,1.65,2.71c2.51-0.78,5.05-1.97,7.67-3.93 C30.15,19.24,29.07,13.43,25.12,7.48z M10.46,21.03c-1.49,0-2.72-1.38-2.72-3.08c0-1.7,1.2-3.08,2.72-3.08 c1.52,0,2.74,1.39,2.72,3.08C13.18,19.65,12.01,21.03,10.46,21.03z M19.54,21.03c-1.49,0-2.72-1.38-2.72-3.08 c0-1.7,1.2-3.08,2.72-3.08c1.52,0,2.74,1.39,2.72,3.08C22.26,19.65,21.09,21.03,19.54,21.03z" />
                  </svg>
                </Link>
              </div>
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                <AvatarImage
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orangie.jpg-X6YaR1BIWidE4CTmLTuPEz0rh70m7E.jpeg"
                  alt="User"
                />
                <AvatarFallback>O</AvatarFallback>
              </Avatar>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-[#ffffff]">
                    <Menu className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 bg-[#11121b] p-0">
                  <nav className="flex flex-col gap-4 p-4">
                    <Link
                      href="/leaderboards"
                      className="font-normal text-sm sm:text-base md:text-lg text-[#ffffff] hover:text-[#aa00ff]"
                    >
                      Leaderboards
                    </Link>
                    <Link
                      href="https://docs.potionleaderboard.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-normal text-sm sm:text-base md:text-lg text-[#ffffff] hover:text-[#aa00ff]"
                    >
                      Learn
                    </Link>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-not-allowed font-normal text-sm sm:text-base md:text-lg text-[#ffffff]">
                          Prizes
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Coming soon</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="flex gap-4 mt-4">
                      <Link href="#" className="text-[#858585] hover:text-[#ffffff]">
                        <svg viewBox="0 0 30 30" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current">
                          <path d="M26.37,26l-8.795,-12.822l0.015,0.012l7.93,-9.19h-2.65l-6.46,7.48l-5.13,-7.48h-6.95l8.211,11.971l-0.001,-0.001l-8.66,10.03h2.65l7.182,-8.322l5.708,8.322zM10.23,6l12.34,18h-2.1l-12.35,-18z" />
                        </svg>
                      </Link>
                      <Link href="#" className="text-[#858585] hover:text-[#ffffff]">
                        <svg viewBox="0 0 30 30" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current">
                          <path d="M25.12,7.48c-1.96-0.91-4.06-1.58-6.25-1.96c-0.27,0.49-0.59,1.14-0.81,1.66c-2.32-0.35-4.62-0.35-6.9,0 c-0.22-0.52-0.54-1.17-0.82-1.66c-2.19,0.38-4.29,1.05-6.25,1.96c-3.95,5.95-5.02,11.76-4.49,17.5c2.62,1.96,5.16,3.15,7.67,3.93 c0.62-0.85,1.17-1.75,1.65-2.71c-0.91-0.34-1.77-0.76-2.58-1.24c0.22-0.16,0.43-0.33,0.63-0.5c4.97,2.33,10.37,2.33,15.27,0 c0.21,0.17,0.42,0.34,0.63,0.5c-0.82,0.49-1.68,0.91-2.59,1.24c0.48,0.96,1.03,1.86,1.65,2.71c2.51-0.78,5.05-1.97,7.67-3.93 C30.15,19.24,29.07,13.43,25.12,7.48z M10.46,21.03c-1.49,0-2.72-1.38-2.72-3.08c0-1.7,1.2-3.08,2.72-3.08 c1.52,0,2.74,1.39,2.72,3.08C13.18,19.65,12.01,21.03,10.46,21.03z M19.54,21.03c-1.49,0-2.72-1.38-2.72-3.08 c0-1.7,1.2-3.08,2.72-3.08c1.52,0,2.74,1.39,2.72,3.08C22.26,19.65,21.09,21.03,19.54,21.03z" />
                        </svg>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}

