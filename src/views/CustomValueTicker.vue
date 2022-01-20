<script setup>
import getSymbolFromCurrency from 'currency-symbol-map';
import { chartOptions, generateChart } from '../helpers/chartOptions.js';

import TickerFooter from '../components/TickerFooter.vue';
import TickerHeader from '../components/TickerHeader.vue';
import TickerBody from '../components/TickerBody.vue';
import { onBeforeMount } from '@vue/runtime-core';
</script>

<template>
    <section class="hero is-fullheight p-5" v-if="lineChartUrl">
      <ticker-header
        :tokenImage="tokenImage"
        :tokenName="tokenName"
        :tokenSymbol="tokenSymbol && tokenSymbol"
        :tokenRank="tokenRank"
        :changePercentage="Number.parseFloat(tokenChangePercentage)"
        :days="timespan" />
      <ticker-body
        :abbreviateValue="abbreviateValue == 'true'"
        :currencySymbol="getSymbolFromCurrency(conversionCurrency)"
        :caption="caption"
        :value="Number.parseFloat(tokenValue)"
        :backgroundChartUrl="lineChartUrl"/>
      <ticker-footer />
    </section>
</template>

<script>
export default {
  components: {
    TickerFooter,
    TickerHeader,
    TickerBody,
  },
  data() {
    return {
      tokenImage: '',
      tokenSymbol: 'BTC',
      tokenName: 'Bitcoin',
      tokenRank: null,
      tokenValue: 0,
      tokenChangePercentage: 0,
      conversionCurrency: 'USD',
      timespan: '24h',
      abbreviateValue: 'false',
      graphdata: [],
      lineChartUrl: null,
      chartOptions,
      generateChart,
      getSymbolFromCurrency,
    };
  },
  computed: {
  },
  methods: {

  },
  mounted() {
    this.tokenSymbol = this.$route.query.tokenSymbol;
    this.tokenImage = this.$route.query.tokenImage;
    this.tokenName = this.$route.query.tokenName;
    this.tokenRank = this.$route.query.tokenRank;
    this.tokenValue = this.$route.query.tokenValue;
    this.conversionCurrency = this.$route.query.conversionCurrency;
    this.caption = this.$route.query.caption;
    this.timespan = this.$route.query.timespan;
    this.abbreviateValue = this.$route.query.abbreviateValue;
    this.graphdata = JSON.parse(this.$route.query.graphdata);
    this.tokenChangePercentage = this.$route.query.tokenChangePercentage;
    const lineChart = this.generateChart(548, 1400, this.graphdata);
    this.lineChartUrl = lineChart;
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
