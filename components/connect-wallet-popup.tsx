"use client";

import { Button } from "@/components/ui/button";

interface ConnectWalletPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export function ConnectWalletPopup({ isOpen, onClose, onConnect }: ConnectWalletPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div 
        className="relative bg-[#11121B] w-[184px] h-[47px] rounded-[8px] flex items-center justify-center"
        style={{
          top: "1559px",
          left: "-138px",
          padding: "16px 30px"
        }}
      >
        <Button
          onClick={onConnect}
          className="w-full h-full text-white bg-[#aa00ff] hover:bg-[#aa00ff]/90 rounded-[8px] text-sm font-medium"
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  );
} 