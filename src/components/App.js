import '../styles/App.css';
import React from 'react';
const regexSpecialSign = /[\/x+]/;

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
      if(prevState.result !== `0` && !regexSpecialSign.test(prevState.result.slice(-1))) {
        return { result: `${prevState.result}${event.target.value}` }
      } else {
        return { result: `${event.target.value}` }
      }
    });

    this.setState((prevState) => {
      if(prevState.operation) {
        return { operation: `${prevState.operation}${event.target.value}` }
      } else {
        return { operation: `${event.target.value}` }
      }
    });
  }

  clickAction = (event) => {
    this.setState((prevState) => {
      let lastSign = prevState.operation.slice(-1);

      if(regexSpecialSign.test(lastSign)) {
        return {
          result: `${event.target.value}`,
          operation: `${prevState.operation.slice(0,-1)}${event.target.value}`
        }
      } else if (!prevState.operation) {
        return {
          result: `${event.target.value}`,
          operation: `${event.target.value}`
        }
      } else {
        return {
          result: `${event.target.value}`,
          operation: `${prevState.operation}${event.target.value}`
        }
      }
    });
  }

  clickDecimal = (event) => {
    this.setState((prevState) => {
      if(!prevState.result.includes(".")) {
        console.log(`!prevState.includes`);
        if(prevState.result === `0` || regexSpecialSign.test(prevState.result.slice(-1))) {
          console.log(`prev === 0 || regex`);
          return { result: `0.` }
        } else {
          console.log(`else`);
          return { result: `${prevState.result}.` }
        }
      }
    });
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
        <button id="substract">-</button>
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
        <button id="decimal" onClick={this.clickDecimal}>.</button>
        <button id="zero" value="0" onClick={this.clickNumber}>0</button>
        <button id="equals">=</button>
      </div>
    );
}
}

export default App;
