<script setup>
import numeral from 'numeral';

defineProps({
  title: String,
  subtitle: String,
});
</script>

<template>
  <div class="hero-head">
      <div class="columns">
        <div class="column is-12">
          <div class="is-flex is-flex-direction-column is-justify-content-center">
            <div class="token-name text-bordered">{{ title }}</div>
            <div class="text-bordered">{{subtitle}}</div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'TickerTitleHeader',
};
</script>

<style lang="scss" scoped>
.token-image {
  border-radius:75px;
  height:150px;
  width:150px;
  background-size:cover;
}
.token-name {
  padding-top: 25px;
  font-weight: bold;
  font-size: 75px;;
}
.token-info {
  font-size:45px;
  padding-left: 15px;
  justify-content: center;
  display: flex;
}
.token-change {
  font-size:45px;
  justify-content: center;
  align-content: flex-end;
  display: flex;
}
</style>
