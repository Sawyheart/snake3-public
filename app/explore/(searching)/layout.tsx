// "use client"
import React from 'react'
import SearchBar from '@/components/explore/search-bar'

type ExploreLayouteProps = {
  children: React.ReactNode,
}

export default async function ExploreLayout({ children }: ExploreLayouteProps) {
  return (
    <section className="w-full px-10 pb-28 pt-48 flex flex-col items-stretch gap-10">
      <section className="section_gallery">
        <SearchBar></SearchBar>
        {children}
      </section>
    </section>
  )
}
