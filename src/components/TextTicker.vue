<script setup>

import TickerFooter from '../components/TickerFooter.vue';
import TickerTextBody from '../components/TickerTextBody.vue';

defineProps({
  tickerType: {
    type: String,
    default: 'price', //volume, marketcap
  },
})
</script>

<template>
    <section class="hero is-fullheight p-5">
      <ticker-text-body :caption="caption" :value="value" />
      <ticker-footer />
    </section>
</template>

<script>
export default {
  name: 'TextTicker',
  components: {
    TickerFooter,
    TickerTextBody,
  },
  data() {
    return {
    };
  },
  computed: {
    caption() {
      return (this.$route.query.caption ? this.$route.query.caption : 'Contract')
    },
    value() {
      return (this.$route.query.value ? this.$route.query.value : '0x').toLowerCase()
    },
  },
  methods: {
  },
  mounted() {
    
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
