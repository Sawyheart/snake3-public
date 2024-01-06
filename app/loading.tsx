import Image from 'next/image'
import React from 'react'

export default function Loading() {
  return (
    <div className="absolute sm:left-5 left-[260px] top-9 m-auto">
      <Image src={"/./assets/loading.svg"} alt="home" width={25} height={25} />
    </div>
  )
}
