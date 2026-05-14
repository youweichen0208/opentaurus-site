import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import McpOverviewPage from "../pages/McpOverviewPage.vue";
import DiagnosticsPage from "../pages/DiagnosticsPage.vue";
import QueryPage from "../pages/QueryPage.vue";
import TaurusNativePage from "../pages/TaurusNativePage.vue";
import CliPage from "../pages/CliPage.vue";
import AgentsPage from "../pages/AgentsPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/mcp", component: McpOverviewPage },
  { path: "/mcp/diagnostics", component: DiagnosticsPage },
  { path: "/mcp/query", component: QueryPage },
  { path: "/mcp/taurusdb", component: TaurusNativePage },
  { path: "/cli", component: CliPage },
  { path: "/agents", component: AgentsPage },
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
