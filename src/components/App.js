import '../styles/App.css';
import React from 'react';
const regexSpecialSign = /[\/x+-]/;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: `0`,
      operation: ``
    }
  }

  clear = () => {
    this.setState({
      result: `0`,
      operation: ``
    })
  }


  clickNumber = (event) => {
    this.setState((prevState) => {
      const valueToAdd = event.target.value;
      const isLastCharSpecial = regexSpecialSign.test(prevState.result.slice(-1));
      const isOperationLastCharZeroAfterSign = regexSpecialSign.test(prevState.operation.charAt(prevState.operation.length - 2)) && prevState.operation.slice(-1) === "0";
  
      const updateResult = prevState.result !== `0` && !isLastCharSpecial 
        ? prevState.result + valueToAdd 
        : valueToAdd;

      let updateOperation;
      if (isOperationLastCharZeroAfterSign) {
        updateOperation = prevState.operation.slice(0, -1) + valueToAdd;
      } else if (prevState.result === `0` && prevState.operation === '') {
        updateOperation = valueToAdd;
      } else if (!prevState.result.includes('.') || prevState.result !== `0`) {
        updateOperation = prevState.operation + valueToAdd;
      } else {
        updateOperation = prevState.operation;
      }
  
      return {
        result: updateResult,
        operation: updateOperation
      };
    });
  };

  clickAction = (event) => {
    this.setState((prevState) => {
      return prevState.operation.includes("=")
      ? {
          result: `0`,
          operation: `${prevState.result}${event.target.value}`
      }
      : regexSpecialSign.test(prevState.operation.slice(-1)) && !regexSpecialSign.test(prevState.operation.charAt(prevState.operation.length -2))
        ? {
          result: `${event.target.value}`,
          operation: `${prevState.operation.slice(0,-1)}${event.target.value}`
        }
        : regexSpecialSign.test(prevState.operation.charAt(prevState.operation.length - 2)) && prevState.operation.slice(-1) === "-"
          ? {
            result: `${event.target.value}`,
            operation: `${prevState.operation.slice(0,-2)}${event.target.value}`
          }
          : !prevState.operation
            ? {
              result: `${event.target.value}`,
              operation: `${event.target.value}`
            }
            : {
              result: `${event.target.value}`,
              operation: `${prevState.operation}${event.target.value}`
            }
    });
  }

  clickDecimal = (event) => {
    this.setState((prevState) => {
      const updateResult = !prevState.result.includes(`${event.target.value}`)
      ? prevState.result === `0` || regexSpecialSign.test(prevState.result.slice(-1))
        ? `0${event.target.value}`
        : `${prevState.result}${event.target.value}`
      : `${prevState.result}`;

      const updateOperation = !prevState.result.includes(`${event.target.value}`)
      ? regexSpecialSign.test(this.state.result) || this.state.result === "0"
        ? this.state.operation.slice(-1) === `0`
          ? `${prevState.operation}${event.target.value}`
          : `${prevState.operation}0${event.target.value}`
        : `${prevState.operation}${event.target.value}`
      : `${prevState.operation}`

      return {
        result: updateResult,
        operation: updateOperation
      }
    }); 
  }

  clickSubtract = (event) => {
    this.setState((prevState) => {
      const updateOperation = regexSpecialSign.test(prevState.operation.charAt(prevState.operation.length - 2)) 
      ? regexSpecialSign.test(prevState.operation.slice(-1))
        ?`${prevState.operation}`
        : `${prevState.operation}${event.target.value}`
      : `${prevState.operation}${event.target.value}`;

      return {
        result: `${event.target.value}`,
        operation: updateOperation
      }
    });
  }

  equal = () => {
    this.setState(prevState => {
      
      let updateOperation = "";
      let updateResult = "";
      let result = prevState.result;
      const arrOperations = this.cutAllOperations(prevState.operation);


      if(prevState.operation.includes("=")) {
        updateResult = `0`;
        updateOperation = `${result}`;
      } else if(arrOperations.length >= 3 && !prevState.operation.includes("=")) {

        result = this.calculateResult(arrOperations);
        updateOperation = `${prevState.operation}=${result}`;
        updateResult = `${result}`;
      }

      return {
        result: updateResult,
        operation: updateOperation
      }
    });
  }

  calculateResult = (arrOperations) => {
    let arrForOperations = [...arrOperations];
    let actualResult = 0;
    console.log(`Operation: ${arrForOperations}`);

    do {

      let indexOfMultiply = arrForOperations.indexOf("x");
      let indexOfDivide = arrForOperations.indexOf("/");
      let indexOfAdd = arrForOperations.indexOf("+");
      let indexOfSubtract = arrForOperations.indexOf("-");

      console.log(`Indexes: 
      (x : ${indexOfMultiply})
      (/ : ${indexOfDivide})
      (+ : ${indexOfAdd})
      (- : ${indexOfSubtract})`);

      let actualOperationsOrder = [];
      if(indexOfSubtract !== -1) actualOperationsOrder.splice(0,0, indexOfSubtract);
      if((indexOfAdd !== -1 && indexOfSubtract === -1) || (indexOfAdd !== -1 && indexOfAdd < indexOfSubtract)) actualOperationsOrder.splice(0,0, indexOfAdd)
      if(indexOfMultiply !== -1) actualOperationsOrder.splice(0,0, indexOfMultiply)
      if((indexOfDivide !== -1 && indexOfMultiply === -1) || (indexOfMultiply !== -1 && indexOfDivide < indexOfDivide)) {
        actualOperationsOrder.splice(0,0, indexOfDivide)
      }

      const indexOfSign = actualOperationsOrder[0];
      const actualSign = arrForOperations[indexOfSign];

      switch(actualSign) {
        case "x":
          actualResult = +arrForOperations[indexOfSign-1] * +arrForOperations[indexOfSign+1];
          break;
        case "/":
          actualResult = +arrForOperations[indexOfSign-1] / +arrForOperations[indexOfSign+1];
          break;
        case "+":
          actualResult = +arrForOperations[indexOfSign-1] + +arrForOperations[indexOfSign+1];
          break;
        case "-":
          actualResult = +arrForOperations[indexOfSign-1] - +arrForOperations[indexOfSign+1];
          break;
      }

      arrForOperations.splice(indexOfSign-1, 3, `${actualResult}`);
      console.log(`Operation: ${arrForOperations}`);
    } while(arrForOperations.length >= 3);

    console.log(`Result: ${arrForOperations}`);
    return arrForOperations;
  }

  cutAllOperations = (operation) => {
    let arrOperations = [];
    let actualPosition = ``;
    let previousSign = ``;

    if(regexSpecialSign.test(operation.slice(-1))) operation = operation.slice(0,-1);
    if(regexSpecialSign.test(operation.slice(-1))) operation = operation.slice(0,-1);

    operation.split('').forEach((sign) => {
      if(regexSpecialSign.test(sign)) {
        if(sign === "-") {
          if(regexSpecialSign.test(previousSign) || previousSign === ``) {
            actualPosition = actualPosition + sign;
          } else {
            if (actualPosition !== '') arrOperations.push(actualPosition);
            arrOperations.push(sign);
            actualPosition = ``;
          }
        } else {
          if (actualPosition !== '') arrOperations.push(actualPosition);
          arrOperations.push(sign);
          actualPosition = ``;
        }
      } else {
        actualPosition = actualPosition + sign;
      }

      previousSign = sign;
    });
    if (actualPosition !== '' && !regexSpecialSign.test(actualPosition.slice(-1))) arrOperations.push(actualPosition);

    return arrOperations;
  }

  render() {
    return (
      <div id="calculator-container">
        {/* First ROW */}
        <div id="display-container">
          <div id="display-second">{this.state.operation}</div>
          <div id="display">{this.state.result}</div>
        </div>
        {/* Second ROW */}
        <button id="clear" onClick={this.clear}>AC</button>
        <button id="divide" value="/" onClick={this.clickAction}>/</button>
        <button id="multiply" value="x" onClick={this.clickAction}>x</button>
        {/* Third ROW */}
        <button id="seven" value="7" onClick={this.clickNumber}>7</button>
        <button id="eight" value="8" onClick={this.clickNumber}>8</button>
        <button id="nine" value="9" onClick={this.clickNumber}>9</button>
        <button id="subtract" value="-" onClick={this.clickSubtract}>-</button>
        {/* Fourth ROW */}
        <button id="four" value="4" onClick={this.clickNumber}>4</button>
        <button id="five" value="5" onClick={this.clickNumber}>5</button>
        <button id="six" value="6" onClick={this.clickNumber}>6</button>
        <button id="add" value="+" onClick={this.clickAction}>+</button>
        {/* Fifth ROW */}
        <button id="one" value="1" onClick={this.clickNumber}>1</button>
        <button id="two" value="2" onClick={this.clickNumber}>2</button>
        <button id="three" value="3" onClick={this.clickNumber}>3</button>
        {/* Sixth ROW */}
        <button id="decimal" value="." onClick={this.clickDecimal}>.</button>
        <button id="zero" value="0" onClick={this.clickNumber}>0</button>
        <button id="equals" value="=" onClick={this.equal}>=</button>
      </div>
    );
}
}

export default App;
