import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import McpOverviewPage from "../pages/McpOverviewPage.vue";
import DiagnosticsPage from "../pages/DiagnosticsPage.vue";
import QueryPage from "../pages/QueryPage.vue";
import TaurusNativePage from "../pages/TaurusNativePage.vue";
import TaurusNativeScenarioPage from "../pages/TaurusNativeScenarioPage.vue";
import CliPage from "../pages/CliPage.vue";
import AgentsPage from "../pages/AgentsPage.vue";
import AgentSetupPage from "../pages/AgentSetupPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/mcp", component: McpOverviewPage },
  { path: "/mcp/diagnostics", component: DiagnosticsPage },
  { path: "/mcp/query", component: QueryPage },
  { path: "/mcp/taurusdb", component: TaurusNativePage },
  { path: "/mcp/taurusdb/:slug", component: TaurusNativeScenarioPage },
  { path: "/cli", component: CliPage },
  { path: "/agents", component: AgentsPage },
  { path: "/agents/:slug", component: AgentSetupPage },
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
