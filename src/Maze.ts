export enum CellType {
  Clear,
  Blocked,
  Slow,
}

export class Maze {
  private store: Record<string, CellType> = {};

  public getCellType(row: number, col: number): CellType {
    let ct = this.store[`${row}:${col}`];
    if (ct === undefined) {
      ct = CellType.Clear;
    }
    return ct;
  }

  public setCellType(row: number, col: number, type: CellType) {
    this.store[`${row}:${col}`] = type;
  }

  public save() {
    localStorage.setItem('maze', JSON.stringify(this.store));
  }

  public load() {
    this.store = JSON.parse(localStorage.getItem('maze') ?? '{}');
  }
}
