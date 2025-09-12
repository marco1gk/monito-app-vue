import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/Layout.vue";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: "", name: "Home", component: Home }
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
