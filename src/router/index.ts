import ArticleComponentVue from "@/components/ArticleComponent.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: ArticleComponentVue,
      props : {
        collection : 'root',
        articleId : 'home'
      }
    },
    {
      path: "/:collection/",
      name: 'collectionHome',
      component: ArticleComponentVue,
      props : {
        articleId : 'home'
      }
    },
    {
      path: "/:collection/:articleId",
      name: 'article',
      component: ArticleComponentVue
    }
  ],
});

export default router;
