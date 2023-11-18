import React from 'react';
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

export class MazeComponent extends React.Component<MazeProps> {
  private mouseDown = false;
  private mouseState: CellType = CellType.Clear;

  handleMouseEnter(row: number, col: number) {
    if (this.mouseDown) {
      this.props.onChangeCell(row, col, this.mouseState);
    }
  }

  handleMouseDown(event: React.MouseEvent, row: number, col: number) {
    if (event.button !== 0) {
      return;
    }

    this.mouseDown = true;
    const ct = this.props.maze.getCellType(row, col);

    switch (ct) {
      case CellType.Blocked:
      case CellType.Slow:
        this.mouseState = CellType.Clear;
        break;
      case CellType.Clear:
        this.mouseState = CellType.Blocked;
        break;
    }

    if (event.shiftKey) {
      this.mouseState = CellType.Slow;
    }

    this.props.onChangeCell(row, col, this.mouseState);
  }

  handleMouseUp(_row: number, _col: number) {
    this.mouseDown = false;
  }

  render() {
    const { width, height, maze, algoState } = this.props;

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
            onMouseDown={(e) => this.handleMouseDown(e, r, c)}
            onMouseUp={() => this.handleMouseUp(r, c)}
            onMouseEnter={() => this.handleMouseEnter(r, c)}
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
}
