<script setup>
import numeral from 'numeral';

defineProps({
  tokenImage: String,
  tokenName: String,
  tokenSymbol: String,
  tokenRank: String,
  changePercentage: Number,
  days: String,
});
</script>

<template>
  <div class="hero-head">
      <div class="columns">
        <div class="column is-7">
          <div class="is-flex is-flex-direction-row">
            <img class="token-image" :src="tokenImage" alt="tokensymbol">
            <div class="is-flex-direction-column has-text-left token-info text-bordered">
              <div class="token-name">{{ tokenName }}</div>
              <div>{{tokenSymbol}} {{(tokenRank && tokenRank !== "null") ? '#'+tokenRank : ''}}</div>
            </div>
          </div>
        </div>
        <div class="column is-5">
          <div class="is-flex-direction-column has-text-right token-change text-bordered">
            <div class="token-name" :style="'color:'+(changePercentage >= 0 ? 'green' : 'red')+';'">{{ numeral(changePercentage).format("0,0.00") }}%</div>
            <div >{{ days }}</div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'TickerHeader',
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
  font-weight: bold;
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
