import { createWebHistory, createRouter } from "vue-router";
import CoingeckoPriceTicker from "../views/CoingeckoPriceTicker.vue";
import CoingeckoVolumeTicker from "../views/CoingeckoVolumeTicker.vue";
import CoingeckoMarketCapTicker from "../views/CoingeckoMarketCapTicker.vue";
import BasicTextTicker from "../views/BasicTextTicker.vue";
import TopTenTicker from "../views/TopTenTicker.vue";

const routes = [
  {
    path: "/coingeckopriceticker",
    name: "coingeckopriceticker",
    component: CoingeckoPriceTicker,
  },
  {
    path: "/coingeckovolumeticker",
    name: "coingeckovolumeticker",
    component: CoingeckoVolumeTicker,
  },
  {
    path: "/coingeckomarketcapticker",
    name: "coingeckomarketcapticker",
    component: CoingeckoMarketCapTicker,
  },
  {
    path: "/basictextticker",
    name: "basictextticker",
    component: BasicTextTicker,
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