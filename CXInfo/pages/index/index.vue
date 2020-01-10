<template>
	<view class="index">
    <!-- 导航Tab -->
		<c-nav bgColor="nav-bar" :isBack="false">
		  <text slot="content">{{curPage}}</text>
		</c-nav>
    
    <!-- 视图components -->
    <view class="cu-bar tabbar bg-white shadow foot">
      <!-- 欢迎页 -->
      <view class="action" @click="NavChange" data-page="首页">
        <view class="cuIcon-similar"></view>
        <text :class="curPage=='首页'?'text-blue':'text-gray'">
          还没想好
        </text>
      </view>
      <!-- 发布 -->
      <view class="action add-action" @click="NavChange" data-page="申请">
        <button class="cu-btn cuIcon-add bg-green shadow"></button>
        <text :class="curPage=='申请'?'text-blue':'text-gray'">
          申请
        </text>
      </view>
      <!-- 个人 -->
      <view class="action" @click="NavChange" data-page="用户">
        <view class="cuIcon-my"></view>
        <text :class="curPage=='用户'?'text-blue':'text-gray'">
          个人
        </text>
      </view>
    </view>
	</view>
</template>

<script>
import Home from '../home/home.vue'
  
export default {
  data: () => ({
    curPage: '首页'
  }),
  methods: {
    NavChange: function(e) {
      this.curPage = e.currentTarget.dataset.page
    }
  }
}
</script>

<style scoped>
.nav-bar {
  border: #007AFF 1px solid;
}
</style>
