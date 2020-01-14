<template>
  <view class="main-wrapper">
    <text>主页（可放置使用说明等）</text>
    
    <view class="cu-list menu">
      <view class="cu-item">level配置(开发only)</view>
      <button class="cu-btn lg bg-grey" data-lv="0"
      @tap="changeLevel">
        0: 离职、注册但未激活
      </button>
      <button class="cu-btn lg bg-cyan" data-lv="1"
      @tap="changeLevel">
        1: 普通
      </button>
      <button class="cu-btn lg bg-orange" data-lv="2"
      @tap="changeLevel">
        2: 管理
      </button>
    </view>
  </view>
</template>

<script>
  export default {
    data: () => ({
      curPage: 'main'
    }),
    methods: {
      changeLevel(e){
        const lv = e.currentTarget.dataset.lv
        console.log(lv)
        this.$store.dispatch("setLevel", Number.parseInt(lv))
      }
    }
  }
</script>

<style scoped>
.cu-list {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
}
.cu-btn {
  margin-top: 1.2rem;
  font-size: 0.8rem;
  width: 90%;
  align-self: center;
}
</style>
