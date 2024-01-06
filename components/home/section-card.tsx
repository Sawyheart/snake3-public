import { cn } from "@/lib/util"
import Link from "next/link"
import { HTMLProps } from "react"

type SectionCardProperties = {
  cardTitle: "play" | "gallery" | "explore",
  cardText: React.ReactNode,
  children?: React.ReactNode,
  className?: HTMLProps<HTMLElement>["className"],
}

const ROTATE_VALUE = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2","rotate-3", "-rotate-3", "rotate-6", "-rotate-6",]

export default function SectionCard({ cardTitle, cardText, children, className }: SectionCardProperties) {
  return(
    <section className={cn(
      "section_card group cursor-pointer flex flex-col items-center justify-between overflow-y-hidden",
      ROTATE_VALUE[Math.floor(Math.random() * ROTATE_VALUE.length)],
      className
    )} tabIndex={0}>
      
      <div className={cn("card_title text-zinc-800 group-hover:scale-[1.25] default_transition")}>
        {cardTitle.toLocaleUpperCase()}
      </div>
      <div className={cn("card_text text-zinc-800")}>
        {cardText}
      </div>
      <Link href={"/"+cardTitle} className="absolute left-0 top-0 w-full sm:h-full group-focus-within:h-full"></Link>
    </section>
  )
}