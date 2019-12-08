import { IntCodeCompiler } from './../shared/intCodeCompiler'
import { getAocDataForDay } from '../utils/aocApiService'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  let code: string = getAocDataForDay(2)

  console.log('part 1 results', part1(code))
  console.log('part 2 results', part2(code))
}

export function part1 (code: string) {
  // fix malformed data per assignment description
  let restoredCode: string | string[] = code.split(',')
  restoredCode[1] = '12'
  restoredCode[2] = '2'
  restoredCode = restoredCode.join(',')

  return new IntCodeCompiler(restoredCode).execute().memory[0]
}

// preliminary testing showed that changing the noun yielded large change in results
// while changing the verb yielded small changes (typically/always one in my test cases)
export function part2 (code: string) {
  // provided by assignment
  const givenTargetNumber = 19690720
  let program = new IntCodeCompiler(code)

  let executionResults = null
  let noun = 0
  let verb = 0

  while (executionResults !== givenTargetNumber) {
    program = new IntCodeCompiler(code)
    program.memory[1] = noun
    program.memory[2] = verb

    executionResults = program.execute().memory[0]
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
