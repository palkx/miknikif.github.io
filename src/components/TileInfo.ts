export default class TileInfo {
  constructor(
    public number: number,
    public row: number,
    public column: number,
    public moved: boolean = false,
    public movedFrom: Record<string, number> = {},
    public merged: boolean = false,
    public mergedFrom: Record<string, number> = {}
  ) { }

  public info(): string {
    return "number " + this.number + " row " + this.row + " column " + this.column
    // + " merged " + this.merged + " moved " + this.moved
  }
}