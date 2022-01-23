<script setup>
import getSymbolFromCurrency from 'currency-symbol-map';
import { generateChart } from '../helpers/chartOptions.js';
import { coins } from '../helpers/coingeckoAPI.js';

import TickerFooter from '../components/TickerFooter.vue';
import TickerHeader from '../components/TickerHeader.vue';
import TickerBody from '../components/TickerBody.vue';
import TickerNotFoundBody from '../components/TickerNotFoundBody.vue';

defineProps({
  tickerType: {
    type: String,
    default: 'price', //volume, marketcap
  },
})
</script>

<template>
    <section class="hero is-fullheight p-5">
      <ticker-header
        v-if="tokenInfo !== null"
        :tokenImage="tokenInfo.image.large"
        :tokenName="tokenInfo.name"
        :tokenSymbol="tokenInfo.symbol.toUpperCase()"
        :tokenRank="tokenInfo.marketcap_rank"
        :changePercentage="changePercentage"
        :days="(days === 1 ? '24h' : days + ' days')" />
      <ticker-body
        v-if="tokenInfo !== null && lineChartUrl !== null"
        :abbreviateValue="currentValue >= 1000000"
        :currencySymbol="getSymbolFromCurrency(vsCurrency)"
        :caption="caption + ' in ' + vsCurrency.toUpperCase()"
        :value="Number.parseFloat(currentValue)"
        :backgroundChartUrl="lineChartUrl"/>
      <ticker-not-found-body v-else />
      <ticker-footer />
    </section>
</template>

<script>
export default {
  name: 'CoingeckoTicker',
  components: {
    TickerFooter,
    TickerHeader,
    TickerBody,
    TickerNotFoundBody
  },
  data() {
    return {
      tokenInfo: null,
      lineChartUrl: null
    };
  },
  computed: {
    tokenId() {
      return (this.$route.query.tokenId ? this.$route.query.tokenId : 'bitcoin')
    },
    vsCurrency() {
      return (this.$route.query.vsCurrency ? this.$route.query.vsCurrency : 'usd').toLowerCase()
    },
    days() {
      return (this.$route.query.days && isNaN(this.$route.query.days) === false ? Number.parseInt(this.$route.query.days) : 1)
    },
    historyProperty() {
      switch(this.tickerType) {
        case 'price':
          return 'prices'
        case 'volume':
          return 'total_volumes'
        case 'marketcap':
          return 'market_caps'
        default:
          return 'price'
      }
    },
    caption() {
      switch(this.tickerType) {
        case 'price':
          return 'Price'
        case 'volume':
          return 'Volume'
        case 'marketcap':
          return 'Market Cap'
        default:
          return 'Price'
      }
    },
    currentValue() {
      switch(this.tickerType) {
        case 'price':
          return this.tokenInfo.market_data.current_price[this.vsCurrency]
        case 'volume':
          return this.tokenInfo.market_data.total_volume[this.vsCurrency]
        case 'marketcap':
          return this.tokenInfo.market_data.market_cap[this.vsCurrency]
        default:
          return 'Price'
      }
    },
    historyData() {
        return ((this.tokenInfo && this.tokenInfo.history && this.tokenInfo.history[this.historyProperty]) && this.tokenInfo.history[this.historyProperty].map(entry => {return {x: entry[0], y: entry[1]}}))
    },
    changePercentage() {
      const currentPercent = (100 / this.historyData[0].y * this.historyData[this.historyData.length -1].y)
      return currentPercent - 100
    },
  },
  methods: {
  },
  mounted() {
    coins(this.tokenId, this.days, this.currency,true).then(data => {
      this.tokenInfo = data
      const lineChart = generateChart(548, 1400, this.historyData);
      this.lineChartUrl = lineChart;
    })
  },
};
</script>

<style lang="scss" scoped>
section {
  padding: 50px !important;
}
.hero {
  background-image: url('../assets/cmf_transp.png');
  background-repeat: no-repeat;
  object-fit: contain;
  background-color: black;
  background-size: contain;
  background-position: center;
}
</style>
