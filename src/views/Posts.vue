<template>
  <v-row
    v-if="!loadingList"
    class="flex-nowrap pe-2 py-0 justify-center"
    no-gutters
    style="height:100%"
  >
    <v-navigation-drawer
      absolute
      permanent
      expand-on-hover
      color="primary"
      width="300px"
    >
      <v-list>
        <v-subheader class="white--text">POSTS</v-subheader>
        <v-list-item-group v-model="itemValue" mandatory color="black">
          <v-divider></v-divider>
          <template v-for="name in manager.keys()">
            <div :key="name">
              <v-list-group v-if="isGroup(name)" color="black">
                <v-icon slot="appendIcon" color="white">mdi-menu-down</v-icon>
                <template v-slot:activator>
                  <v-list-item-content class="text-no-wrap white--text">{{
                    name
                  }}</v-list-item-content>
                </template>
                <v-list-item
                  class="px-4"
                  v-for="subname in manager.value(name).keys()"
                  @click="showPost(manager.value(name, subname))"
                  :key="subname + 'sub'"
                >
                  <v-list-item-content class="text-no-wrap white--text">{{
                    subname
                  }}</v-list-item-content>
                </v-list-item>
              </v-list-group>
              <v-list-item
                class="px-4"
                v-else
                @click="showPost(manager.value(name))"
                ><v-list-item-content class="text-no-wrap white--text">{{
                  name
                }}</v-list-item-content>
              </v-list-item>
              <v-divider class="mx-2"></v-divider>
            </div>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <post
      ref="post"
      class="col-9 ms-12 me-2 my-5 pa-2"
      :loading="loadingPost"
    ></post>
  </v-row>
  <loading v-else class="full"></loading>
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
  private loadingList = true;
  private loadingPost = false;
  private itemValue = "";
  private hasShowFirst = false;

  mounted() {
    this.getAllPosts();
  }

  getAllPosts() {
    axios
      .get("content/allposts")
      .then(response => {
        for (const name of response.data.split("\n")) {
          if (name != "") {
            this.manager.setPost(name, new PostInfo(name));
          }
          if (!this.hasShowFirst) {
            this.hasShowFirst = true;
            const post = this.manager.getPost(name);
            if (post) {
              this.showPost(post);
            }
          }
        }
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => (this.loadingList = false));
  }

  showPost(post: PostInfo) {
    if (post && post.content) {
      this.display(post);
    } else {
      this.fetchPost(post);
    }
  }

  fetchPost(post: PostInfo) {
    this.loadingPost = true;
    axios
      .get(`content/${post.fullName}`)
      .then(response => {
        this.convert(post, response.data);
        this.display(post);
      })
      .catch(error => {
        post.error = error.message;
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

  display(post: PostInfo) {
    if (post) {
      const postModule = this.$refs.post;
      if (postModule instanceof Post) {
        postModule.setPost(post);
      }
    }
  }

  isGroup(name: string): boolean {
    return this.manager.value(name) instanceof Map;
  }
}
</script>
