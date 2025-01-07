import { useState } from "react";

function Square({value, onSquareClick}) {
  
  
  
  return (
    <button
    className="square"
    onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  

  function handleClick(i) {
    const nextSquares = squares.slice();//slice copia si no tiene parametros (utilizamos inmutabilidad)

    if(calculateWinner(squares) || squares[i]) return;

    if(xIsNext){
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Ganador: " + winner;
  } else {
    status = "Siguiente jugador: " + (xIsNext ? "X" : "O");
  }

  //declare and initialize row array and square counter (0 to 8)
  let rows = [];
  let sqCounter = 0;

  //fill the 3 rows with 3 squares each.
  for(let i = 0; i < 3; i++) {
    //push an empty square array...
    rows.push([]);
    //...and fill it with the 3 squares of that row
    for(let j = 0; j < 3; j++) {
      rows[i].push({value: squares[sqCounter], key: sqCounter});
      sqCounter++;
    };
  };

  //to render it, use 2 maps to transform the data into proper <Square/> components
  //I learned that JS loops can't be used inside of JSX, so I had to arrange the data in arrays that i can later transform into JSX inside of return sentence
  //this would be similar to real life data from databases or api calls

  return (
    <>
      <div className="status">{status}</div>
        {
          rows.map((row, index) => (
            <div key={index} className="board-row">
              {
                row.map(({value, key}, sqIndex) => (
                  <Square key={key} value={value} onSquareClick={()=>handleClick(key)}/>
                ))
              }
            </div>
          ))
        }
    </>
  );
}


function Moves({history, currentMove, onJump}) {

  const moves = history.map((squares, move) => {
    let description;
    if(move > 0) {
       if(move === currentMove) {
        description = "Estás en el movimiento #" + move;
       } else {
        description = "Ir al movimiento #" + move;
       }
    } else {
      if(move === currentMove) {
        description = "Estás en el inicio del juego";
      } else {
        description = "Ir al inicio del juego";
      }
    }

    return (
      <li key={move}>
        <button onClick={() => onJump(move)}>{description}</button>
      </li>
    )

  })

  return (
    <ol>
      {moves}
    </ol>
  );

}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
    

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <Moves history={history} currentMove={currentMove} onJump={jumpTo}/>
      </div>

    </div>
  );
}







function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}