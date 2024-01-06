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

export default function SnakeTicketPageExplore({ params: { ticketID } }: SnakeTicketProps) {
  return <SnakeTicketPage params={{ ticketID }} />
}

