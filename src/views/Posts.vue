<template>
  <v-container class="px-2 mb-5 py-0" style="min-width: 300px; height:100%">
    <v-row
      v-if="!loadingList"
      class="flex-nowrap"
      no-gutters
      style="height:100%"
    >
      <v-divider vertical></v-divider>
      <v-list class="col-2 ma-2">
        <v-list-item-group v-model="selected">
          <v-list-item
            color="primary"
            v-for="post in list"
            :key="post"
            @click="showPost(post)"
          >
            <v-list-item-title>{{ manager.showName(post) }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider vertical></v-divider>
      <post ref="post" class="col-10 ma-2 pa-2" :loading="loadingPost"></post>
    </v-row>
    <loading v-else class="full"></loading>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Post from "@/components/posts/Post.vue";
import PostInfo from "@/components/posts/PostInfo.ts";
import PostManager from "@/components/posts/PostManager.ts";
import Loading from "@/components/Loading.vue";
import showdown from "showdown";
import axios from "axios";

@Component({
  components: {
    Post,
    Loading
  }
})
export default class Posts extends Vue {
  private converter = new showdown.Converter({
    metadata: true,
    noHeaderId: true,
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    simpleLineBreaks: true
  });

  private manager = new PostManager();
  private list: string[] = [];
  private loadingList = true;
  private loadingPost = false;
  private selected = "";

  mounted() {
    this.getAllPosts();
  }

  getAllPosts() {
    axios
      .get("content/allposts")
      .then(response => {
        for (const name of response.data.split("\n")) {
          if (name != "") {
            this.list.push(name);
            this.manager.setPost(name, new PostInfo(name));
          }
        }
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => (this.loadingList = false));
  }

  showPost(name: string) {
    const post = this.manager.getPost(name);
    if (post && post.content) {
      this.display(name);
    } else {
      this.fetchPost(name);
    }
  }

  fetchPost(name: string) {
    this.loadingPost = true;
    axios
      .get(`content/${name}`)
      .then(response => {
        this.convert(this.manager.getPost(name), response.data);
        this.display(name);
      })
      .catch(error => {
        const post = new PostInfo("");
        post.error = error.message;
        this.manager.setPost(name, post);
      })
      .finally(() => (this.loadingPost = false));
  }

  convert(post: PostInfo | undefined, data: string) {
    if (!post) {
      return;
    }
    const splited = data.split(PostManager.SPLITER);
    let contentData: string;
    if (splited.length === 1) {
      contentData = splited[0];
    } else {
      contentData = splited[1];
      const metadata = JSON.parse(splited[0]);
      post.title = metadata.title;
      post.subtitle = metadata.subtitle;
      post.date = metadata.date;
    }
    const content = this.converter.makeHtml(contentData);
    post.content = content;
  }

  display(name: string) {
    const post = this.manager.getPost(name);
    if (post) {
      const postModule = this.$refs.post;
      if (postModule instanceof Post) {
        postModule.setPost(post);
      }
    }
  }
}
</script>
