import { useEffect, useReducer, useRef, useState } from "react"
import useInterval from "../_general/useInterval"

const ACTIONS = {SET: "set", RESET: "reset"}
const reducer = (state: SnakeGameData, action: {type: string, data: Record<string, SnakeGameData[keyof SnakeGameData]>}) => {
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

const useGame = (initSnakeData: SnakeGameData) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snakeGameData, snakeGameDataDispatch] = useReducer(reducer, {...initSnakeData, snake: [initSnakeData.startingStep]})
  const [canvasBackground, setCanvasBackground] = useState<ImageData>()
  const [gameStatus, setGameStatus] = useState<"play" | "pause" | "gameover">("pause")

  const { resetInterval, stop: isIntervalStopped, setStop: stopInterval } = useInterval(moveSnake, initSnakeData.speed)

  //Adjusting canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if(!canvas || !context) return

    const boardSize = Math.min(500, Math.min(window.innerWidth - 50, window.innerHeight - 50))
    const totalUnitForSide = snakeGameData.maxUnitForSide
    
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
  }, [])

  //Changing direction keys event listener
  useEffect(() => {
    const onKeyPress = (ev: KeyboardEvent) => {
      if(ev.repeat) return

      if((ev.key === "a" || ev.key === "ArrowLeft") && snakeGameData.direction[0] === 0) 
        snakeGameDataDispatch({type: ACTIONS.SET, data: {direction: [-1, 0]}}) //setDirection([-1, 0])
      else if((ev.key === "d" || ev.key === "ArrowRight") && snakeGameData.direction[0] === 0)
        snakeGameDataDispatch({type: ACTIONS.SET, data: {direction: [1, 0]}}) //setDirection([1, 0])
      else if((ev.key === "w" || ev.key === "ArrowUp") && snakeGameData.direction[1] === 0)
        snakeGameDataDispatch({type: ACTIONS.SET, data: {direction: [0, -1]}}) //setDirection([0, -1])
      else if((ev.key === "s" || ev.key === "ArrowDown") && snakeGameData.direction[1] === 0)
        snakeGameDataDispatch({type: ACTIONS.SET, data: {direction: [0, 1]}}) //setDirection([0, 1])
    }

    window.addEventListener("keydown", onKeyPress)

    if(!isIntervalStopped) {
      moveSnake()
      resetInterval()
    }

    return () => window.removeEventListener("keydown", onKeyPress)
  }, [snakeGameData.direction])
  
  //Draw on canvas
  useEffect(() => {
    const context = canvasRef.current?.getContext("2d")
    if(!context) return

    const snakeHead = snakeGameData.snake[snakeGameData.snake.length-1]
    context.fillStyle = snakeHead.color
    
    context.fillRect(snakeHead.x, snakeHead.y, 1, 1)
  }, [snakeGameData.snake])

  useEffect(() => {
    // if(!snakeGameData.snake.length && !initSnakeData.startingStep) return
    let snake = [ ...snakeGameData.snake ]
    const actualHead = snake.pop()
    if(!actualHead) return
    actualHead.color = initSnakeData.startingStep.color
    snake = [ ...snake, ...[actualHead] ]
    console.log("NES", initSnakeData.startingStep.color, actualHead, snake)
    snakeGameDataDispatch({type: ACTIONS.SET, data: { snake }})
  }, [initSnakeData.startingStep.color])
  
  //Clear the canvas and draw the Background
  const clearBoard = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if(!canvas || !context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    if(canvasBackground) context.putImageData(canvasBackground, 0, 0)
  }

  const startGame = () => {
    stopInterval(false)
    setGameStatus("play")
  }

  const restartGame = (playGame: boolean = true) => {
    const snake = [initSnakeData.startingStep]
    const direction = initSnakeData.direction
    clearBoard()

    snakeGameDataDispatch({type: ACTIONS.SET, data: { direction, snake }})
    stopGame("pause")
  }

  const stopGame = (status: "pause" | "gameover") => {
    
    stopInterval(true)

    setGameStatus(status)
  }


  //SNAKE GAME HANDLER
  function moveSnake(): void {
    const actualHead = snakeGameData.snake[snakeGameData.snake.length-1]
    const color = /*!(snakeGameData.snake.length % 10) ? actualHead.color === "red" ? "blue" : "red" :*/ actualHead.color
    const newSnakeHead: SnakeStepData = {x: actualHead.x + snakeGameData.direction[0], y: actualHead.y + snakeGameData.direction[1], color}

    if(checkForCollisions(newSnakeHead))
      stopGame("gameover")
    else {
      const snake = [ ...snakeGameData.snake, ...[newSnakeHead] ]
      snakeGameDataDispatch({type: ACTIONS.SET, data: { snake }})
    }
  }

  function checkForCollisions(head: SnakeStepData) {
    console.log(snakeGameData.snake, head)
    //Snake collision
    if(snakeGameData.snake.some(({x, y, color}) => head.x === x && head.y === y && head.color === color)) return true
    
    //Wall collision
    if(head.x < 0 || head.y < 0 || head.x >= snakeGameData.maxUnitForSide || head.y >= snakeGameData.maxUnitForSide) return true

    return false
  }

  return {canvasRef, snakeGameData, gameStatus, startGame, restartGame, stopGame}
}

export default useGame