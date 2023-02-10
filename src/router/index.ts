import ArticleComponentVue from "@/components/ArticleComponent.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/c/:collection/",
      name: 'collectionHome',
      component: ArticleComponentVue
    },
    {
      path: "/c/:collection/:articleId",
      name: 'article',
      component: ArticleComponentVue
    }
  ],
});

export default router;
