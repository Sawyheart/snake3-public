"use client"
import { useEffect, useState } from "react"
import { useAddress } from "@thirdweb-dev/react"

import { addSnakeTicket } from "@/actions/smart_contract_actions"
import useGame from "@/hooks/play/useGame"
import { cn } from "@/lib/util"
import { useRouter } from "next/navigation"
import SmartContractButton from "@/components/general/smart-contract-button"

const PATH_SHAPE = {
  PLAY: "M9.1,5 L1.55,8.8 L1.55,1.2 L1.55,1.2 Z",
  STOP: "M1.7,1.2 L8.3,1.2 L8.3,8.8 L1.7,8.8 Z",
  RETRY: "M47.2,32.6c0,0.1,0,0.1-0.1,0.2c-0.3,0.9-0.5,1.8-0.9,2.6c-0.4,0.9-0.8,1.9-1.3,2.7c-1,1.8-2.2,3.4-3.6,4.8c-1.4,1.4-3,2.7-4.7,3.7c-1.7,1-3.6,1.9-5.6,2.4c-2,0.6-4.1,0.8-6.2,0.8C12.3,50,2,39.7,2,27.1S12.3,4.2,24.9,4.2c4.3,0,8.3,1.2,11.7,3.2c0,0,0,0,0,0c1.7,1,3.2,2.2,4.5,3.5c0.4,0.3,0.7,0.6,1,1c0.8,0.6,1.3,0.2,1.3-0.8V3.6C43.4,2.8,44.2,2,45,2h3.2c0.9,0,1.6,0.8,1.7,1.6v19.6c0,0.8-0.6,1.4-1.4,1.4H28.9c-0.9,0-1.5-0.6-1.5-1.5v-3.3c0-0.9,0.8-1.6,1.6-1.6h7.5c0.6,0,1.2-0.2,1.4-0.5c-2.9-4-7.6-6.6-13-6.6c-8.9,0-16,7.2-16,16s7.2,16,16,16c7,0,12.9-4.4,15.1-10.6c0,0,0.3-1.4,1.4-1.4c1.1,0,3.8,0,4.6,0c0.7,0,1.3,0.5,1.3,1.2C47.2,32.4,47.2,32.5,47.2,32.6z",
} as const

export default function GamePage() {
  const [svgButtonPath, setSvgButtonPath] = useState<string>(PATH_SHAPE.PLAY)
  const [selectedColor, setSelectedColor] = useState<string>("black")
  const {canvasRef, snakeGameData: { snake }, gameStatus, startGame, restartGame, stopGame} = useGame({
    startingStep: {x: Math.round(1 * Math.random() * 49), y: 0, color: selectedColor},
    speed: 100,
    maxUnitForSide: 50,
    direction: [0, 1],
    snake: []
  })
  const address = useAddress()
  const router = useRouter()

  useEffect(() => {
    if(gameStatus === "gameover") setSvgButtonPath(PATH_SHAPE.RETRY)
    else if(gameStatus === "pause") setSvgButtonPath(PATH_SHAPE.PLAY)
  }, [gameStatus])

  function playButtonHandler() {
    if(gameStatus === "pause") {
      startGame()
      setSvgButtonPath(PATH_SHAPE.STOP)
    }
    else if(gameStatus === "play") {
      stopGame("pause")
      setSvgButtonPath(PATH_SHAPE.PLAY)
    }
    else {
      restartGame()
      setSvgButtonPath(PATH_SHAPE.STOP)
    }
  }

  return(
    <section className={cn("w-full min-h-[100dvh] px-10 pb-28 pt-40 flex flex-col items-center justify-center gap-10")}>
      <div className="p-[20px] border-[5px] border-[#999] border-dashed rounded-[5px] drop-shadow-[4px_4px_0_#0007]">
        <canvas className="rounded-md" ref={canvasRef} />
      </div>

      <div className="w-[min(500px,_100%)] flex justify-between items-center gap-8">
        <section className="group round_button min-w-[64px] flex justify-center items-center" onClick={playButtonHandler}>
          <svg className={cn("default_transition h-10")} xmlns="http://www.w3.org/2000/svg" viewBox={svgButtonPath === PATH_SHAPE.RETRY ? "0 0 52 52" : "0 0 10 10"}>
            <path className="default_transition" d={svgButtonPath} fill={svgButtonPath === PATH_SHAPE.RETRY ? "white" : "none"} stroke={svgButtonPath === PATH_SHAPE.RETRY ? "none" : "white"} strokeWidth={1.5} strokeLinejoin="round" shapeRendering="crispEdges" />
          </svg>
        </section>
        <SmartContractButton className={cn({"disabled_button": snake.length <= 1})} smartContractFunc={() => {
          stopGame("gameover")
          return addSnakeTicket(address, snake)
        }}>
          ADD TO YOUR GALLERY
        </SmartContractButton>
        <section className="group round_button min-w-[64px]">
          <div className="w-full h-full flex rounded-full bg-[url('../public/assets/moving_empty_canvas.svg')] bg-right bg-[length:160px] hover:bg-[length:280px] default_transition" onClick={() => setSelectedColor((value) => value === "black" ? "red" : "black")}>
            <svg className={cn("default_transition w-1/2 group-hover:w-3/4")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
              <path d="M0,5 H10" stroke={selectedColor} strokeWidth={4} shapeRendering="crispEdges" />
            </svg>
          </div>
        </section>
      </div>
    </section>
  )
}