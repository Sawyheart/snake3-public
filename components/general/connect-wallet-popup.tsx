"use client"
import { cn } from '@/lib/util'
import { useAddress } from '@thirdweb-dev/react'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function ConnectWalletPopup() {
  const address = useAddress()
  const pathname = usePathname()

  return (
    <div className={cn(
      "pointer-events-none fixed top-0 h-screen w-full flex justify-center items-center text-slate-200 bg-zinc-800/50 backdrop-blur-[5px] opacity-0 default_transition_50", 
      {"opacity-1 pointer-events-auto": !address && pathname.length > 1 && !pathname.includes("explore")}
      )}>
      CONNECT YOUR WALLET!
    </div> 
  )
}
