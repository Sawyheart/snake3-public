"use client"
import { uploadContent } from "@/actions/smart_contract_actions"
import { useScroll } from "@/hooks/_general/useScroll"
import { cn } from "@/lib/util"
import { ConnectWallet, } from "@thirdweb-dev/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { startTransition, useRef } from "react"

export default function Header() {
  const pathname = usePathname()
  const navElementRef = useRef<HTMLElement>(null)
  const { value: scrollValue, direction: scrollDirection } = useScroll()

  const scrollToTop = (): void => navElementRef.current?.scrollTo({top: 0, behavior: "smooth"})

  return(
    <header className={cn("header hover:opacity-100", {"opacity-0": scrollValue >= 150})}>
      {/* <button className="button absolute left-1 top-0" onClick={() => startTransition(() => {uploadContent()})}>UPLOAD ANIMATION_URI</button> */}
      <nav className={cn("header_nav_bar", {"-translate-y-20 opacity-0": pathname === "/"})}>
        <Link href="/" className="group relative cursor-pointer sm:w-10 sm:hover:w-16 flex justify-center z-10 outline-dashed outline-4 outline-zinc-800 bg-zinc-800 default_transition">
          <Image className="select-none group-hover:translate-x-0 group-hover:rotate-0 group-active:scale-75 default_transition" src={"/./assets/home.svg"} alt="home" width={60} height={60} />
          <div className="absolute opacity-0 sm:opacity-75 w-full left-0 h-16 bg-zinc-800 rounded-full group-hover:opacity-0 default_transition" />
        </Link>
        <nav className={cn("header_nav ")} ref={navElementRef}>
          <Link href="/play" className={cn(pathname.includes("/play") ? "header_nav_selected_section" : "header_nav_section")} onClick={() => scrollToTop()}>
            PLAY
          </Link>
          <Link href="/gallery" className={cn(pathname.includes("/gallery") ? "header_nav_selected_section" : "header_nav_section")} onClick={() => scrollToTop()}>
            GALLERY
          </Link>
          <Link href="/explore" className={cn(pathname.includes("/explore") ? "header_nav_selected_section" : "header_nav_section")} onClick={() => scrollToTop()}>
            EXPLORE
          </Link>
        </nav>
      </nav>
      <div className={cn("header_title", {"scale-50 -translate-y-48 opacity-0": pathname !== "/"})}>
        <Image src={"/./assets/title.svg"} alt="title" height={100} width={300} />
      </div>
      <div className="absolute top-1 right-5">
        <ConnectWallet className={cn("connect_button before:py-1 before:content-['✘'] before:bg-red-600")} btnTitle=" " detailsBtn={() => 
          <button className={cn("connect_button  before:content-['✔'] before:bg-lime-500")} > 
          
          </button>
        } />
      </div>
    </header>
  )
}