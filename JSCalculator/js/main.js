// calculator object to store calculations
class Calculator {
    // calculations made of a prev and curr number, start cleared
    constructor(prevOperandTextElement, currOperandTextElement) {
        this.prevOperandTextElement = prevOperandTextElement;
        this.currOperandTextElement = currOperandTextElement;
        this.clear();
    }

    // clears curr, prev, and operation values
    clear() {
        this.currOperand = ''
        this.prevOperand = ''
        this.operation = undefined
    }

    // converts value to string and removes last index
    delete() {
        this.currOperand = this.currOperand.toString().slice(0, -1)
    }

    // adds number to the current value
    appendNumber(number) {
        // check if the calue contains a decimal and only allow one
        if (number === '.' && this.currOperand.includes('.')) return

        // appends numbers together and if a number is pressed after calculation it will start new
        if (this.computation !== null && this.currOperand === this.computation) {
            this.currOperand = number
        } else {
            this.currOperand = this.currOperand.toString() + number.toString()
        }
   }

   // handles operation computation and display
   chooseOperation(operation) {
       if (this.currOperand === '') return

       // compute if an operand is found
       if (this.prevOperand !== '') {
           this.compute()
        }

        // global the operation and moves the current operand to the previous
        this.operation = operation
        this.prevOperand = this.currOperand
        this.currOperand = ''
    }

    // handles number computation
    compute() {
        let computation
        const prev = parseFloat(this.prevOperand)
        const curr = parseFloat(this.currOperand)
        
        if (isNaN(prev) || isNaN(curr)) return

        switch (this.operation) {
            case '+':
                computation = prev + curr
                break
            case '*':
                computation = prev * curr
                break
            case '-':
                computation = prev - curr
                break
            case '÷':
                computation = prev / curr
                break
            default:
                return
        }
        this.currOperand = computation
        this.computation = computation
        this.operation = undefined
        this.prevOperand = ''
    }

    // formats number with commas
    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const intDigits = parseFloat(stringNumber.split('.')[0])
        const decDigits = stringNumber.split('.')[1]

        let intDisplay

        if (isNaN(intDigits)) {
            intDisplay = ''
        } else {
            intDisplay = intDigits.toLocaleString('en', {
                maximumFractionDigits: 0 })
        }
        if (decDigits != null) {
            return `${intDisplay}.${decDigits}`
        } else {
            return intDisplay
        }
    }

    // updates the display text of the html output
    updateDisplay() {
        this.currOperandTextElement.innerHTML = this.getDisplayNumber(this.currOperand)
        if (this.operation != null) {
            this.prevOperandTextElement.innerText = `${this.getDisplayNumber(this.prevOperand)} ${this.operation}`
        } else {
            this.prevOperandTextElement.innerText = ''
        }
    }
}

// grab document data
const numButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const prevOperandTextElement = document.querySelector('[data-prev-operand]')
const currOperandTextElement = document.querySelector('[data-curr-operand]')


document.getElementById("year").innerHTML = new Date().getFullYear();

const calc = new Calculator(prevOperandTextElement, currOperandTextElement)

// apply function to each number button
numButtons.forEach(button => {
    button.addEventListener('click', () => {
        calc.appendNumber(button.innerText)
        calc.updateDisplay()
    })
})

// apply function to each operation button
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calc.chooseOperation(button.innerText)
        calc.updateDisplay()
    })
})

// apply function to equals button
equalsButton.addEventListener('click', button => {
    calc.compute()
    calc.updateDisplay()
})

// apply function to clear button
allClearButton.addEventListener('click', button => {
    calc.clear()
    calc.updateDisplay()
})

// apply function to delete button
deleteButton.addEventListener('click', button => {
    calc.delete()
    calc.updateDisplay()
})