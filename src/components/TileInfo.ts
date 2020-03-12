export default class TileInfo {
  constructor(
    public number: number,
    public row: number,
    public column: number,
    public moved: boolean = false,
    public merged: boolean = false
  ) { }
}