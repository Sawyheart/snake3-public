import { getSnakeData } from '@/actions/smart_contract_actions'
import SnakeTicketPage from '@/components/general/snake-ticket-page'
import React from 'react'

type SnakeTicketProps = {
  params: {
    ticketID: string,
  }
}

export function generateStaticParams() {
  return [{ticketID: "1"}, {ticketID: "2"}, {ticketID: "3"}, {ticketID: "4"}, {ticketID: "5"}, {ticketID: "6"}, {ticketID: "7"}, {ticketID: "8"}, {ticketID: "9"}, {ticketID: "10"},  ]
}

export default async function SnakeTicketPageGallery({ params: { ticketID } }: SnakeTicketProps) {
  const snakeData = await getSnakeData(+ticketID)
  return <SnakeTicketPage params={{ ticketID }} snakeData={snakeData} />
}
