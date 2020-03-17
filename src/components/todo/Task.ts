export default class Task {
  public completed = false;

  constructor(
    public id: number,
    public description: string,
    public type: string = "",
    public parentTaskId: number = -1
  ) {}
}
