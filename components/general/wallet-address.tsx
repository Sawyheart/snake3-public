"use client"
import { useAddress } from '@thirdweb-dev/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'


export default function WalletAddress() {
  const address = useAddress()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams() 
  

  useEffect(() => {
    if(!address || (searchParams.get("address") && address === searchParams.get("address"))) return
    const params = new URLSearchParams(searchParams)
    params.set("address", address as string)
    router.replace(`${pathname}?${params.toString()}`)
  }, [address, searchParams.get("address")])

  return null
}
