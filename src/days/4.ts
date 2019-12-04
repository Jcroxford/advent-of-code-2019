import { getAocDataForDay } from '../utils/aocApiService'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  const [ min, max ] = getAocDataForDay(4).split('-').map(Number)

  console.log('min, max: ', min, max)
  console.log(part1(min, max))
  console.log(part2(min, max))

}

function part1 (min: number, max: number) {
  let currentNum = min
  let totalPossibleCombinations = 0
  const hasDigitPair = /(\d)\1+/

  while (currentNum < max) {
    const currentNumAsStr = String(currentNum)
    currentNum += 1

    // confirm it has a pair of digits together at some point
    if (!hasDigitPair.test(currentNumAsStr)) continue

    // confirm numbers always increase
    const nums = currentNumAsStr.split('')
    let doesntIncrease = true
    for (let i = 0; i < nums.length - 1; i++) {
      const leftNum = nums[i]
      const rightNum = nums[i + 1]

      if (leftNum > rightNum) {
        doesntIncrease = false
        break
      }
    }

    if (doesntIncrease) totalPossibleCombinations += 1
  }

  return totalPossibleCombinations
}

function part2 (min: number, max: number) {
  let currentNum = min
  let totalPossibleCombinations = 0

  while (currentNum < max) {
    const currentNumAsStr = String(currentNum)
    currentNum += 1

    const nums = currentNumAsStr.split('')
    let hasPair = false
    let doesntIncrease = true
    for (let i = 0; i < nums.length - 1; i++) {
      const previousNum = nums[i - 1]
      const currentNum = nums[i]
      const NextNum = nums[i + 1]
      const nextNextNum = nums[i + 2]

      // confirm it has a strict pair of digits together at some point
      if (previousNum !== currentNum && currentNum === NextNum && currentNum !== nextNextNum) {
        hasPair = true
      }

      // confirm numbers always increase
      if (currentNum > NextNum) {
        doesntIncrease = false
      }
    }

    if (doesntIncrease && hasPair) totalPossibleCombinations += 1
  }

  return totalPossibleCombinations
}
