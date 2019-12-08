import { getAocDataForDay } from '../utils/aocApiService'
import { IntCodeCompiler } from './../shared/intCodeCompiler'

// ==============================================================================================================
// exports
// ==============================================================================================================
// todo allow input to be programmatic
// todo move all conditional checks to functions
// todo print memeory address with print output?
export function main () {
  const code = getAocDataForDay(5)

  console.log('---------- running part 1 ----------\n')
  console.log(part1(code))
  console.log('---------- part 1 finished ---------\n')

  console.log('---------- part 2 finished ---------\n')
  console.log(part2(code))
  console.log('---------- part 2 finished ---------\n')
}

export function part1 (code: string, input: number[] = [1]) {
  const program = new IntCodeCompiler(code, input)
  return program.execute().programOutput
}

export function part2 (code: string) { return part1(code, [5]) }

// ==============================================================================================================
// helper methods
// ==============================================================================================================
