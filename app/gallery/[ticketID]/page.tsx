import { getSnakeData } from '@/actions/smart_contract_actions'
import SnakeTicketPage from '@/components/general/snake-ticket-page'
import React from 'react'

type SnakeTicketProps = {
  params: {
    ticketID: string,
  }
}

export function generateStaticParams() {
  return Array.from({length: 100}, (_, i) => { return {ticketID: (i+1)+""}})
}

export default async function SnakeTicketPageGallery({ params: { ticketID } }: SnakeTicketProps) {
  const snakeData = await getSnakeData(+ticketID)
  return <SnakeTicketPage params={{ ticketID }} snakeData={snakeData} />
}
