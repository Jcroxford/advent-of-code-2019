import { getAocDataForDay } from '../shared/aocApiService'
import { IntCodeCompiler, ExecutionStatus } from './../shared/intCodeCompiler'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  const code = getAocDataForDay(7)

  console.log('---------- running part 1 ----------\n')
  console.log(part1(code))
  console.log('---------- part 1 finished ---------\n')

  console.log('---------- running part 2 ---------\n')
  console.log(part2(code))
  console.log('---------- part 2 finished ---------\n')
}

export function part1 (code: string) {
  const combinations = createFactorialPermuationListOfSize(5)

  const ampA = new IntCodeCompiler(code)
  const ampB = new IntCodeCompiler(code)
  const ampC = new IntCodeCompiler(code)
  const ampD = new IntCodeCompiler(code)
  const ampE = new IntCodeCompiler(code)

  return combinations
    .map(combination => {
      ampA.reset().programaticInput = [combination[0], 0]
      ampB.reset().programaticInput = [combination[1], ampA.execute().programOutput[0]]
      ampC.reset().programaticInput = [combination[2], ampB.execute().programOutput[0]]
      ampD.reset().programaticInput = [combination[3], ampC.execute().programOutput[0]]
      ampE.reset().programaticInput = [combination[4], ampD.execute().programOutput[0]]

      return { combination, thrust: ampE.execute().programOutput[0] }
    })
    .sort((a, b) => b.thrust - a.thrust)[0]
}

export function part2 (code: string) {
  const combinations = createFactorialPermuationListOfSize(5)
    .map(combination => combination.map(n => n + 5))

  const ampA = new IntCodeCompiler(code)
  const ampB = new IntCodeCompiler(code)
  const ampC = new IntCodeCompiler(code)
  const ampD = new IntCodeCompiler(code)
  const ampE = new IntCodeCompiler(code)

  return combinations
    .map(combination => {
      // reset amps for next combination
      ampA.reset().programaticInput.push(combination[0], 0)
      ampB.reset().programaticInput.push(combination[1])
      ampC.reset().programaticInput.push(combination[2])
      ampD.reset().programaticInput.push(combination[3])
      ampE.reset().programaticInput.push(combination[4])

      const amps = [ ampA, ampB, ampC, ampD, ampE ]
      while (amps.filter(amp => amp.executionStatus !== ExecutionStatus.Finished).length) {
        const currentAmp = amps.shift() as IntCodeCompiler
        const lastAmp = amps[amps.length - 1]

        if (currentAmp.executionStatus === ExecutionStatus.RequestingInput || lastAmp.programOutput.length) {
          currentAmp.programaticInput.push(lastAmp.programOutput.shift() as number)
        }

        if (currentAmp.executionStatus !== ExecutionStatus.Finished) {
          currentAmp.execute()
        }

        amps.push(currentAmp)
      }

      return { combination, thrust: ampE.execute().programOutput[0] }
    })
    .sort((a, b) => b.thrust - a.thrust)[0]
}

// ==============================================================================================================
// helper methods
// ==============================================================================================================
function createFactorialPermuationListOfSize (size: number) {
  const list = new Array(size)

  for (let i = 0; i < list.length; i++) {
    list[i] = i
  }

  return factorialPermutations(list)
}

function factorialPermutations (list: number[]): number[][] {
  if (list.length === 1) return [ list ]

  let permutations: number[][] = []
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const childList = [ ...list.slice(0, i), ...list.slice(i + 1) ] // pull item that is being used out of child list

    for (let child of factorialPermutations(childList)) {
      permutations.push([ item, ...child ])
    }
  }

  return permutations
}
