import { IntCodeCompiler } from './../shared/intCodeCompiler'
import { getAocDataForDay } from '../utils/aocApiService'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  let input: string = getAocDataForDay(2)

  console.log('part 1 results', part1(input))
  console.log('part 2 results', part2(input))
}

export function part1 (input: string) {
  // fix malformed data per assignment description
  let restoredInput: string | string[] = input.split(',')
  restoredInput[1] = '12'
  restoredInput[2] = '2'
  restoredInput = restoredInput.join(',')

  return new IntCodeCompiler(restoredInput).execute()
}

// preliminary testing showed that changing the noun yielded large change in results
// while changing the verb yielded small changes (typically/always one in my test cases)
export function part2 (input: string) {
  // provided by assignment
  const givenTargetNumber = 19690720
  let program = new IntCodeCompiler(input)

  let executionResults = null
  let noun = 0
  let verb = 0

  while (executionResults !== givenTargetNumber) {
    program = new IntCodeCompiler(input)
    program.memory[1] = noun
    program.memory[2] = verb

    executionResults = program.execute()
    if (executionResults === givenTargetNumber) {
      break
    } else if (givenTargetNumber - executionResults < 100) {
      verb += 1
    } else {
      noun += 1
    }
  }

  // alogrithm was specified by assignment
  return 100 * noun + verb
}
