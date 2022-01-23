<script setup>
</script>

<template>
  <div class="hero-body is-flex is-justify-content-center">
    <div :class="{'is-flex-direction-column has-text-centered text-bordered':true, 'body-content': false}">
      <div class="token-price"> token not found </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TickerBody',
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
  background-position: center;
  background-repeat: no-repeat;
  background-size:contain;
}
</style>
