<script setup>
import moment from 'moment';

</script>
<template>
<div class="hero-foot">
  <div class="text-bordered cmf-footer">
    <div class="footer-element" style="font-size: 35px;">{{ moment(Date.now()).format('DD.MM.yyyy HH:mm') }} </div>
      <div class="footer-element pwtext">mnft ticker by baddays powered by </div>
      <div class="footer-element"><img class="powered-by-icon" :src="'https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png'"></div>
      <div class="footer-element"><img class="powered-by-icon" src="https://vuejs.org/images/logo.png"></div>
      <div class="footer-element"><img class="powered-by-icon" src="https://iconape.com/wp-content/png_logo_vector/node-js-2.png"></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'TickerFooter',
  props: {
    apiImage: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>

.cmf-footer {
  margin-bottom:-25px;
  font-size:50px;
  align-items: center;
  display: flex;
  justify-content: center;
}
img{
  margin-top:-15px;
}
.footer-element {
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pwtext {
  padding-top: 12px;
}
.powered-by-icon {
  width: 75px;
  height:75px;
}
</style>
