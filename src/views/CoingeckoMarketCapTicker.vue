<script setup>
import CoingeckoTicker from '../components/CoingeckoTicker.vue';
</script>

<template>
  <coingecko-ticker :tickerType="'marketcap'" />
</template>

<script>
export default {
  name: 'CoingeckoPriceTicker',
  components: {
    CoingeckoTicker
  },
};
</script>

<style lang="scss" scoped>
section {
  padding: 50px !important;
}
.hero {
  background-image: url('../assets/diamondhand/logo.png');
  background-repeat: no-repeat;
  object-fit: contain;
  background-color: black;
  background-size: contain;
  background-position: center;
}
</style>
