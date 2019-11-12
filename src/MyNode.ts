export class MyNode {
  public id: string;

  constructor(public row: number, public col: number) {
    this.id = `${row}:${col}`;
  }
}
