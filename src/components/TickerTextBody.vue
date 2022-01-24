<script setup>
defineProps({
  caption: String,
  value: String
});
</script>

<template>
  <div class="hero-body is-flex is-justify-content-center" :style="'background-image:url('+backgroundChartUrl+')'">
    <div :class="{'is-flex-direction-column has-text-centered text-bordered':true, 'body-content': caption}">
      <div v-if="caption" class="token-market-cap"> {{ caption }}</div>
      <div class="token-price">{{ value }} </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TickerTextBody',
};
</script>

<style lang="scss" scoped>
.body-content {
  //margin-top: -70px;
}
.token-price {
  font-size: 35px;
  font-weight: bold;
}
.token-market-cap {
  font-size: 65px;
  font-weight: bold;
}
.hero-body {
  background-position: center;
  background-repeat: no-repeat;
  background-size:contain;
}
</style>
