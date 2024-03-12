import '../styles/App.css';
import React from 'react';
const regexSpecialSign = /[\/x+-]/;
const regexLastNumberWithSign = /[\+\-x\/]-?\d+(\.\d+)?$/g;

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

  /*clickNumber = (event) => {
    this.setState((prevState) => {
      const updateResult = prevState.result !== `0` && !regexSpecialSign.test(prevState.result.slice(-1)) 
      ? `${prevState.result}${event.target.value}` 
      : `${event.target.value}`;

      let updateOperation = prevState.result !== `0` && !regexSpecialSign.test(prevState.result) 
      ? `${prevState.operation}${event.target.value}` 
      : prevState.result === `0` 
        ? prevState.operation === '' 
          ? `${event.target.value}`
          : !prevState.result.includes('.')
            ? `${prevState.operation}`
            : `${prevState.operation}${event.target.value}`
        : `${prevState.operation}${event.target.value}`;
       
        updateOperation = regexSpecialSign.test(prevState.operation.charAt(prevState.operation.length - 2)) && prevState.operation.slice(-1) === "0"
        ? `${prevState.operation.slice(0, -1)}${event.target.value}`
        : updateOperation;

      return {
        result: updateResult,
        operation: updateOperation
      }
    });
  }*/

  clickNumber = (event) => {
    this.setState((prevState) => {
      const valueToAdd = event.target.value;
      const isLastCharSpecial = regexSpecialSign.test(prevState.result.slice(-1));
      const isOperationLastCharZeroAfterSign = regexSpecialSign.test(prevState.operation.charAt(prevState.operation.length - 2)) && prevState.operation.slice(-1) === "0";
  
      // Uproszczenie aktualizacji result
      const updateResult = prevState.result !== `0` && !isLastCharSpecial 
        ? prevState.result + valueToAdd 
        : valueToAdd;
  
      // Uproszczenie aktualizacji operation
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
      return regexSpecialSign.test(prevState.operation.slice(-1))
      ? {
        result: `${event.target.value}`,
        operation: `${prevState.operation.slice(0,-1)}${event.target.value}`
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

  clickSubstract = (event) => {
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

  equal = (event) => {
    const equalSign = event.target.value;

    const arrOperations = this.cutAllOperations(this.state.operation);

    console.log(arrOperations);
  }

  cutAllOperations = (operation) => {
    let arrOperations = [];
    let actualPosition = ``;
    let previousSign = ``;

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
    if (actualPosition !== '' && !regexSpecialSign.test(actualPosition)) arrOperations.push(actualPosition);

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
        <button id="substract" value="-" onClick={this.clickSubstract}>-</button>
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
