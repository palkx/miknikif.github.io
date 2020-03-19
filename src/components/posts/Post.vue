<template>
  <div align="start">
    <h1>{{ post.title }}</h1>
    <h3>{{ post.date }}</h3>
    <div v-html="post.content"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PostInfo from "@/components/posts/PostInfo.ts";

@Component
export default class Post extends Vue {
  @Prop({ required: true }) post: PostInfo | null = null;
  @Prop({ default: false }) loading!: boolean;
}
</script>
