import { getAocDataForDay } from '../utils/aocApiService'
import { IntCodeCompiler } from './../shared/intCodeCompiler'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  const code = getAocDataForDay(5)

  console.log('---------- running part 1 ----------\n')
  console.log(part1(code))
  console.log('---------- part 1 finished ---------\n')
}

export function part1 (code: string) {
  const program = new IntCodeCompiler(code)
  program.execute()
}

// ==============================================================================================================
// helper methods
// ==============================================================================================================
