import React from "react"
import SectionCard from "@/components/home/section-card"

export default function HomePage() {
  return(
    <section className="w-full px-10">
      <nav className="min-h-[max(700px,_100dvh)] py-36 flex flex-wrap items-center content-center justify-center gap-16">
        <SectionCard cardTitle="play" cardText={<>Play the <strong>Game</strong></>} />
        <SectionCard cardTitle="gallery" cardText={<>Check your Gallery</>} /> 
        <SectionCard cardTitle="explore" cardText={<>Explore the world of <strong>Snake-3</strong></>} />
      </nav>

      {/* <div className="w-40 h-40 overflow-y-scroll scroll-smooth">
        <div id="as" className="">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis sed sunt numquam aliquid eligendi quis reiciendis omnis harum odio? Reprehenderit fuga est quos. Saepe doloremque aperiam ipsum, reiciendis laudantium atque.
        </div>
        <Link href="#top">TOP</Link>
      </div> */}
      
    </section>
  )
}