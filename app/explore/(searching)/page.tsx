import GalleryCard from '@/components/gallery/gallery-card'
import { cn } from '@/lib/util'
import React from 'react'
import { getOwnedTicketsID, getTotalSnakeTickets } from '@/actions/smart_contract_actions'
import { ethers } from 'ethers'

type SearchResultDataType = {
  tickets: number[],
  message: string,
}

export default async function ExplorePage({ searchParams, }: {searchParams: { [key: string]: string | string[] | undefined }}) {  
  const searchResultData: SearchResultDataType = {tickets: [], message: ""}
  console.log(searchParams)
  if(!searchParams.search_result) {
    const totalTickets = await getTotalSnakeTickets()
    searchResultData.tickets = Array.from(Array(totalTickets), (_v, i) => i+1)
  }

  else if(ethers.utils.isAddress(searchParams.search_result as string)) {
    const allTicketsByAddress = await getOwnedTicketsID(searchParams.search_result as string)
    searchResultData.tickets = allTicketsByAddress?.minted as number[] 
    searchResultData.message = allTicketsByAddress?.minted.length ? "" : "Address owns zero Snakes :("
  }
  else if(/^[0-9]*$/.test(searchParams.search_result as string)) {
    const totalTickets = await getTotalSnakeTickets()
    const searchedNumber = +searchParams.search_result
    searchResultData.tickets = searchedNumber > 0 && searchedNumber <= totalTickets ? [+searchParams.search_result] : []
    searchResultData.message = searchResultData.tickets.length ? "" : "Invalid ID!"
  }
  else {
    searchResultData.message = "No Snakes found!"
  }

  const allGalleryCard = searchResultData.tickets.slice(0, 10).map((value, index) => <GalleryCard key={index} ticketID={value} ticketType="minted" route="/explore" />)
  
  console.log(searchResultData, searchParams)
  return (
    <>
      <section className="px-10 py-8 mt-16 flex flex-wrap justify-center gap-10 default_transition">
        {searchResultData.tickets.length ? allGalleryCard
          : searchResultData.message
        }
      </section>
      {/* {
        searchResultData.limit < searchResultData.tickets.length ? 
        <button className="button px-2 py-2 mt-4 sm_text_format" onClick={() => snakeTicketsDispatch({type: ACTIONS.SET, data: { limit: snakeTickets.limit+10 }})}>
          VIEW MORE
        </button> : null
        } */}
    </>
  )
}
