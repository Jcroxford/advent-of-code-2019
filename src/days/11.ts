import { getAocDataForDay } from '../shared/aocApiService'
import { IntCodeCompiler, ExecutionStatus } from './../shared/intCodeCompiler'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  const code = getAocDataForDay(11)

  console.log('---------- running part 1 ----------')
  console.log(part1(code))
  console.log('---------- part 1 finished ---------\n')

  console.log('---------- running part 2 ---------\n')
  console.table(part2(code))
  console.log('---------- part 2 finished ---------\n')
}

enum Direction {
  UP,
  LEFT,
  RIGHT,
  DOWN
}
export function part1 (code: string) {
  return Object.keys(robotPaintingProgram(code, 0)).length
}

export function part2 (code: string) {
  const panelDict = robotPaintingProgram(code, 1)

  // just creating two dimensional array that can be pretty printed to the console
  return Object.keys(panelDict)
    .reduce((panels: string[][], panelCoord: string) => {
      const [ x, y ] = panelCoord.split(',').map(Number)

      if (!panels[y]) panels[y] = []

      panels[y][x] = panelDict[panelCoord] ? '#' : ''

      return panels
    }, [])
}

// ==============================================================================================================
// helper methods
// ==============================================================================================================
function robotPaintingProgram (code: string, startingColor: number) {
  const robotCurrentPosition = { x: 0, y: 0, color: 0, facing: Direction.UP }
  const squaresVisited: { [key: string]: number } = { ['0,0']: startingColor }

  const robot = new IntCodeCompiler(code)

  while (robot.executionStatus !== ExecutionStatus.Finished) {
    const currentPositionColor = squaresVisited[`${robotCurrentPosition.x},${robotCurrentPosition.y}`] || 0
    robot.programaticInput.push(currentPositionColor)

    const paintColor = robot.execute().programOutput.shift() as number
    const turnDirection = robot.programOutput.shift() as number

    squaresVisited[`${robotCurrentPosition.x},${robotCurrentPosition.y}`] = paintColor

    if (robotCurrentPosition.facing === Direction.UP && turnDirection === 0) {
      robotCurrentPosition.facing = Direction.LEFT
      robotCurrentPosition.x -= 1
    } else if (robotCurrentPosition.facing === Direction.UP && turnDirection === 1) {
      robotCurrentPosition.facing = Direction.RIGHT
      robotCurrentPosition.x += 1
    } else if (robotCurrentPosition.facing === Direction.LEFT && turnDirection === 0) {
      robotCurrentPosition.facing = Direction.DOWN
      robotCurrentPosition.y -= 1
    } else if (robotCurrentPosition.facing === Direction.LEFT && turnDirection === 1) {
      robotCurrentPosition.facing = Direction.UP
      robotCurrentPosition.y += 1
    } else if (robotCurrentPosition.facing === Direction.DOWN && turnDirection === 0) {
      robotCurrentPosition.facing = Direction.RIGHT
      robotCurrentPosition.x += 1
    } else if (robotCurrentPosition.facing === Direction.DOWN && turnDirection === 1) {
      robotCurrentPosition.facing = Direction.LEFT
      robotCurrentPosition.x -= 1
    } else if (robotCurrentPosition.facing === Direction.RIGHT && turnDirection === 0) {
      robotCurrentPosition.facing = Direction.UP
      robotCurrentPosition.y += 1
    } else if (robotCurrentPosition.facing === Direction.RIGHT && turnDirection === 1) {
      robotCurrentPosition.facing = Direction.DOWN
      robotCurrentPosition.y -= 1
    }
  }

  return squaresVisited
}
