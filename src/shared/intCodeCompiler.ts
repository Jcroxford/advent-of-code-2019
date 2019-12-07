// todo print memeory address with print output?
// warning the refactor for this currently causes day 2 and day 5 to no longer work
// todo refactor day 2 and day 5 to work with refactored code
// todo create instruction enum
export enum ExecutionStatus {
  Finished,
  Reset,
  RequestingInput
}

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

  // used to reset int code compiler without the need for running a full constructor
  private givenCode: number[]
  private givenProgramaticInput: number[]
  private logProgramOutput: boolean
  private indexOfCurrentOpcode = 0

  public memory: number[]
  public programaticInput: number[]
  public programOutput: number[] = []
  public executionStatus: ExecutionStatus

  constructor (code: string, programaticInput: number[] = [], logProgramOutput: boolean = false) {
    this.memory = code.split(',').map(Number)
    this.givenCode = [ ...this.memory ]
    this.logProgramOutput = logProgramOutput

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

    return this
  }

  // same as execute except does not return value of first item in memoery and instead dot chainable
  chainableExecute () {
    this.execute()
    return this
  }

  /**
   * right now assumes whatever is at index 0 after execution should be the return value
   */
  execute (): ExecutionStatus {
    let currentInstruction = null
    while (currentInstruction !== IntCodeCompiler.HALT_INSTRUCTION && this.indexOfCurrentOpcode < this.memory.length) {
      const { instruction, modes } = this.parseOpcode(this.memory[this.indexOfCurrentOpcode])
      currentInstruction = instruction

      switch (currentInstruction) {
        case IntCodeCompiler.ADD_INSTRUCTION:
          this.addInstruction(modes)
          break
        case IntCodeCompiler.MULT_INSTRUCTION:
          this.multInstruction(modes)
          break
        case IntCodeCompiler.SAVE_INSTRUCTION:
          const successful = this.saveInstruction()
          if (!successful) {
            this.executionStatus = ExecutionStatus.RequestingInput
            return this.executionStatus
          }
          break
        case IntCodeCompiler.PRINT_INSTRUCTION:
          this.printInstruction(modes)
          break
        case IntCodeCompiler.JUMP_IF_TRUE_INSTRUCTION:
          this.jumpIfTrueInstruction(modes)
          break
        case IntCodeCompiler.JUMP_IF_FALSE_INSTRUCTION:
          this.jumpIfFalseInstruction(modes)
          break
        case IntCodeCompiler.IS_LESS_THAN_INSTRUCTION:
          this.isLessThanInstruction(modes)
          break
        case IntCodeCompiler.IS_EQUAL_INSTRUCTION:
          this.isEqualInstruction(modes)
          break
        default:
          throw new Error(`Unable to executure instruction ${instruction} in memory location ${this.indexOfCurrentOpcode}`)
      }
    }

    this.executionStatus = ExecutionStatus.Finished
    return this.executionStatus
  }

  private addInstruction (modes: number[]) {
    const argOne = this.useImmediateMode(modes[0]) ? this.memory[this.indexOfCurrentOpcode + 1] : this.memory[this.memory[this.indexOfCurrentOpcode + 1]]
    const argTwo = this.useImmediateMode(modes[1]) ? this.memory[this.indexOfCurrentOpcode + 2] : this.memory[this.memory[this.indexOfCurrentOpcode + 2]]

    // writes never immediate
    this.memory[this.memory[this.indexOfCurrentOpcode + 3]] = argOne + argTwo
    this.indexOfCurrentOpcode += 4
  }

  private multInstruction (modes: number[]) {
    const argOne = this.useImmediateMode(modes[0]) ? this.memory[this.indexOfCurrentOpcode + 1] : this.memory[this.memory[this.indexOfCurrentOpcode + 1]]
    const argTwo = this.useImmediateMode(modes[1]) ? this.memory[this.indexOfCurrentOpcode + 2] : this.memory[this.memory[this.indexOfCurrentOpcode + 2]]

    // writes never immediate
    this.memory[this.memory[this.indexOfCurrentOpcode + 3]] = argOne * argTwo
    this.indexOfCurrentOpcode += 4
  }

  /**
   *
   * @retrns boolean - returns true if instruction executed successfully, false if there was no input
   */
  private saveInstruction () {
    if (!this.programaticInput.length) return false

    const input = this.programaticInput.shift() as number

    // writes never immediate
    this.memory[this.memory[this.indexOfCurrentOpcode + 1]] = input

    this.indexOfCurrentOpcode += 2
    return true
  }

  private printInstruction (modes: number[]) {
    const argOne = this.useImmediateMode(modes[0]) ? this.memory[this.indexOfCurrentOpcode + 1] : this.memory[this.memory[this.indexOfCurrentOpcode + 1]]

    this.programOutput.push(argOne)
    if (this.logProgramOutput) console.log('printing arg', argOne)

    this.indexOfCurrentOpcode += 2
  }

  private jumpIfTrueInstruction (modes: number[]) {
    const argOne = this.useImmediateMode(modes[0]) ? this.memory[this.indexOfCurrentOpcode + 1] : this.memory[this.memory[this.indexOfCurrentOpcode + 1]]
    const argTwo = this.useImmediateMode(modes[1]) ? this.memory[this.indexOfCurrentOpcode + 2] : this.memory[this.memory[this.indexOfCurrentOpcode + 2]]

    if (argOne) this.indexOfCurrentOpcode = argTwo
    else this.indexOfCurrentOpcode += 3
  }

  private jumpIfFalseInstruction (modes: number[]) {
    const argOne = this.useImmediateMode(modes[0]) ? this.memory[this.indexOfCurrentOpcode + 1] : this.memory[this.memory[this.indexOfCurrentOpcode + 1]]
    const argTwo = this.useImmediateMode(modes[1]) ? this.memory[this.indexOfCurrentOpcode + 2] : this.memory[this.memory[this.indexOfCurrentOpcode + 2]]

    if (argOne === 0) this.indexOfCurrentOpcode = argTwo
    else this.indexOfCurrentOpcode += 3
  }

  private isLessThanInstruction (modes: number[]) {
    const argOne = this.useImmediateMode(modes[0]) ? this.memory[this.indexOfCurrentOpcode + 1] : this.memory[this.memory[this.indexOfCurrentOpcode + 1]]
    const argTwo = this.useImmediateMode(modes[1]) ? this.memory[this.indexOfCurrentOpcode + 2] : this.memory[this.memory[this.indexOfCurrentOpcode + 2]]

    // writes never immediate
    this.memory[this.memory[this.indexOfCurrentOpcode + 3]] = argOne < argTwo ? 1 : 0

    this.indexOfCurrentOpcode += 4
  }

  private isEqualInstruction (modes: number[]) {
    const argOne = this.useImmediateMode(modes[0]) ? this.memory[this.indexOfCurrentOpcode + 1] : this.memory[this.memory[this.indexOfCurrentOpcode + 1]]
    const argTwo = this.useImmediateMode(modes[1]) ? this.memory[this.indexOfCurrentOpcode + 2] : this.memory[this.memory[this.indexOfCurrentOpcode + 2]]

    // writes never immediate
    this.memory[this.memory[this.indexOfCurrentOpcode + 3]] = argOne === argTwo ? 1 : 0

    this.indexOfCurrentOpcode += 4
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
