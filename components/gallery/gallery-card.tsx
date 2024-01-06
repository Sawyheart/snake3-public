// "use client"
import { cn } from '@/lib/util'
import React, { useEffect, useState } from 'react'
import { getSnakePathTags } from '@/actions/smart_contract_actions'
import Link from 'next/link'

type GalleryCardProps = {
  ownerAddress?: string,
  ticketID: number,
  ticketType: "draft" | "minted",
  route: "/gallery" | "/explore"
}

export default async function GalleryCard({ownerAddress, ticketID, ticketType, route}: GalleryCardProps) {
  const gallerySnakeData = await getSnakePathTags(ticketID, route === "/explore" ? true : false)

  if(gallerySnakeData?.res === 404) return

  return (
    <section className="group relative cursor-pointer h-[200px] w-[200px] p-[20px] pb-2 overflow-y-hidden flex flex-col items-center justify-between outline outline-[4px] outline-[#000a] rounded-[5px] bg-[url('../public/assets/empty_canvas_nav.svg')] bg-[length:200px] hover:scale-110 shadow-[6px_8px_5px_#0009] default_transition"
    >
      
      <Link href={{pathname: route+"/"+ticketID, query: {
        snake_data: gallerySnakeData?.data.snakeDataString,
        creator: gallerySnakeData?.data.snakeInfo?.creatorAddress,
        owner: gallerySnakeData?.data.snakeInfo?.ownerAddress,
        date: gallerySnakeData?.data.snakeInfo?.timestamp,
        colors: gallerySnakeData?.data.snakeInfo?.colors,
        type: ticketType
      }}} className={cn("absolute top-0 w-full h-full", {"h-0": !gallerySnakeData})} />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="outline outline-[#999] outline-1 rounded-[4px]">
        {
          gallerySnakeData?.data.pathElements || <>
            <circle cx={15} cy={25} r={2.5} fill="#999">
              <animate id='op' attributeName="cy" values="25;22.5;25;25;25" repeatCount="indefinite" dur="1s" />
            </circle>
            <circle cx={25} cy={25} r={2.5} fill="#999">
              <animate attributeName="cy" values="25;25;22.5;25;25" repeatCount="indefinite" dur="1s" />
            </circle>
            <circle cx={35} cy={25} r={2.5} fill="#999">
              <animate attributeName="cy" values="25;25;25;22.5;25" repeatCount="indefinite" dur="1s"/>
            </circle>
          </>
        }
      </svg>
      <section className={cn("card_text mx-[10px] pointer-events-none absolute bottom-2 text-zinc-800")}>
      <span className="px-2 rounded-md group-hover:bg-white default_transition"><b>#{ticketID}</b></span>
        <div>{gallerySnakeData?.data.snakeInfo?.timestamp || "xx/xx/xxxx"}</div>
        <div>
          <b>
            {!gallerySnakeData ? "Loading" : gallerySnakeData?.res === 204 ? "Loading Error" : gallerySnakeData?.data.snakeInfo?.colors.split("-").map((c, i, a) => {
              return(
                <span key={i}>
                  <span style={{color: c}}>{c}</span>
                  {i === a.length-1 ? null : "-"}
                </span>
              )
            })}
          </b>
        </div>
      </section>
    </section>
  )
}
