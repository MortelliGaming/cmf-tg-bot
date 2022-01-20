import { createWebHistory, createRouter } from "vue-router";
import CustomValueTicker from "../views/CustomValueTicker.vue";
import TopTenTicker from "../views/TopTenTicker.vue";

const routes = [
  {
    path: "/customvalueticker",
    name: "customvalueticker",
    component: CustomValueTicker,
  },
  {
    path: "/toptenticker",
    name: "toptenticker",
    component: TopTenTicker,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;