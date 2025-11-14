import type { AStarNode } from './Algorithm';

export class MyNode implements AStarNode {
  public id: string;

  public constructor(public row: number, public col: number) {
    this.id = createNodeId(row, col);
  }
}

export function createNodeId(row: number, col: number) {
  return `${row}:${col}`;
}
