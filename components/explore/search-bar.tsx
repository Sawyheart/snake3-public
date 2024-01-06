"use client"
import { cn } from '@/lib/util'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function SearchBar() {
  const router = useRouter()

  const submitHandler = (formData: FormData) => {
    if(!formData.get("search")) return
    router.push(`explore?search_result=${formData.get("search")}`)
  }

  return (
    <form className={cn("explore_search_bar", "text-zinc-700 shadow-[4px_4px_0_#000a] z-50")} action={submitHandler}>
      <span className="absolute -z-10 w-full h-full ml-3 bg-[url('../public/assets/empty_canvas_nav.svg')] bg-[length:130px] bg-[20px]" />
      <span className="group relative w-9 hover:w-12 px-1 flex items-center mr-[10px] border-r-2 border-black rounded-xl rounded-r-none bg-zinc-800 default_transition">
        <Image className="opacity-50 group-hover:opacity-100 default_transition" src={"/./assets/search_icon.svg"} alt="search" width={55} height={55} />
        <input className="absolute cursor-pointer left-0 w-full h-full" type="submit" value=" "/>
      </span>
      <input className="bg-transparent outline-none w-full" type="text" name="search" autoComplete="off" placeholder="SnakeID or address" /* ref={inputRef} *//>
    </form>
  )
}
