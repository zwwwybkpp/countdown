<template>
  <div class="banner">
    <!-- <span>{{ oneText }}</span> -->
    <span>{{ msg }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="scss">
.banner {
  margin: 10px auto;
  width: 90%;
  height: 36px;
  line-height: 36px;
  border-left: 6px solid #55c2f5;
  background-color: #eff8ff;
  span {
    margin-left: 10px;
    color: #2c2c2c;
  }
}
</style>
