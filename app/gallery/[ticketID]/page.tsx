import SnakeTicketPage from '@/components/general/snake-ticket-page'
import React from 'react'

type SnakeTicketProps = {
  params: {
    ticketID: string,
  }
}

export default function SnakeTicketPageGallery({ params: { ticketID } }: SnakeTicketProps) {
  return <SnakeTicketPage params={{ ticketID }} />
}
