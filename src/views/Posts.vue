<template>
  <v-row v-if="!loadingList" class="flex-nowrap pa-2" no-gutters>
    <div class="col-3 ma-2">
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
    <post ref="post" class="col-9 ma-2" :loading="loadingPost"></post>
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
  private loadingPost = false;

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
    if (post && post.content) {
      this.display(name);
    } else {
      this.getPost(name);
    }
  }

  getPost(name: string) {
    this.loadingPost = true;
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
      .finally(() => (this.loadingPost = false));
  }

  showName(name: string) {
    return name.replace("-", " ");
  }

  convert(post: PostInfo | undefined, data: string) {
    if (!post) {
      return;
    }
    const splited = data.split(this.SPLITER);
    console.log(splited);
    let contentData: string;
    if (splited.length === 1) {
      contentData = splited[0];
    } else {
      contentData = splited[1];
      console.log(splited[0]);
      try {
        console.log(JSON.parse(splited[0]));
      } catch (e) {
        console.log(e);
      }

      const metadata = JSON.parse(splited[0]);
      console.log(metadata);
      if (metadata.title) {
        post.title = metadata.title;
      }
      if (metadata.date) {
        post.date = metadata.date;
      }
    }
    const content = this.converter.makeHtml(contentData);
    post.content = content;
    console.log(post);
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
