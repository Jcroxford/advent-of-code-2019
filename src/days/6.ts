import { getAocDataForDay } from '../utils/aocApiService'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  const orbits = getAocDataForDay(6)
    .split('\n')
    .map(r => r.split(')'))
    .reduce((dict, [ planetA, planetB ]) => ({ ...dict, [planetB]: planetA }), {})

  console.log(part1(orbits))
  console.log(part2(orbits))
}

function part1 (planets: PlanetDict) {
  return Object.keys(planets).reduce((total, planet) => total + findDistanceFromCenter(planets, planet), 0)
}

// returns -1 if they never connect. if true, probably an error
function part2 (planets: PlanetDict) {
  let pathOfYou = givePlanentsPathFromCenter(planets, 'YOU')
  let pathOfSan = givePlanentsPathFromCenter(planets, 'SAN')

  for (let i = 0; i < Math.max(pathOfYou.length, pathOfSan.length); i++) {
    // paths are still the same
    if (pathOfSan[i] === pathOfYou[i]) continue

    // count of nodes minus the last item (you or san) which are not routes but markers.
    // doesn't include node they diverge from so nodes in this count act like edges
    return pathOfYou.slice(i, pathOfYou.length - 1).length + pathOfSan.slice(i, pathOfSan.length - 1).length
  }

  return -1
}

// ==============================================================================================================
// helper methods
// ==============================================================================================================
interface PlanetDict {
  // key and value are both planets. key orbits around value
  [key: string]: string
}

function findDistanceFromCenter (planets: PlanetDict, currentPlanet: string): number {
  return currentPlanet === 'COM' ? 0 : 1 + findDistanceFromCenter(planets, planets[currentPlanet])
}

function givePlanentsPathFromCenter (planets: PlanetDict, currentPlanet: string, path: string[] = []): string[] {
  return currentPlanet === 'COM' ? [ currentPlanet, ...path ] : givePlanentsPathFromCenter(planets, planets[currentPlanet], [ currentPlanet, ...path ])
}
