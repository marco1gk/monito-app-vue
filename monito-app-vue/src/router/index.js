import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/Layout.vue";
import Home from "../views/Home.vue";
import ppp from "../views/ppp.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "pp", name: "ppp", component: ppp },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
