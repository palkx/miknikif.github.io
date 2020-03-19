<template>
  <div align="start">
    <h1>{{ title }}</h1>
    <h3>{{ date }}</h3>
    <div v-html="content"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Post from "@/components/posts/Post.vue";
import PostInfo from "@/components/posts/PostInfo.ts";
import showdown from "showdown";
import axios from "axios";

@Component({
  components: { Post }
})
export default class Posts extends Vue {
  private converter = new showdown.Converter({ metadata: true });
  private content: HTMLElement | string | null = null;
  private metadata: Record<string, string> | null = null;
  private list: Record<string, PostInfo | null> = {};
  private title: string | null = null;
  private date: string | null = null;
  private loadingList = true;

  mounted() {
    this.getAllPosts();
  }

  getAllPosts() {
    axios
      .get("posts/allposts")
      .then(response => {
        for (const name of response.data.split("\n")) {
          if (name != "") {
            this.list[name] = null;
          }
        }
        console.log(this.list);
      })
      .catch(error => {
        this.title = "Cannot load post.";
        this.content = `<h2>${error.message}.</h2>`;
      })
      .finally(() => (this.loadingList = false));
  }

  showName(name: string) {
    return name.replace("-", " ");
  }

  convert(data: string) {
    this.content = this.converter.makeHtml(data);
    this.metadata = this.converter.getMetadata();
    if (this.metadata) {
      if (this.metadata.title) {
        this.title = this.metadata.title;
      }
      if (this.metadata.date) {
        this.date = this.metadata.date;
      }
    }
  }
}
</script>
