export enum NodeState {
  Current,
  Open,
  Closed,
  None,
  Goal,
  OnFinalPath,
}

export interface AlgoState {
  getState(nodeId: string): NodeState;
  getFValue(nodeId: string): number;
  getGValue(nodeId: string): number;
}
