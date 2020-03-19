<template>
  <v-row v-if="!loadingList">
    <div col-3>
      <v-btn @click="getAllPosts">Reload</v-btn>
      <v-list>
        <v-list-item
          v-for="post in map.keys()"
          :key="post"
          @click="showPost(post)"
        >
          <v-list-item-title>{{ showName(post) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
    <post ref="post" col-9></post>
  </v-row>
  <div v-else>Loading</div>
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
  private SPLITER = "==========";
  private converter = new showdown.Converter({ metadata: true });
  private map: Map<string, PostInfo> = new Map();
  private loadingList = true;

  mounted() {
    this.getAllPosts();
  }

  getAllPosts() {
    axios
      .get("content/allposts")
      .then(response => {
        for (const name of response.data.split("\n")) {
          if (name != "") {
            this.map.set(name, new PostInfo());
          }
        }
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => (this.loadingList = false));
  }

  showPost(name: string) {
    const post = this.map.get(name);
    if (!post || post.error == null) {
      this.getPost(name);
    } else {
      this.display(name);
    }
  }

  getPost(name: string) {
    axios
      .get(`content/${name}`)
      .then(response => {
        this.convert(this.map.get(name), response.data);
        this.display(name);
      })
      .catch(error => {
        const post = new PostInfo();
        post.error = error.message;
        this.map[name] = post;
      })
      .finally(() => (this.loadingList = false));
  }

  showName(name: string) {
    return name.replace("-", " ");
  }

  // TODO split metadata
  convert(post: PostInfo | undefined, data: string) {
    if (!post) {
      return;
    }
    const content = this.converter.makeHtml(data);
    post.content = content;
  }

  display(name: string) {
    const post = this.map.get(name);
    if (post) {
      const postModule = this.$refs.post;
      if (postModule instanceof Post) {
        postModule.setPost(post);
      }
    }
  }
}
</script>
