import { createRouter, createWebHistory } from "vue-router";
import CustomValueTicker from "../views/CustomValueTicker.vue";

const routes = [
  {
    path: "/customvalueticker",
    name: "customvalueticker",
    component: CustomValueTicker,
  },
  {
    path:'/',
    
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;