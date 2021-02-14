import React, { useCallback, useState, useRef} from 'react';
import produce from 'immer';

const nrows = 50;
const ncols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]

const App: React.FC = () => {
  const [grid, set_grid] = useState(() => {
    const grid: number[][] = [];
    for (let i = 0; i < nrows; i++)
      grid.push(Array.from(Array(ncols), () => 0));
    return grid
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current){
      return;
    }
    set_grid(grid => 
      produce(grid, 
        new_grid => {
          for (let i = 0; i < nrows; i++) {
            for (let j = 0; j < ncols; j++) {
              let neighbors = 0;
              operations.forEach(
                ([x, y]) => {
                  const new_i = i + x;
                  const new_j = j + y;
                  if (new_i >= 0 && new_i < nrows && new_j >=0 && new_j < ncols){
                    neighbors += grid[new_i][new_j];
                  }
                }
              )
              if (neighbors === 3 || (neighbors === 2 && grid[i][j] === 1))
                new_grid[i][j] = 1;
              else
                new_grid[i][j] = 0;
            }
          }
        }
      )
    )
    setTimeout(runSimulation, 300);
  }, []);

  return (
    <>
      <button 
        onClick = {
          () => {
            setRunning(!running);
            if (!running){
              runningRef.current = true;
              runSimulation();
            }
          }
        }
      >
        {running ? 'stop' : 'start'}
      </button>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${ncols}, 22px)`
        }}>
        {grid.map((rows, i) => 
          rows.map((col, j) => 
            <div
              key={`${i}-${j}`}
              onClick= {() => {
                set_grid(produce(grid, new_grid => {
                  new_grid[i][j] = 1 - grid[i][j];
                }));
              }}
              style={{
                width: 20,
                height:20, 
                backgroundColor: grid[i][j] ? 'blue' : undefined,
                border: 'solid 1px black'}}>
            </div>))}
      </div>
    </>
  );
};

export default App;