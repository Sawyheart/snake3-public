import { useEffect, useReducer, useRef, useState } from "react"
import useInterval from "./useInterval"

type AutoGameProp = {
  fullSnake: SnakeStepData[],
  snake: SnakeStepData[],
  keyStep: number,
}

const ACTIONS = {SET: "set", RESET: "reset"}
const reducer = (state: AutoGameProp, action: {type: string, data: Record<string, AutoGameProp[keyof AutoGameProp]>}) => {
  const { type, data } = action
  switch (type) {
    case ACTIONS.SET:
      return { ...state, ...data }
    case ACTIONS.RESET:
      return { ...state, ...data }
    default:
      return state
  }
}

const useAutoGame = (snakeData: SnakeStepData[], maxUnitForSide: number, loop: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [autoGameData, autoGameDataDispatch] = useReducer(reducer, {fullSnake: snakeData, snake: [], keyStep: 0})
  const [canvasBackground, setCanvasBackground] = useState<ImageData>()

  const { resetInterval, stop: isIntervalStopped, setStop: stopInterval } = useInterval(moveSnake, 15)


  //Adjusting canvas resolution
  useEffect(() => {    
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if(!canvas || !context) return

    const boardSize = Math.min(400, Math.min(window.innerWidth - 50, window.innerHeight - 50))
    const totalUnitForSide = maxUnitForSide
    
    canvas.width = boardSize - (boardSize % totalUnitForSide)
    canvas.height = boardSize - (boardSize % totalUnitForSide)

    const unitSize = canvas.width / totalUnitForSide

    context.setTransform(unitSize, 0, 0, unitSize, 0, 0)
    for(let y = 0; y < totalUnitForSide; y++) {
      for(let x = 0; x < totalUnitForSide/2; x++) {
        if(x % 2 !== y % 2) context.fillStyle = "#fff"
        else context.fillStyle = "#eee"
        context.fillRect(x*2, y*2, 2, 2)
      }
    }

    setCanvasBackground(context.getImageData(0, 0, canvas.width, canvas.height))
    
    if(autoGameData.fullSnake.length) startAutoGame()
  }, [])

  
  //Draw on canvas
  useEffect(() => {
    if(!autoGameData.snake.length) return
    const context = canvasRef.current?.getContext("2d")
    if(!context) return

    const snakeHead = autoGameData.snake[autoGameData.snake.length-1]
    context.fillStyle = snakeHead.color
    
    context.fillRect(snakeHead.x, snakeHead.y, 1, 1)
  }, [autoGameData.snake])

  useEffect(() => {
    if(isIntervalStopped && loop && autoGameData.fullSnake.length) restart() 
  }, [loop])

  
  //Clear the canvas and draw the Background
  const clearBoard = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if(!canvas || !context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    if(canvasBackground) context.putImageData(canvasBackground, 0, 0)
  }

  function moveSnake() {
    let keyStep = autoGameData.keyStep
    let end = false
    
    const actualHead = autoGameData.snake.length === 0 ? {x: autoGameData.fullSnake[0].x, y: autoGameData.fullSnake[0].y, color: autoGameData.fullSnake[0].color} : autoGameData.snake[autoGameData.snake.length - 1]
    const direction = [
      Math.sign(autoGameData.fullSnake[keyStep].x - actualHead.x), 
      Math.sign(autoGameData.fullSnake[keyStep].y - actualHead.y)
    ]

    const newSnakeHead: SnakeStepData = {
      x: actualHead.x + direction[0],
      y: actualHead.y + direction[1],
      color: autoGameData.fullSnake[Math.max(0, keyStep-1)].color
    }

    if(newSnakeHead.x === autoGameData.fullSnake[keyStep].x && newSnakeHead.y === autoGameData.fullSnake[keyStep].y) {
      keyStep += 1
      if(keyStep === autoGameData.fullSnake.length) end = true
    }

    const snake = [ ...autoGameData.snake, ...[newSnakeHead] ]
    autoGameDataDispatch({type: ACTIONS.SET, data: { snake, keyStep }})
    if(end) stopAutoGame()
  }

  const startAutoGame = () => setTimeout(() => stopInterval(false), 1000)

  function restart() {
    const dataLoop = document.getElementById("replay-button")
    if(!dataLoop?.getAttribute("data-loop")) return
    const snake: SnakeStepData[] = []
    const keyStep = 0

    clearBoard()
    autoGameDataDispatch({type: ACTIONS.SET, data: { snake, keyStep }})
    startAutoGame()
  }

  const stopAutoGame = async () => {
    stopInterval(true)

    if(loop) setTimeout(restart, 1000)
  }

  
  
  return { canvasRef }
}

export default useAutoGame