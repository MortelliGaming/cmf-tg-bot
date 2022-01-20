<script setup>
import numeral from 'numeral';

defineProps({
  tokenInfos: Array,
});
</script>

<template>
  <div class="hero-body is-flex is-justify-content-center" v-show="loaded" id="ticker-content">
    <div style="width:100%;" :class="{'columns container text-bordered is-flex is-multiline':true}">
      <div class="column is-6">
        <div v-for="tokenInfo in firstColumnTokens" :key="tokenInfo.id" class="column is-12">
          <div class="is-flex is-flex-direction-row is-align-items-center">
            <img :src="tokenInfo.image"  style="width:50px;height:50px;border-radius: 25px;">
            <div class="ml-3">#{{ tokenInfo.rank}}</div>
            <div class="ml-3">{{ tokenInfo.name }}</div>
            <div class="ml-3"> ({{ tokenInfo.symbol.toUpperCase()}})</div>
          </div>
        </div>
      </div>
      <div class="column is-6">
        <div v-for="tokenInfo in secondColumnTokens" :key="tokenInfo.id" class="column is-12">
          <div class="is-flex is-flex-direction-row is-align-items-center">
            <img @load="() => handleImageLoad(tokenInfo.rank)" :src="tokenInfo.image" style="width:50px;height:50px;border-radius: 25px;">
            <div class="ml-3">#{{ tokenInfo.rank}}</div>
            <div class="ml-3">{{ tokenInfo.name}}</div>
            <div class="ml-1">({{ tokenInfo.symbol.toUpperCase()}})</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TickerTopTenBody',
  data() {
    return {
      loaded: false,
    };
  },
  computed: {
    firstColumnTokens() {
      return this.tokenInfos.slice(0, 5);
    },
    secondColumnTokens() {
      return this.tokenInfos.slice(5, 10);
    },
  },
  methods: {
    handleImageLoad(rank) {
      console.log(rank);
      if (rank.toString() === '9') {
        this.loaded = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.body-content {
  margin-top: -70px;
}
.token-price {
  font-size: 100px;
  font-weight: bold;
}
.token-market-cap {
  font-size: 45px;
  font-weight: bold;
}
.hero-body {
  font-weight: bold;
  font-size: 36px;
  padding: 0px;
  background-position: center;
  background-repeat: no-repeat;
  background-size:contain;
}
</style>
