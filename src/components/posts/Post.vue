<template>
  <div class="loading">
    <div align="start" v-if="!loading">
      <h1 v-if="title">{{ title }}</h1>
      <h3 v-if="subtitle">{{ subtitle }}</h3>
      <h4 v-if="date">{{ date }}</h4>
      <v-divider v-if="content"></v-divider>
      <div v-html="content" class="content mt-4 pa-2"></div>
      <div v-if="refs && refs.size > 0">
        <v-divider></v-divider>
        <h4 class="primary--text">参考链接</h4>
        <ol>
          <li v-for="ref in refs.keys()" :key="ref">
            {{ refs.get(ref) }}
            <a :href="ref" target="_blank"> {{ ref }}</a>
          </li>
        </ol>
      </div>
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
  private title: string | undefined;
  private subtitle: string | undefined;
  private date: string | undefined;
  private content: string | HTMLElement = "";
  private refs: Map<string, string> | undefined;

  errorTitle(): string {
    return "Cannot load post.";
  }

  errorContent(message: string): string {
    return `<h2>${message}.</h2>`;
  }

  setPost(post: PostInfo) {
    this.content = post.content;
    this.title = post.title;
    this.subtitle = post.subtitle;
    this.date = post.date;
    this.refs = post.refs;
  }
}
</script>

<style lang="scss" scoped>
.content {
  >>> h1,
  >>> h2,
  >>> h3 {
    margin-top: 8px;
    margin-bottom: 8px;
    color: var(--v-primary-base);
  }
  >>> h4 {
    color: var(--v-primary-lighten1);
  }
  >>> h5 {
    color: var(--v-primary-lighten2);
  }
  >>> h6 {
    color: var(--v-primary-lighten3);
  }
  >>> strong {
    color: var(--v-accent-base);
  }

  >>> code::before,
  >>> code::after {
    content: "";
  }
}
h1 {
  color: var(--v-primary-base);
}
h3,
h4 {
  color: var(--v-primary-lighten1);
}
</style>
