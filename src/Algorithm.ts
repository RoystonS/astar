import { Dictionary } from './Dictionary';
import { MyNode } from './MyNode';
import { Maze } from './Maze';
import { AlgoState, NodeState } from './AlgoState';

export interface AStarInput {
  heuristic_cost_estimate(n1: MyNode, n2: MyNode): number;
  getNeighbours(n: MyNode): MyNode[];
  distanceBetween(n1: MyNode, n2: MyNode): number;
}

function cmp(a: number, b: number): number {
  return a < b ? -1 : a === b ? 0 : 1;
}

function revcmp(a: number, b: number): number {
  return a < b ? 1 : a === b ? 0 : -1;
}

export class AStar implements AlgoState {
  private openSet: MyNode[];
  private openSetIds: Dictionary<boolean>;

  private closedSetIds: Dictionary<boolean>;

  private cameFrom: Dictionary<MyNode>;

  private gScore: Dictionary<number>;
  private fScore: Dictionary<number>;

  private finalPathIds: Dictionary<boolean>;
  private current?: MyNode;

  constructor(
    private start: MyNode,
    private goal: MyNode,
    private config: AStarInput
  ) {
    this.reset();
  }

  reset() {
    this.openSet = [this.start];
    this.openSetIds = {
      [this.start.id]: true
    };
    this.closedSetIds = {};

    this.cameFrom = {};
    this.gScore = {
      [this.start.id]: 0
    };
    this.fScore = {
      [this.start.id]: this.config.heuristic_cost_estimate(
        this.start,
        this.goal
      )
    };
    this.finalPathIds = {};

    this.current = undefined;
    this.step();
  }

  getFValue(row: number, col: number): number {
    // HACK!
    let id = `${row}:${col}`;

    return this.fScore[id];
  }

  getGValue(row: number, col: number): number {
    // HACK!
    let id = `${row}:${col}`;

    return this.gScore[id];
  }

  getState(row: number, col: number): NodeState {
    // HACK!
    let id = `${row}:${col}`;

    if (id === this.goal.id) {
      return NodeState.Goal;
    }

    if (this.current && id === this.current.id) {
      return NodeState.Current;
    }

    if (this.finalPathIds[id]) {
      return NodeState.OnFinalPath;
    }

    if (this.openSetIds[id]) {
      return NodeState.Open;
    }

    if (this.closedSetIds[id]) {
      return NodeState.Closed;
    }

    return NodeState.None;
  }

  public step(): boolean {
    if (
      !this.openSet.length ||
      (this.current && this.current.id === this.goal.id)
    ) {
      return false;
    }

    let {
      fScore,
      gScore,
      openSet,
      openSetIds,
      goal,
      cameFrom,
      closedSetIds
    } = this;

    let current = openSet.pop() as MyNode;
    this.current = current;
    delete openSetIds[current.id];

    if (current.id === goal.id) {
      let n = goal;
      do {
        console.log(` ${n.id}: (${n.row}, ${n.col})`);
        this.finalPathIds[n.id] = true;
        n = cameFrom[n.id];
      } while (n);
      return false;
    }

    closedSetIds[current.id] = true;

    let neighbours = this.config.getNeighbours(current);
    let newNeighbours = neighbours.filter(n => !closedSetIds[n.id]);
    newNeighbours.forEach(n => {
      let tentativeGScore =
        gScore[current.id] + this.config.distanceBetween(current, n);
      if (openSetIds[n.id]) {
        if (tentativeGScore >= gScore[n.id]) {
          // Worse path
          return;
        }
      } else {
        openSet.push(n);
        openSetIds[n.id] = true;
      }

      cameFrom[n.id] = current;
      gScore[n.id] = tentativeGScore;
      fScore[n.id] =
        gScore[n.id] + this.config.heuristic_cost_estimate(n, goal);
    });

    this.openSet.sort((n1, n2) => revcmp(fScore[n1.id], fScore[n2.id]));
    return true;
  }
}
