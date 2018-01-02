import React from 'react'; //import react
import ReactDOM from 'react-dom'; //import react Document Object Model
import './index.css';


function Square(props) { //takes props and returns what should be rendered
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
    <Square
      value={this.props.squares[i]} //passes array value prop to the Square
      onClick={() => this.props.onClick(i)} //function linking to square passing value & onClick props
      />
    ); //parentheses added so return doesn't have semicolon and breakc code
  }

    render() {
      return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
  
  class Game extends React.Component {
    constructor(props) { //initial state of game
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }], //current state of the board saved in history
        stepNumber: 0,
        xIsNext: true
      };
    }

    handleClick(i) { //squares are now controlled components. Their value is determined by their parent component
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice(); //copy square array (immutability) squares state held in board component, not individual squares 
      if (calculateWinner(squares) || squares[i]) { //if someone has already won, ignore click
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O'; //
      this.setState({
         history: history.concat([{ //add new history entry on to the history object
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext, //flip state of boolean
      }); //immutability helps increase component/app performance
    } //if the original data is changed then referring to older versions of data becomes extremely complex

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key = {move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board             
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
          <div className = "status">{status}</div>
          <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [ //winning combos
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
