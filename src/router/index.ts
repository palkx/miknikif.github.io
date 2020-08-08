import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "2048",
    component: () =>
      import(/* webpackChunkName: "2048" */ "../views/Game2048.vue")
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/todo",
    name: "todo",
    component: () => import(/* webpackChunkName: "todo" */ "../views/Todo.vue")
  },
  {
    path: "/posts",
    name: "posts",
    component: () =>
      import(/* webpackChunkName: "posts" */ "../views/Posts.vue")
  },
  {
    path: "/snake",
    name: "snake",
    component: () =>
      import(/* webpackChunkName: "snake" */ "../views/Snake.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
