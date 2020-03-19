<template>
  <div class="loading">
    <div align="start" v-if="!loading">
      <h1>{{ title }}</h1>
      <h4 class="primary--text">{{ date }}</h4>
      <v-divider v-if="content"></v-divider>
      <div v-html="content" class="mt-4 pa-2"></div>
    </div>
    <loading v-else class="full">loading</loading>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PostInfo from "@/components/posts/PostInfo.ts";
import Loading from "@/components/Loading.vue";

@Component({
  components: { Loading }
})
export default class Post extends Vue {
  @Prop({ default: false }) loading!: boolean;
  private title: string | null = "";
  private date: string | null = "";
  private content: string | HTMLElement = "";

  errorTitle(): string {
    return "Cannot load post.";
  }

  errorContent(message: string): string {
    return `<h2>${message}.</h2>`;
  }

  setPost(post: PostInfo) {
    this.content = post.content;
    this.title = post.title;
    this.date = post.date;
  }
}
</script>
