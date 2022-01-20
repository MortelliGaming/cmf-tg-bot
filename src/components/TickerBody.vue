<script setup>
import numeral from 'numeral';

defineProps({
  value: Number,
  additionalValue1: Number,
  additionalValue2: Number,
  additionalValue3: Number,
  caption: String,
  additionalValue1Caption: String,
  additionalValue2Caption: String,
  additionalValue3Caption: String,
  currencySymbol: {
    type: String,
    default: '',
  },
  backgroundChartUrl: String,
  showAdditionalValue1: {
    type: Boolean,
    default: false,
  },
  showAdditionalValue2: {
    type: Boolean,
    default: false,
  },
  showAdditionalValue3: {
    type: Boolean,
    default: false,
  },
  abbreviateValue: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="hero-body is-flex is-justify-content-center" :style="'background-image:url('+backgroundChartUrl+')'">
    <div :class="{'is-flex-direction-column has-text-centered text-bordered':true, 'body-content': caption}">
      <div v-if="caption" class="token-market-cap"> {{ caption }}</div>
      <div class="token-price">{{ currencySymbol !== '' ? currencySymbol : currency }} {{ numeral(Number.parseFloat(value).toPrecision()).format(Number.parseFloat(value).toPrecision() > 1 ? (abbreviateValue ? " 0,0.00 a" : " 0,0.00"): " 0.000000000").toUpperCase()}}</div>
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
