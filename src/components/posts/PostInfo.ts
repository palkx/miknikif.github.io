import PostManager from "@/components/posts/PostManager.ts";
export default class PostInfo {
  public error: string | undefined;
  public title: string | undefined;
  public subtitle: string | undefined;
  public date: string | undefined;
  public dateInName: string | null = "";
  public content: HTMLElement | string = "";
  public refs: Map<string, string> | undefined;

  constructor(public fullName: string) {
    this.dateInName = fullName.split(PostManager.SPLITER)[0];
  }
}
