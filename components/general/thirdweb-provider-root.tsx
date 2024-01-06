"use client"
import { ThirdwebProvider, ChainId, ConnectWallet } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";


export default function ThirdwebProviderRoot({ children, }: {children: React.ReactNode}) {
  return(
    <ThirdwebProvider clientId={"b4b761bb07c794e8276be1cb8a89bc82"} activeChain={ChainId.Mumbai}>
      {children}
    </ThirdwebProvider>
  )
}