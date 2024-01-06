"use client"
import { cn } from '@/lib/util'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

export default function Modal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.delete("loading")
    router.replace(`${pathname}?${params.toString()}`)
  }, [])

  return (
    <dialog className={cn(
      "pointer-events-none fixed w-full h-full z-50 flex flex-col items-center justify-center gap-4 bg-transparent backdrop-blur-[5px] opacity-0 default_transition_50",
      {"opacity-1 pointer-events-auto": searchParams.get("loading")}
    )} ref={dialogRef}>
      {/* <div className="rounded-full bg-black/30">
      </div> */}
      <Image src={"/./assets/loading.svg"} alt="home" width={100} height={100} />
      { searchParams.get("loading") === "yy" &&
        <>
          <div className="select-none bg-[#bbb] rounded-md px-2 py-[2px] shadow-[2px_2px_1px_#000a] hover:text-slate-700 default_transition">
            <strong>CHECK YOUR <span className={cn("bg-white px-2 ml-1 rounded-md text-black")}>WALLET</span></strong>
          </div>
          <div className="absolute translate-y-[92px] text-sm select-none bg-[#bbb] rounded-md px-2 py-[2px] shadow-[2px_2px_1px_#000a] hover:text-slate-700 default_transition">
            <strong>...waiting for<span className={cn("bg-white px-1 ml-1 rounded-md text-black")}>confirmation</span></strong>
          </div>
        </>
      }
    </dialog>
  )
}
