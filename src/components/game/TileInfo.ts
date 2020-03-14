export default class TileInfo {
  constructor(
    public index: number,
    public number: number,
    public row: number,
    public column: number
  ) {
    this.moveTo = {
      row: this.row,
      column: this.column
    }
  }


  public moved = false;
  public merged = false;
  public moveTo: Record<string, number> = {};
  public newNumber = 0;

  public info(): string {
    return "number " + this.number + " row " + this.row + " column " + this.column
  }
}