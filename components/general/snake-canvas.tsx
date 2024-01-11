"use client"
import useAutoGame from '@/hooks/_general/useAutoGame'
import { cn } from '@/lib/util'
import React, { useMemo } from 'react'

export default function SnakeCanvas({ ticketID, snake_data, loop }: {ticketID: number, snake_data?: string, loop: boolean}) {
  const snakeData = useMemo(() => {
    if(!snake_data) return []

    try{
      var snakeData: SnakeStepData[] = JSON.parse(snake_data)

      snakeData.forEach(step => {
        if(Object.keys(step).length !== 3) throw new Error()
        if(typeof step.x !== "number" || typeof step.y !== "number" || typeof step.color !== "string") throw new Error()
      })
      
    } catch(e) {
      console.error("Impossible to PARSE. Wrong SnakeData Format", e)
      return []
    }

    return snakeData
  }, [])

  const { canvasRef } = useAutoGame(snakeData, 50, loop)

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="absolute w-[250px] h-[250px] drop-shadow-[2px_2px_0_#000a]">
        <circle cx={15} cy={25} r={2.5} fill="#999">
          <animate id='op' attributeName="cy" values="25;22.5;25;25;25" repeatCount="indefinite" dur="1s" />
        </circle>
        <circle cx={25} cy={25} r={2.5} fill="#999">
          <animate attributeName="cy" values="25;25;22.5;25;25" repeatCount="indefinite" dur="1s" />
        </circle>
        <circle cx={35} cy={25} r={2.5} fill="#999">
          <animate attributeName="cy" values="25;25;25;22.5;25" repeatCount="indefinite" dur="1s"/>
        </circle>
      </svg>
      <section className={cn("p-[20px] border-0 border-[#999] border-dashed rounded-[5px] drop-shadow-[4px_4px_0_#0007]", {"border-[5px]": canvasRef.current})}>
        <canvas className="rounded-md" ref={canvasRef} />
        {
          !snakeData.length && canvasRef.current !== null ? <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <span className="py-4 w-full rounded-[5px] text-center backdrop-blur-[5px]">WRONG SNAKE DATA FORMAT!</span>
          </div> : null
        }
      </section>
    </>
  )
}
