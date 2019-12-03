import { getAocDataForDay } from '../utils/aocApiService'

interface Point {
  x: number
  y: number
  jumps: number
}

interface IntersectedPoint {
  x: number
  y: number
  jumpsForWireOne: number
  jumpsForWireTwo: number
}

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  const [ wireOne, wireTwo ] = getAocDataForDay(3)
    .split('\n')
    .map(r => r.split(','))

  const wireOneGridPoints = createCoordinateList(wireOne)
  const wireTwoGridPoints = createCoordinateList(wireTwo)

  const allIntersctions = findAllWireIntersections(wireOneGridPoints, wireTwoGridPoints)

  console.log(`answer to part one ${findShortestManhattenDistance(allIntersctions)}`)
  console.log(`answer to part one ${findShotestJumpDistance(allIntersctions)}`)
}

export function findShortestManhattenDistance (allIntersctions: IntersectedPoint[]) {
  // convert points to manhatten distance, sort, and find the lowest cross that isn't 0, 0
  return allIntersctions.map(({ x, y }) => Math.abs(x) + Math.abs(y)).sort((a, b) => a - b)[0]
}

export function findShotestJumpDistance (allIntersctions: IntersectedPoint[]) {
  return allIntersctions.map(({ jumpsForWireOne, jumpsForWireTwo }) => jumpsForWireOne + jumpsForWireTwo).sort((a, b) => a - b)[0]
}

// ==============================================================================================================
// helper methods
// ==============================================================================================================
function findAllWireIntersections (wireOneGridPoints: Point[], wireTwoGridPoints: Point[]): IntersectedPoint[] {
  // create easily traversable dictionary of wire one's coords
  const wireOneCoordDict: { [key: number]: { [key: number]: number } } = {}
  wireOneGridPoints.forEach(({ x, y, jumps }) => {
    if (!wireOneCoordDict[x]) wireOneCoordDict[x] = {}

    wireOneCoordDict[x][y] = jumps
  })

  // search for coords that wire two and wire one have in common and save them in a list
  // assuming there is no cross at 0,0 due to jumps, 0, 0 point will not be included in intersection list
  const wireIntersectionPoints: IntersectedPoint[] = []
  wireTwoGridPoints.forEach(({ x, y, jumps }) => {
    if (!wireOneCoordDict[x]) return

    if (wireOneCoordDict[x][y]) wireIntersectionPoints.push({ x, y, jumpsForWireOne: wireOneCoordDict[x][y], jumpsForWireTwo: jumps })
  })

  return wireIntersectionPoints
}

function createCoordinateList (trjectoryList: string[]): Point[] {
  const currentPoint: Point = { x: 0, y: 0, jumps: 0 }
  const gridLocations = [ { ...currentPoint } ]

  trjectoryList.forEach((path: string) => {
    const direction = path[0]
    const wireLength = Number(path.slice(1))

    // traverse X in positive direction
    if (direction === 'R') {
      for (let i = 0; i < wireLength; i++) {
        currentPoint.x += 1
        currentPoint.jumps += 1
        gridLocations.push({ ...currentPoint })
      }
    }

    // traverse X in negative direction
    if (direction === 'L') {
      for (let i = 0; i < wireLength; i++) {
        currentPoint.x -= 1
        currentPoint.jumps += 1
        gridLocations.push({ ...currentPoint })
      }
    }

    // traverse Y in positive direction
    if (direction === 'U') {
      for (let i = 0; i < wireLength; i++) {
        currentPoint.y += 1
        currentPoint.jumps += 1
        gridLocations.push({ ...currentPoint })
      }
    }

    // traverse Y in negative direction
    if (direction === 'D') {
      for (let i = 0; i < wireLength; i++) {
        currentPoint.y -= 1
        currentPoint.jumps += 1
        gridLocations.push({ ...currentPoint })
      }
    }
  })

  return gridLocations
}
