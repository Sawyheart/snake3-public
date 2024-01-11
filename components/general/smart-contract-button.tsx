"use client"
import { CONTRACT_ADDRESS, cn } from '@/lib/util'
import { useAddress, useContract } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { HTMLProps } from 'react'

type SmartContractButtonProps = (
  {smartContractFunc: () => Promise<any>, funcDeclaration?: never} 
  | { funcDeclaration: {name: string, args: any[], value?: string}, smartContractFunc?: never}
) & {
  newParams?: {key: string, value: string}[]
  redirect?: string
  children?: React.ReactNode,
  className?: HTMLProps<HTMLElement>["className"],
}

const OWNER_ADDRESS = "0x31389e8115AebcBC5Ae1d5CfDac45D1CDec652aF"


export default function SmartContractButton({ smartContractFunc, funcDeclaration, newParams, redirect, children, className }: SmartContractButtonProps) {
  const router = useRouter() 
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const contract = useContract(CONTRACT_ADDRESS)
  const address = useAddress()

  const SCFuncExecuter = () => {
    const params = new URLSearchParams(searchParams)
    params.set("loading", funcDeclaration ? "yy" : "y")
    router.replace(`${pathname}?${params.toString()}`)
    
    setTimeout(async () => {
      try {
        if(funcDeclaration) await contract.contract?.call(
          funcDeclaration.name,
          funcDeclaration.args,
          funcDeclaration.value && address !== OWNER_ADDRESS ? {value: ethers.utils.parseEther(funcDeclaration.value)} : undefined
        )
        else await smartContractFunc()
      }
      catch(e) {
        newParams = undefined
        redirect = undefined
      }
      if(redirect) router.replace(redirect)
      else {
        params.delete("loading")
        newParams?.forEach(p => params.set(p.key, p.value))
        router.replace(`${pathname}?${params.toString()}`)  
      }
    }, 100)
  }

  return (
    <button className={cn("button px-4 py-2 sm_text_format", className)} onClick={SCFuncExecuter}>
      {children}
    </button>
  )
}
