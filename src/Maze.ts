import { Dictionary } from './Dictionary';

export enum CellType {
  Clear,
  Blocked,
  Slow
}

export class Maze {
  private store: Dictionary<CellType> = {};

  constructor() {}

  getCellType(row: number, col: number): CellType {
    let ct = this.store[`${row}:${col}`];
    if (ct === undefined) {
      ct = CellType.Clear;
    }
    return ct;
  }

  setCellType(row: number, col: number, type: CellType) {
    this.store[`${row}:${col}`] = type;
  }

  save() {
    localStorage.setItem('maze', JSON.stringify(this.store));
  }

  load() {
    this.store = JSON.parse(localStorage.getItem('maze')) as Dictionary<
      CellType
    >;
  }
}
