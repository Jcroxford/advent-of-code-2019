import { getAocDataForDay } from '../utils/aocApiService'
import { IntCodeCompiler } from './../shared/intCodeCompiler'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  const code = getAocDataForDay(9)

  console.log('---------- running part 1 ----------\n')
  console.log(part1(code).programOutput)
  console.log('---------- part 1 finished ---------\n')

  console.log('---------- running part 2 ---------\n')
  console.log(part2(code).programOutput)
  console.log('---------- part 2 finished ---------\n')
}

export function part1 (code: string) {
  return new IntCodeCompiler(code, [1]).execute()
}

export function part2 (code: string) {
  return new IntCodeCompiler(code, [2]).execute()
}
