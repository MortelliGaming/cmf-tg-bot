<script setup>
  import TickerFooter from '../components/TickerFooter.vue';
  import TickerTitleHeader from '../components/TickerTitleHeader.vue';
  import TickerTopTenBody from '../components/TickerTopTenBody.vue';

</script>

<template>
    <section class="hero is-fullheight p-5" v-if="tokenInfos">
      <ticker-title-header 
        :title="'Top 10'"/>
      <ticker-top-ten-body
        :tokenInfos="tokenInfos"/>
      <ticker-footer />
    </section>
</template>

<script>
export default {
  components: {
    TickerFooter,
    TickerTitleHeader,
    TickerTopTenBody
  },
  data() {
    return {
      tokenInfos: null,
    }
  },
  computed: {
  },
  methods: {
    
  },
  mounted() {
    this.tokenInfos = JSON.parse(this.$route.query.tokenInfos);
  }
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
