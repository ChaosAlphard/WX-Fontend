<template>
  <view>
    <!-- <basics v-if="PageCur=='basics'"></basics>
    <components v-if="PageCur=='component'"></components>
    <plugin v-if="PageCur=='plugin'"></plugin>
    <view class="cu-bar tabbar bg-white shadow foot">
      <view class="action" @click="NavChange" data-cur="basics">
        <view class='cuIcon-cu-image'>
          <image :src="'/static/tabbar/basics' + [PageCur=='basics'?'_cur':''] + '.png'"></image>
        </view>
        <view :class="PageCur=='basics'?'text-green':'text-gray'">元素</view>
      </view>
      <view class="action" @click="NavChange" data-cur="component">
        <view class='cuIcon-cu-image'>
          <image :src="'/static/tabbar/component' + [PageCur == 'component'?'_cur':''] + '.png'"></image>
        </view>
        <view :class="PageCur=='component'?'text-green':'text-gray'">组件</view>
      </view>
      <view class="action" @click="NavChange" data-cur="plugin">
        <view class='cuIcon-cu-image'>
          <image :src="'/static/tabbar/plugin' + [PageCur == 'plugin'?'_cur':''] + '.png'"></image>
        </view>
        <view :class="PageCur=='plugin'?'text-green':'text-gray'">扩展</view>
      </view>
    </view> -->
    <cu-custom bgColor="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{curPage}}</block>
    </cu-custom>
    <view class="cu-bar tabbar bg-white shadow foot">
      <!-- 欢迎页 -->
      <view class="action" @click="NavChange" data-page="main">
        <view class="cuIcon-similar"></view>
        <text :class="curPage=='main'?'text-blue':'text-gray'">
          还没想好
        </text>
      </view>
      <!-- 发布 -->
      <view class="action add-action" @click="NavChange" data-page="add">
        <button class="cu-btn cuIcon-add bg-green shadow"></button>
        <text :class="curPage=='add'?'text-blue':'text-gray'">
          申请
        </text>
      </view>
      <!-- 个人 -->
      <view class="action" @click="NavChange" data-page="user">
        <view class="cuIcon-my"></view>
        <text :class="curPage=='user'?'text-blue':'text-gray'">
          个人
        </text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data: () => ({
      curPage: 'main'
    }),
    methods: {
      NavChange: function(e) {
        this.curPage = e.currentTarget.dataset.page
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    position: absolute;
    bottom: 0;
  }
</style>
