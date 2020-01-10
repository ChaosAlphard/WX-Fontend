<template>
  <view class="content">
    <apply-for v-if="curPage==='apply-for'" class="comp" :key="'apply-for'"/>
    <user v-else-if="curPage==='user'" class="comp" :key="'user'"/>
    <c-main v-else class="comp" :key="'user'"/>

    <!-- Bottom Bar -->
    <view class="cu-bar tabbar bg-white foot">
      <!-- 主页 -->
      <view class="action" data-name="main" @click="changePage"
      :class="{'text-blue': isCurPage('main')}">
        <view class="cuIcon-home"></view>
        <view>主页</view>
      </view>
      <!-- 申请 -->
      <view class="action" data-name="apply-for" @click="changePage"
      :class="{'text-blue': isCurPage('apply-for')}">
        <view class="cuIcon-roundadd"></view>
        <view>申请</view>
      </view>
      <!-- 用户 -->
      <view class="action" data-name="user" @click="changePage"
      :class="{'text-blue': isCurPage('user')}">
        <view class="cuIcon-people"></view>
        <view>用户</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data: () => ({
      curPage: 'main'
    }),
    onLoad() {
      console.log('index load')
    },
    methods: {
      changePage(ev) {
        this.curPage = ev.currentTarget.dataset.name
      },
      isCurPage(page) {
        return this.curPage === page
      }
    }
  }
</script>

<style scoped>
.content {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
}

.content .comp {
  position: relative;
}
</style>
