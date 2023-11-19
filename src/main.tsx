import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import './main.css';

import { MazeComponent } from './MazeComponent';
import { AlgoControlComponent } from './AlgoControlComponent';

import { Maze, CellType } from './Maze';
import { AStar, AStarInput } from './Algorithm';
import { MyNode } from './MyNode';

const MAZE_WIDTH = 30;
const MAZE_HEIGHT = 20;

const mazeData = new Maze();

// root definitely exists
const reactRoot = ReactDOM.createRoot(document.getElementById('root')!);

for (let i = 3; i < 13; i++) {
  mazeData.setCellType(i, 3, CellType.Blocked);
  mazeData.setCellType(i, 6, CellType.Blocked);
}
for (let i = 0; i < 3; i++) {
  mazeData.setCellType(3, i, CellType.Blocked);
}

class MazeConfig implements AStarInput<MyNode> {
  constructor(private maze: Maze) {}

  getHeuristicCostEstimate(n1: MyNode, n2: MyNode): number {
    return Math.abs(n1.row - n2.row) + Math.abs(n1.col - n2.col);
    // return Math.sqrt(Math.pow(n1.row - n2.row, 2) + Math.pow(n1.col - n2.col, 2));
  }

  getActualNeighbourDistance(n1: MyNode, n2: MyNode): number {
    let basic = Math.abs(n1.row - n2.row) + Math.abs(n1.col - n2.col);
    const cellType1 = this.maze.getCellType(n1.row, n1.col);
    const cellType2 = this.maze.getCellType(n2.row, n2.col);
    if (cellType1 === CellType.Slow) {
      basic += 1;
    }

    if (cellType2 === CellType.Slow) {
      basic += 1;
    }

    return basic;
  }

  getNeighbours(node: MyNode): MyNode[] {
    const result = [];

    if (node.row > 0) {
      result.push(new MyNode(node.row - 1, node.col));
    }

    if (node.row < MAZE_HEIGHT - 1) {
      result.push(new MyNode(node.row + 1, node.col));
    }

    if (node.col > 0) {
      result.push(new MyNode(node.row, node.col - 1));
    }

    if (node.col < MAZE_WIDTH - 1) {
      result.push(new MyNode(node.row, node.col + 1));
    }

    const newResult = result.filter(
      (n) => this.maze.getCellType(n.row, n.col) !== CellType.Blocked
    );
    return newResult;
  }
}

const config = new MazeConfig(mazeData);

const alg = new AStar(new MyNode(0, 0), new MyNode(16, 25), config);

function handleCellClick(row: number, col: number, newType: CellType) {
  mazeData.setCellType(row, col, newType);
  render();
}

let isRunning = false;
let intervalHandle: number | undefined;

function toggleRunning() {
  isRunning = !isRunning;

  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = undefined;
  } else {
    intervalHandle = window.setInterval(step, 1);
  }
}

function reset() {
  alg.reset();
  render();
}
function save() {
  mazeData.save();
  render();
}
function load() {
  mazeData.load();
  render();
}
function render() {
  reactRoot.render(
    <React.StrictMode>
      <div>
        <MazeComponent
          width={MAZE_WIDTH}
          height={MAZE_HEIGHT}
          maze={mazeData}
          algoState={alg}
          onChangeCell={handleCellClick}
        />
        <AlgoControlComponent
          running={isRunning}
          onStopStartToggled={toggleRunning}
        />
        <button onClick={reset}>Reset</button>
        <button onClick={save}>Save</button>
        <button onClick={load}>Load</button>
      </div>
    </React.StrictMode>
  );
}

function step() {
  let stepsToRun = 5;

  while (stepsToRun--) {
    if (!alg.step()) {
      toggleRunning();
      break;
    }
  }

  render();
}
render();
