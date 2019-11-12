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

export class MazeComponent extends React.Component<MazeProps, {}> {
  private mouseDown: boolean;
  private mouseState: CellType;

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
    let ct = this.props.maze.getCellType(row, col);

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

  handleMouseUp(row: number, col: number) {
    this.mouseDown = false;
  }

  render() {
    let { width, height, maze, algoState } = this.props;

    let rows = [];
    for (let r = 0; r < height; r++) {
      let cells = [];

      for (let c = 0; c < width; c++) {
        let ct = maze.getCellType(r, c);

        let nodeState = algoState.getState(r, c);
        let classes = classnames(
          ct === CellType.Blocked ? 'blocked' : '',
          ct === CellType.Slow ? 'slow' : '',
          nodeState === NodeState.Current ? 'current' : '',
          nodeState === NodeState.Open ? 'open' : '',
          nodeState === NodeState.Closed ? 'closed' : '',
          nodeState === NodeState.Goal ? 'goal' : '',
          nodeState === NodeState.OnFinalPath ? 'finalPath' : ''
        );

        let fScore = Math.round(algoState.getFValue(r, c) * 10) / 10;
        let fScoreText = isNaN(fScore) ? '' : fScore.toString();
        let gScore = Math.round(algoState.getGValue(r, c) * 10) / 10;
        let gScoreText = isNaN(gScore) ? '' : gScore.toString();

        cells.push(
          <td
            key={c}
            onMouseDown={e => this.handleMouseDown(e, r, c)}
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
