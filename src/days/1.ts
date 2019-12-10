import { getAocDataForDay } from '../shared/aocApiService'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  const items = getAocDataForDay(1)
    .split('\n')
    .map(Number)

  console.log(`answer for part 1:`, calculateFuelNeededToCarry(items))
  console.log(`answer for part 2:`, calculateFuelNeededToCarryItemsAndFuel(items))
}

export function calculateFuelNeededToCarry (items: number[]) {
  return items.reduce((total, item) => total += calculateFuelNeeds(item), 0)
}

export function calculateFuelNeededToCarryItemsAndFuel (items: number[]) {
  return items.reduce((total, item) => total += calculateFuelNeededToCarryExtraFuelWeight(calculateFuelNeeds(item)) + calculateFuelNeeds(item), 0)
}

// ==============================================================================================================
// helper methods
// ==============================================================================================================
function calculateFuelNeededToCarryExtraFuelWeight (weight: number): number {
  const result = calculateFuelNeeds(weight)

  return result <= 0 ? 0 : result + calculateFuelNeededToCarryExtraFuelWeight(result)
}

function calculateFuelNeeds (weight: number) {
  return Math.floor(weight / 3) - 2
}
