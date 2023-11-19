import { AlgoState, NodeState } from './AlgoState';

export interface AStarNode {
  id: string;
}

export interface AStarInput<TNode extends AStarNode> {
  getHeuristicCostEstimate(n1: TNode, n2: TNode): number;
  getNeighbours(n: TNode): TNode[];
  getActualNeighbourDistance(n1: TNode, n2: TNode): number;
}

function revcmp(a: number, b: number): number {
  return a < b ? 1 : a === b ? 0 : -1;
}

export class AStar<TNode extends AStarNode> implements AlgoState {
  private openSet: TNode[] = [];
  private openSetIds: Record<string, boolean> = {};

  private closedSetIds: Record<string, boolean> = {};

  private cameFrom: Record<string, TNode> = {};

  private gScore: Record<string, number> = {};
  private fScore: Record<string, number> = {};

  private finalPathIds: Record<string, boolean> = {};
  private current?: TNode;

  constructor(
    private start: TNode,
    private goal: TNode,
    private config: AStarInput<TNode>
  ) {
    this.reset();
  }

  reset() {
    this.openSet = [this.start];
    this.openSetIds = {
      [this.start.id]: true,
    };
    this.closedSetIds = {};

    this.cameFrom = {};
    this.gScore = {
      [this.start.id]: 0,
    };
    this.fScore = {
      [this.start.id]: this.config.getHeuristicCostEstimate(
        this.start,
        this.goal
      ),
    };
    this.finalPathIds = {};

    this.current = undefined;
    this.step();
  }

  getFValue(id: string): number {
    return this.fScore[id];
  }

  getGValue(id: string): number {
    return this.gScore[id];
  }

  getState(id: string): NodeState {
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

    const {
      fScore,
      gScore,
      openSet,
      openSetIds,
      goal,
      cameFrom,
      closedSetIds,
    } = this;

    const current = openSet.pop()!;
    this.current = current;
    delete openSetIds[current.id];

    if (current.id === goal.id) {
      let n = goal;
      do {
        this.finalPathIds[n.id] = true;
        n = cameFrom[n.id];
      } while (n);
      return false;
    }

    closedSetIds[current.id] = true;

    const neighbours = this.config.getNeighbours(current);
    const newNeighbours = neighbours.filter((n) => !closedSetIds[n.id]);
    newNeighbours.forEach((n) => {
      const tentativeGScore =
        gScore[current.id] + this.config.getActualNeighbourDistance(current, n);
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
        gScore[n.id] + this.config.getHeuristicCostEstimate(n, goal);
    });

    this.openSet.sort((n1, n2) => revcmp(fScore[n1.id], fScore[n2.id]));
    return true;
  }
}
