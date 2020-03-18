<template>
  <div align="start">
    <h1>{{ title }}</h1>
    <h3>{{ date }}</h3>
    <div v-html="content"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import showdown from "showdown";
import axios from "axios";

@Component
export default class Post extends Vue {
  private converter = new showdown.Converter({ metadata: true });
  private content: HTMLElement | string | null = null;
  private metadata: Record<string, string> | null = null;
  private data;
  private title: string | null = null;
  private date: string | null = null;

  mounted() {
    axios
      .get("posts/create-blog.md")
      .then(response => {
        this.data = response.data;
        this.convert();
      })
      .catch(error => {
        this.title = "Cannot load post.";
        this.content = `<h2>${error.message}.</h2>`;
      });
  }

  convert() {
    this.content = this.converter.makeHtml(this.data);
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
