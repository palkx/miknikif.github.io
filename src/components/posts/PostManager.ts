import Post from "@/components/posts/PostInfo.ts";

export default class PostManager {
  // fullname eg. test/test==========2020-03-18
  public static SPLITER = "==========";
  private map: Map<string, Post | Map<string, Post>> = new Map();

  getPost(fullName: string): Post | undefined {
    const slited = this.splitedNames(fullName);
    if (slited.length === 1) {
      const post = this.map.get(slited[0]);
      if (post instanceof Post) {
        return post;
      }
    } else {
      const submap = this.map.get(slited[0]);
      if (submap instanceof Map) {
        const post = submap.get(slited[1]);
        return post;
      }
    }
    return;
  }

  setPost(fullName: string, post: Post) {
    const slited = this.splitedNames(fullName);
    if (slited.length === 1) {
      this.map.set(slited[0], post);
    } else {
      let submap = this.map.get(slited[0]);
      // if folder name same with file name, ignore file
      if (!submap || submap instanceof Post) {
        submap = new Map();
        this.map.set(slited[0], submap);
      }
      submap.set(slited[1], post);
    }
  }

  splitedNames(fullName: string): string[] {
    return fullName.split(PostManager.SPLITER)[0].split("/");
  }

  showName(fullName: string): string {
    const splited = this.splitedNames(fullName);
    return splited[splited.length === 1 ? 0 : 1];
  }

  groupName(fullName: string): string {
    const splited = this.splitedNames(fullName);
    return splited.length === 1 ? "" : splited[0];
  }

  keys(): IterableIterator<string> {
    return this.map.keys();
  }

  value(
    key: string,
    subkey: string | undefined = undefined
  ): Post | Map<string, Post> | undefined {
    if (subkey) {
      const map = this.map.get(key);
      if (map instanceof Map) {
        return map.get(subkey);
      }
    } else {
      return this.map.get(key);
    }
    return;
  }
}
