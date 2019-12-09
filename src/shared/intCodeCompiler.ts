// warning the refactor for this currently causes day 2 and day 5 to no longer work
// todo refactor day 2 and day 5 to work with refactored code
export enum ExecutionStatus {
  Finished,
  Reset,
  RequestingInput
}

enum IntCodeInstructions {
  ADD_INSTRUCTION = 1,
  MULT_INSTRUCTION = 2,
  SAVE_INSTRUCTION = 3,
  PRINT_INSTRUCTION = 4,
  JUMP_IF_TRUE_INSTRUCTION = 5,
  JUMP_IF_FALSE_INSTRUCTION = 6,
  IS_LESS_THAN_INSTRUCTION = 7,
  IS_EQUAL_INSTRUCTION = 8,
  ADJUST_RELATIVE_BASE = 9,
  HALT_INSTRUCTION = 99
}

enum ExecutionModes {
  POSITION_MODE = 0,
  IMMEDIATE_MODE = 1,
  RELATIVE_MODE = 2
}

export class IntCodeCompiler {
  // used to reset int code compiler without the need for running a full constructor
  private givenCode: number[]
  private givenProgramaticInput: number[]
  private indexOfCurrentOpcode = 0
  private relativeBase = 0

  public memory: number[]
  public programaticInput: number[]
  public programOutput: number[] = []
  public executionStatus: ExecutionStatus

  constructor (code: string, programaticInput: number[] = []) {
    this.memory = code.split(',').map(Number)
    this.givenCode = [ ...this.memory ]

    this.programaticInput = programaticInput
    this.givenProgramaticInput = [ ...this.programaticInput ]
    this.executionStatus = ExecutionStatus.Reset
  }

  reset () {
    this.memory = [ ...this.givenCode ]
    this.programaticInput = [ ...this.givenProgramaticInput ]
    this.programOutput = []
    this.indexOfCurrentOpcode = 0
    this.executionStatus = ExecutionStatus.Reset
    this.relativeBase = 0

    return this
  }

  execute () {
    let currentInstruction = null
    while (currentInstruction !== IntCodeInstructions.HALT_INSTRUCTION && this.indexOfCurrentOpcode < this.memory.length) {
      const { instruction, modes } = this.parseOpcode(this.memory[this.indexOfCurrentOpcode])
      currentInstruction = instruction

      switch (currentInstruction) {
        case IntCodeInstructions.ADD_INSTRUCTION:
          this.addInstruction(modes)
          break
        case IntCodeInstructions.MULT_INSTRUCTION:
          this.multInstruction(modes)
          break
        case IntCodeInstructions.SAVE_INSTRUCTION:
          const successful = this.saveInstruction(modes)
          if (!successful) {
            this.executionStatus = ExecutionStatus.RequestingInput
            return this
          }
          break
        case IntCodeInstructions.PRINT_INSTRUCTION:
          this.printInstruction(modes)
          break
        case IntCodeInstructions.JUMP_IF_TRUE_INSTRUCTION:
          this.jumpIfTrueInstruction(modes)
          break
        case IntCodeInstructions.JUMP_IF_FALSE_INSTRUCTION:
          this.jumpIfFalseInstruction(modes)
          break
        case IntCodeInstructions.IS_LESS_THAN_INSTRUCTION:
          this.isLessThanInstruction(modes)
          break
        case IntCodeInstructions.IS_EQUAL_INSTRUCTION:
          this.isEqualInstruction(modes)
          break
        case IntCodeInstructions.ADJUST_RELATIVE_BASE:
          this.adjustRelativeBaseInstruction(modes)
          break
        case IntCodeInstructions.HALT_INSTRUCTION:
          break
        default:
          throw new Error(`Unable to executure instruction ${instruction} in memory location ${this.indexOfCurrentOpcode}`)
      }
    }

    this.executionStatus = ExecutionStatus.Finished
    return this
  }

  private addInstruction (modes: number[]) {
    const argOne = this.pullDataFromMemory(modes[0], 1)
    const argTwo = this.pullDataFromMemory(modes[1], 2)

    this.saveToMemory(argOne + argTwo, /** offset */ 3, modes[2])
    this.indexOfCurrentOpcode += 4
  }

