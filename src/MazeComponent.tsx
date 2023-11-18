import React, { useState } from 'react';
import classnames from 'classnames';

import { Maze, CellType } from './Maze';
import { AlgoState, NodeState } from './AlgoState';

interface MazeProps {
  width: number;
  height: number;
  maze: Maze;
  algoState: AlgoState;

  onChangeCell: (row: number, col: number, cellType: CellType) => void;
}

export function MazeComponent(props: MazeProps) {
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseState, setMouseState] = useState(CellType.Clear);

  function handleMouseEnter(row: number, col: number) {
    if (mouseDown) {
      props.onChangeCell(row, col, mouseState);
    }
  }

  function handleMouseDown(event: React.MouseEvent, row: number, col: number) {
    if (event.button !== 0) {
      return;
    }

    setMouseDown(true);
    const ct = props.maze.getCellType(row, col);

    let newMouseState = CellType.Blocked;

    switch (ct) {
      case CellType.Blocked:
      case CellType.Slow:
        newMouseState = CellType.Clear;
        break;
      case CellType.Clear:
        newMouseState = CellType.Blocked;
        break;
    }

    if (event.shiftKey) {
      newMouseState = CellType.Slow;
    }

    setMouseState(newMouseState);

    props.onChangeCell(row, col, newMouseState);
  }

  function handleMouseUp(_row: number, _col: number) {
    setMouseDown(false);
  }

  const { width, height, maze, algoState } = props;

  const rows = [];
  for (let r = 0; r < height; r++) {
    const cells = [];

    for (let c = 0; c < width; c++) {
      const ct = maze.getCellType(r, c);

      const nodeState = algoState.getState(r, c);
      const classes = classnames(
        ct === CellType.Blocked ? 'blocked' : '',
        ct === CellType.Slow ? 'slow' : '',
        nodeState === NodeState.Current ? 'current' : '',
        nodeState === NodeState.Open ? 'open' : '',
        nodeState === NodeState.Closed ? 'closed' : '',
        nodeState === NodeState.Goal ? 'goal' : '',
        nodeState === NodeState.OnFinalPath ? 'finalPath' : ''
      );

      const fScore = Math.round(algoState.getFValue(r, c) * 10) / 10;
      const fScoreText = isNaN(fScore) ? '' : fScore.toString();
      const gScore = Math.round(algoState.getGValue(r, c) * 10) / 10;
      const gScoreText = isNaN(gScore) ? '' : gScore.toString();

      cells.push(
        <td
          key={c}
          onMouseDown={(e) => handleMouseDown(e, r, c)}
          onMouseUp={() => handleMouseUp(r, c)}
          onMouseEnter={() => handleMouseEnter(r, c)}
          className={classes}
        >
          {fScoreText}
          <br />
          {gScoreText}
        </td>
      );
    }
    rows.push(<tr key={r}>{cells}</tr>);
  }

  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
}
