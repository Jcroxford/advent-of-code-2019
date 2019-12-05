export class IntCodeCompiler {
  // constants/opcodes/instructions
  static ADD_INSTRUCTION = 1
  static MULT_INSTRUCTION = 2
  static HALT_INSTRUCTION = 99

  public memory: number[]

  constructor (input: string) {
    this.memory = input.split(',').map(Number)
  }

  /**
   * right now assumes whatever is at index 0 after execution should be the return value
   */
  execute () {
    let indexOfCurrentInstruction = 0
    let currentIntsruction = null
    let argOneAddr = null
    let argTwoAddr = null
    let saveAddr = null
    while (currentIntsruction !== IntCodeCompiler.HALT_INSTRUCTION && indexOfCurrentInstruction < this.memory.length) {
      currentIntsruction = this.memory[indexOfCurrentInstruction]
      argOneAddr = this.memory[indexOfCurrentInstruction + 1]
      argTwoAddr = this.memory[indexOfCurrentInstruction + 2]
      saveAddr = this.memory[indexOfCurrentInstruction + 3]

      const argOne = this.memory[argOneAddr]
      const argTwo = this.memory[argTwoAddr]

      switch (currentIntsruction) {
        case IntCodeCompiler.ADD_INSTRUCTION:
          this.memory[saveAddr] = argOne + argTwo
          break
        case IntCodeCompiler.MULT_INSTRUCTION:
          this.memory[saveAddr] = argOne * argTwo
          break
      }

      indexOfCurrentInstruction += 4
    }

    return this.memory[0]
  }
}