  private multInstruction (modes: number[]) {
    const argOne = this.pullDataFromMemory(modes[0], 1)
    const argTwo = this.pullDataFromMemory(modes[1], 2)

    this.saveToMemory(argOne * argTwo, /** offset */ 3, modes[2])
    this.indexOfCurrentOpcode += 4
  }

  /**
   *
   * @retrns boolean - returns true if instruction executed successfully, false if there was no input
   */
  private saveInstruction (modes: number[]) {
    if (!this.programaticInput.length) return false

    const input = this.programaticInput.shift() as number

    // currently only expected to work with relative and position mode
    this.pullDataFromMemory(modes[1], 1)
    this.saveToMemory(input, /** offset */ 1, modes[0])

    this.indexOfCurrentOpcode += 2
    return true
  }

  private printInstruction (modes: number[]) {
    const argOne = this.pullDataFromMemory(modes[0], 1)

    this.programOutput.push(argOne)

    this.indexOfCurrentOpcode += 2
  }

  private jumpIfTrueInstruction (modes: number[]) {
    const argOne = this.pullDataFromMemory(modes[0], 1)
    const argTwo = this.pullDataFromMemory(modes[1], 2)

    if (argOne) this.indexOfCurrentOpcode = argTwo
    else this.indexOfCurrentOpcode += 3
  }

  private jumpIfFalseInstruction (modes: number[]) {
    const argOne = this.pullDataFromMemory(modes[0], 1)
    const argTwo = this.pullDataFromMemory(modes[1], 2)

    if (argOne === 0) this.indexOfCurrentOpcode = argTwo
    else this.indexOfCurrentOpcode += 3
  }

  private isLessThanInstruction (modes: number[]) {
    const argOne = this.pullDataFromMemory(modes[0], 1)
    const argTwo = this.pullDataFromMemory(modes[1], 2)

    this.saveToMemory(argOne < argTwo ? 1 : 0, /** offset */ 3, modes[2])

    this.indexOfCurrentOpcode += 4
  }

  private isEqualInstruction (modes: number[]) {
    const argOne = this.pullDataFromMemory(modes[0], 1)
    const argTwo = this.pullDataFromMemory(modes[1], 2)

    this.saveToMemory(argOne === argTwo ? 1 : 0, /** offset */ 3, modes[2])

    this.indexOfCurrentOpcode += 4
  }

  private adjustRelativeBaseInstruction (modes: number[]) {
    const argOne = this.pullDataFromMemory(modes[0], 1)

    this.relativeBase += argOne
    this.indexOfCurrentOpcode += 2
  }

  private parseOpcode (opcode: number) {
    const instruction = Number(opcode.toString().slice(-2))

    const modes = opcode.toString().slice(0, -2).split('').reverse().map(Number)

    return { instruction, modes }
  }

  private pullDataFromMemory (mode: number | undefined, offset: number) {
    let data: number | undefined
    switch (mode) {
      case ExecutionModes.IMMEDIATE_MODE:
        data = this.memory[this.indexOfCurrentOpcode + offset]
        break
      case ExecutionModes.RELATIVE_MODE:
        data = this.memory[this.relativeBase + this.memory[this.indexOfCurrentOpcode + offset]]
        break
      case ExecutionModes.POSITION_MODE:
      default:
        data = this.memory[this.memory[this.indexOfCurrentOpcode + offset]]
        break
    }

    // returning 0 by default adds support for saving to memory addresses that were not defined when the code was given
    // tslint:disable-next-line
    return data === undefined ? 0 : data
  }

  // currently, writes never immediate
  private saveToMemory (data: number, offset: number, mode: number) {
    if (mode === ExecutionModes.RELATIVE_MODE) this.memory[this.relativeBase + this.memory[this.indexOfCurrentOpcode + offset]] = data
    else this.memory[this.memory[this.indexOfCurrentOpcode + offset]] = data
  }
}
