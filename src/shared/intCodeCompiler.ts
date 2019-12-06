import readlineSync from 'readline-sync'

export class IntCodeCompiler {
  // constants/opcodes/instructions
  static ADD_INSTRUCTION = 1
  static MULT_INSTRUCTION = 2
  static SAVE_INSTRUCTION = 3
  static PRINT_INSTRUCTION = 4
  static JUMP_IF_TRUE_INSTRUCTION = 5
  static JUMP_IF_FALSE_INSTRUCTION = 6
  static IS_LESS_THAN_INSTRUCTION = 7
  static IS_EQUAL_INSTRUCTION = 8
  static HALT_INSTRUCTION = 99

  public memory: number[]

  constructor (input: string) {
    this.memory = input.split(',').map(Number)
  }

  /**
   * right now assumes whatever is at index 0 after execution should be the return value
   */
  execute () {
    let indexOfCurrentOpcode = 0
    let currentIntsruction = null
    while (currentIntsruction !== IntCodeCompiler.HALT_INSTRUCTION && indexOfCurrentOpcode < this.memory.length) {
      const { instruction, modes } = this.parseOpcode(this.memory[indexOfCurrentOpcode])
      currentIntsruction = instruction

      if (currentIntsruction === IntCodeCompiler.ADD_INSTRUCTION) {
        const argOne = this.useImmediateMode(modes[0]) ? this.memory[indexOfCurrentOpcode + 1] : this.memory[this.memory[indexOfCurrentOpcode + 1]]
        const argTwo = this.useImmediateMode(modes[1]) ? this.memory[indexOfCurrentOpcode + 2] : this.memory[this.memory[indexOfCurrentOpcode + 2]]

        // writes never immediate
        this.memory[this.memory[indexOfCurrentOpcode + 3]] = argOne + argTwo
        indexOfCurrentOpcode += 4
      }

      if (currentIntsruction === IntCodeCompiler.MULT_INSTRUCTION) {
        const argOne = this.useImmediateMode(modes[0]) ? this.memory[indexOfCurrentOpcode + 1] : this.memory[this.memory[indexOfCurrentOpcode + 1]]
        const argTwo = this.useImmediateMode(modes[1]) ? this.memory[indexOfCurrentOpcode + 2] : this.memory[this.memory[indexOfCurrentOpcode + 2]]

        // writes never immediate
        this.memory[this.memory[indexOfCurrentOpcode + 3]] = argOne * argTwo
        indexOfCurrentOpcode += 4
      }

      if (currentIntsruction === IntCodeCompiler.SAVE_INSTRUCTION) {
        const input = Number(readlineSync.question(`enter data you would like stored at memory address ${indexOfCurrentOpcode}: `))

        // writes never immediate
        this.memory[this.memory[indexOfCurrentOpcode + 1]] = input

        indexOfCurrentOpcode += 2
      }

      if (currentIntsruction === IntCodeCompiler.PRINT_INSTRUCTION) {
        const argOne = this.useImmediateMode(modes[0]) ? this.memory[indexOfCurrentOpcode + 1] : this.memory[this.memory[indexOfCurrentOpcode + 1]]

        // todo might want to store this prints to an array or something and then print them all out together
        console.log('printing arg', argOne)

        indexOfCurrentOpcode += 2
      }

      if (currentIntsruction === IntCodeCompiler.JUMP_IF_TRUE_INSTRUCTION) {
        const argOne = this.useImmediateMode(modes[0]) ? this.memory[indexOfCurrentOpcode + 1] : this.memory[this.memory[indexOfCurrentOpcode + 1]]
        const argTwo = this.useImmediateMode(modes[1]) ? this.memory[indexOfCurrentOpcode + 2] : this.memory[this.memory[indexOfCurrentOpcode + 2]]

        if (argOne) indexOfCurrentOpcode = argTwo
        else indexOfCurrentOpcode += 3
      }

      if (currentIntsruction === IntCodeCompiler.JUMP_IF_FALSE_INSTRUCTION) {
        const argOne = this.useImmediateMode(modes[0]) ? this.memory[indexOfCurrentOpcode + 1] : this.memory[this.memory[indexOfCurrentOpcode + 1]]
        const argTwo = this.useImmediateMode(modes[1]) ? this.memory[indexOfCurrentOpcode + 2] : this.memory[this.memory[indexOfCurrentOpcode + 2]]

        if (argOne === 0) indexOfCurrentOpcode = argTwo
        else indexOfCurrentOpcode += 3
      }

      if (currentIntsruction === IntCodeCompiler.IS_LESS_THAN_INSTRUCTION) {
        const argOne = this.useImmediateMode(modes[0]) ? this.memory[indexOfCurrentOpcode + 1] : this.memory[this.memory[indexOfCurrentOpcode + 1]]
        const argTwo = this.useImmediateMode(modes[1]) ? this.memory[indexOfCurrentOpcode + 2] : this.memory[this.memory[indexOfCurrentOpcode + 2]]

        // writes never immediate
        this.memory[this.memory[indexOfCurrentOpcode + 3]] = argOne < argTwo ? 1 : 0

        indexOfCurrentOpcode += 4
      }

      if (currentIntsruction === IntCodeCompiler.IS_EQUAL_INSTRUCTION) {
        const argOne = this.useImmediateMode(modes[0]) ? this.memory[indexOfCurrentOpcode + 1] : this.memory[this.memory[indexOfCurrentOpcode + 1]]
        const argTwo = this.useImmediateMode(modes[1]) ? this.memory[indexOfCurrentOpcode + 2] : this.memory[this.memory[indexOfCurrentOpcode + 2]]

        // writes never immediate
        this.memory[this.memory[indexOfCurrentOpcode + 3]] = argOne === argTwo ? 1 : 0

        indexOfCurrentOpcode += 4
      }
    }

    return this.memory[0]
  }

  private parseOpcode (opcode: number) {
    const instruction = Number(opcode.toString().slice(-2))

    const modes = opcode.toString().slice(0, -2).split('').reverse().map(Number)

    return { instruction, modes }
  }

  private useImmediateMode (mode: number | undefined) {
    return mode === 1
  }
}
