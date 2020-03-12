export default class TileInfo {
  constructor(
    public number: number,
    public row: number,
    public column: number,
    public moved: boolean = false,
    public merged: boolean = false
  ) { }

  public info(): string {
    return "number " + this.number + " row " + this.row + " column " + this.column 
    // + " merged " + this.merged + " moved " + this.moved
  }
}