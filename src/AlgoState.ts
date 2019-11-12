export enum NodeState {
  Current,
  Open,
  Closed,
  None,
  Goal,
  OnFinalPath
}

export interface AlgoState {
  getState(row: number, col: number): NodeState;
  getFValue(row: number, col: number): number;
  getGValue(row: number, col: number): number;
}
