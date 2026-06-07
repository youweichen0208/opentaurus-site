import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

const legacyRedirects = {
  "/mcp": "#hero",
  "/mcp/diagnostics": "#diagnostics",
  "/mcp/query": "#query",
  "/mcp/taurusdb": "#taurusdb",
  "/agents": "#agents",
};

const routes = [
  { path: "/", component: HomePage },
  {
    path: "/:pathMatch(.*)*",
    beforeEnter(to) {
      const anchor = legacyRedirects[to.path];
      if (anchor) {
        return { path: "/", hash: anchor, replace: true };
      }
      return { path: "/", replace: true };
    },
    component: HomePage,
  },
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: "smooth", top: 72 };
    return { top: 0 };
  },
});
