import { useState } from "react";

function Square({value, onSquareClick, isAWinnerSq}) {
  
  return (
    <button
    className={"square" + (isAWinnerSq?" winner-square":"")}
    onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  
  const {winner, winnerSquares} = calculateWinner(squares);

  function handleClick(i) {
    const nextSquares = squares.slice();//slice copia si no tiene parametros (utilizamos inmutabilidad)

    if(winner || squares[i]) return;

    if(xIsNext){
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = "Ganador: " + winner;
  } else {
    if(squares.includes(null)) {
      status = "Siguiente jugador: " + (xIsNext ? "X" : "O");
    } else {
      status = "Empate"
    }
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

  return (
    <>
      <div className="status">{status}</div>
        {
          rows.map((row, index) => (
            <div key={index} className="board-row">
              {
                row.map(({value, key}, sqIndex) => (
                  <Square key={key} value={value} onSquareClick={()=>handleClick(key)} isAWinnerSq={winnerSquares.includes(key)}/>
                ))
              }
            </div>
          ))
        }
    </>
  );
}


function Moves({history, currentMove, onJump}) {
  const [reversed, setReversed] = useState(false);
  

  const moves = history.map((squares, move) => {
    return Move(move, calculateMovePosition(squares, history[Math.max(move-1, 0)]))
  })

  function Move(move, {fila, columna}) {
    let description;
    if(move > 0) {
      if(move === currentMove) {
        description = "Estás en el movimiento #" + move + "(" + fila + "," + columna + ")";
      } else {
        description = "Ir al movimiento #" + move + "(" + fila + "," + columna + ")";
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
   );
  }


  function reverseOrder() {
    setReversed(!reversed);
  }

  let sortedMoves;
  if(reversed) {
    sortedMoves = moves.reverse();
  } else {
    sortedMoves = moves;
  }

  return (
    <>
      <button onClick={reverseOrder}>Invertir orden</button>
      <ol reversed={reversed}>
        {sortedMoves}
      </ol>
    </>
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
      return {winner: squares[a], winnerSquares: [a, b, c]};
    }
  }
  return {winner: null, winnerSquares: []};
}

function calculateMovePosition(squares, previousSquares) {

  for(let i = 0; i < 9; i++) {
    if(squares[i] !== previousSquares [i]) {

      return {
        fila: i % 3 +1,
        columna: Math.floor(i / 3) + 1
      }
    }
  }

  return {fila: 0, columna: 0}
}