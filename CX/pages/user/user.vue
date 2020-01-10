<template>
  <view class="user-component">
    <!-- 头像 -->
    <view class="avatar-wrapper padding bg-white section">
      <view class="cu-avatar round xl bg-grey"
      :style="'background-image:url('+user.avatarUrl+')'">
        <text class="cuIcon-people"></text>
      </view>
      <view class="user-name">你好，{{user.nickName}}</view>
    </view>
    
    <navigator class="record bg-white section"
    :url="'../applyforRecord/applyforRecord?openid='+user.openid">
      查看申请记录
    </navigator>
    
    <navigator class="record bg-white section"
    url="../applyforRecord/applyforRecord">
      查看所有申请记录
    </navigator>
    
    <!-- 登出 -->
    <button class="clear cu-btn lg" @tap="clearCache">清除缓存数据</button>
  </view>
</template>

<script>
import {showToast} from '../../common/FnUtil.js'

export default {
  data: () => ({
    user: {}
  }),
  methods: {
    clearCache() {
      uni.showModal({
        title: '清除缓存数据',
        content: '确定要清除？清除后请退出重新进入小程序',
        confirmColor: '#DD514C',
        cancelColor: '#1CBBB4',
        success: (res) => {
          if(res.confirm === true){
            this.$store.dispatch("setUser", null)
            this.user = {}
            uni.clearStorageSync()
            showToast('清除成功')
          }
        },
        fail: (err) => {
          showToast('调用失败:'+err.message)
          console.warn(err)
        }
      })
    }
  },
  beforeMount() {
    // Object.assing({}, newObj)
    this.user = this.$store.getters.getUserInfo
  }
}
</script>

<style scoped>
.user-component {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
}
.user-component .avatar-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.avatar-wrapper .user-name {
  font-size: 1.2rem;
}

.record {
  display: block;
  font-size: 1rem;
}

.clear {
  background-color: #DD514C;
  font-size: 0.8rem;
  color: #FFFFFF;
  width: 90%;
  align-self: center;
}

.user-component > .section {
  margin-bottom: 1.4rem;
  padding: 1rem;
}
</style>
