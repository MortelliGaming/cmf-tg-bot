<script setup>
import TextTicker from '../components/TextTicker.vue';
</script>

<template>
  <text-ticker />
</template>

<script>
export default {
  name: 'CoingeckoPriceTicker',
  components: {
    TextTicker
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
