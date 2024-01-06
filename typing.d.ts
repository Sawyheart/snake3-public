type Direction = [0, 0] | [-1, 0] | [0, -1] | [1, 0] | [0, 1]

type SnakeStepData = {
  x: number,
  y: number,
  color: string
}

type SnakeGameData = {
  startingStep: SnakeStepData,
  speed: number,
  maxUnitForSide: number,
  direction: Direction,
  snake: SnakeStepData[],
}

type SearchParamsType = {[key: string]: string | string[] | undefined}
