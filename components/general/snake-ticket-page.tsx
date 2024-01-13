"use client"
import { burnTicket, mintSnake } from '@/actions/smart_contract_actions'
import SnakeCanvasPage from '@/components/general/snake-canvas'
import { cn } from '@/lib/util'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { startTransition, useMemo, useState } from 'react'
import SmartContractButton from './smart-contract-button'
import Link from 'next/link'
import { Web3Button } from '@thirdweb-dev/react'

type SnakeTicketProps = {
  params: {
    ticketID: string,
  }
  snakeData?: string
}

const ROTATE_VALUE = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2","rotate-3", "-rotate-3"]

const SNAKE_INFOS = ["creator", "owner", "date", "colors"] as const

export default function SnakeTicketPage({ params: { ticketID }, snakeData }: SnakeTicketProps) {
  const [isLooping, setLoop] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const params = useSearchParams()

  const snakeInfos = useMemo(() => {
    return (
      <>
        <section className={cn("bg-[#bbb] rounded-md px-2 py-[2px] mr-20 shadow-[2px_2px_1px_#000a] hover:-translate-x-2 default_transition",)}>
          <strong>ID: <span className={cn("bg-white px-2 rounded-md")}>#{ticketID}</span></strong>
        </section>
        {SNAKE_INFOS.map((v, i) => {
          let paramsValue = params.get(v) as string

          if(v === "creator" || v === "owner") paramsValue = paramsValue.substring(0, 6) + "..." + paramsValue.substring(37)

          return (
            <section key={i} className={cn(
              "bg-[#bbb] whitespace-nowrap [&::-webkit-scrollbar]:[width:0] [&::-webkit-scrollbar]:[height:0] overflow-x-scroll  rounded-md px-2 py-[2px] shadow-[2px_2px_1px_#000a] hover:-translate-x-2 default_transition",
              {
                "mr-2": i === 0,
                "mr-6": i === 1,
                "mr-10": i === 2,
                "mr-4": i === 3,
              }
            )}>
              <strong>{v.toUpperCase()}: <span className={cn("bg-white px-2 ml-1 rounded-md")}>{paramsValue}</span></strong>
            </section>
          )
        })}
      </>
    )
  }, [params])

  return (
    <section className="w-full min-h-[100dvh] px-10 pb-28 pt-40 flex flex-col items-center justify-center gap-10">
      <SnakeCanvasPage ticketID={+ticketID} loop={isLooping} snake_data={snakeData}></SnakeCanvasPage>
      <div className="min-w-[min(400px,_100%)] flex justify-between items-center gap-8">
        <section id="replay-button" className="group round_button min-w-[64px] flex justify-center items-center" data-loop={isLooping ? "true" : ""} onClick={() => setLoop(!isLooping)}>
          <Image className={cn("default_transition", {"opacity-30": !isLooping})} src={"/./assets/loop_replay_button.svg"} alt="loop_button" width={40} height={40} />
        </section>
        {
          params.get("type") === "draft" 
          ? <section className="flex flex-wrap justify-center gap-7">
            <SmartContractButton funcDeclaration={{name: "mintSnake", args: [+ticketID], value: "2.5"}} newParams={[{key: "type", value: "minted"}]}>
              MINT
            </SmartContractButton>
            <SmartContractButton funcDeclaration={{name: "burnTicket", args: [+ticketID]}} redirect="/gallery">
              BURN
            </SmartContractButton>
          </section>
          : <Link href={"https://testnets.opensea.io/collection/snake3-30"} target="_blank" className={cn("button px-4 py-2 sm_text_format")}>
              OPEN IN OPENSEA
            </Link>
        }
        <section className="group round_button min-w-[64px]" onClick={() => setShowInfo(!showInfo)}>
          <div className="w-full h-full flex justify-center items-center rounded-full default_transition">
            <svg className={cn("default_transition", {"opacity-30": !showInfo})} xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox="0 0 10 10" shapeRendering="crispEdges">
            	<path d="M6,9 H5 V4 H4" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="4.75" cy="1.5" r="1" fill="white" />
            </svg>
          </div>
        </section>

      </div>
      { showInfo && <section className={cn("wide_card absolute flex flex-col justify-center gap-2 -translate-y-[52px]", /*ROTATE_VALUE[Math.floor(Math.random() * ROTATE_VALUE.length)]*/)}>
        <div className="absolute top-0 left-0 w-full h-full -z-10 backdrop-blur-[2px]" />
        {snakeInfos}
      </section>
      }
    </section>
  )
}
