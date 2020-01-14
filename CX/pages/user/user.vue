<template>
  <view class="user-component">
    <view class="avatar-wrapper padding bg-white section">
      <!-- 头像 -->
      <view class="cu-avatar round xl bg-grey"
      :style="'background-image:url('+user.avatarUrl+')'">
        <text class="cuIcon-people"></text>
      </view>

      <!-- isLogin statr -->
      <view v-if="isLogin" class="user-name">
        {{user.nickName}}
      </view>
      <!-- 微信接口调整后，在用户未授权时
      只能使用此方式获取用户信息与授权 -->
      <!-- open-type="getUserInfo" @getuserinfo="fun" -->
      <button v-else class="cu-btn lg bg-cyan"
      open-type="getUserInfo" @getuserinfo="clickToGetinfo">
        授权获取用户信息
      </button>
      <!-- isLogin end -->
    </view>
    
    <navigator v-if="isLogin&&level===1" class="record bg-white section"
    :url="'../applyforRecord/applyforRecord?openid='+user.openid">
      查看我的申请记录
    </navigator>
    
    <navigator v-if="isLogin&&level===2" class="record bg-white section"
    url="../applyforRecord/applyforRecord?openid=manage">
      查看所有申请记录
    </navigator>
    
    <!-- 登出 -->
    <button v-if="isLogin||needClearCache" class="clear cu-btn lg" @tap="clearCache">清除缓存数据</button>
  </view>
</template>

<script>
import {
  promisifyWithArr,
  withTimeoutWithArr,
  showToast,
  setStorage
} from '../../common/FnUtil.js'

export default {
  data: () => ({
    user: {},
    needClearCache: false
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin
    },
    level() {
      return this.$store.getters.level
    }
  },
  methods: {
    async clickToGetinfo(info) {
      const detail = info.detail
      if(!detail||!detail.userInfo||!detail.userInfo.nickName) {
        showToast('获取用户信息失败')
        return
      }
      const user = detail.userInfo
      // 登录流程↓↓
      // 与App.vue 中大同小异
      // 展示loading界面
      uni.showLoading({ title: '正在登录', mask: true })
      try {
        const code = await this.getCode()
        const sessionResult = await this.code2session(code)
        if (!sessionResult||!sessionResult.data) {
          throw new Error('获取session失败')
        }
        const sessionResponse = sessionResult.data
        if (sessionResponse.code !== 200) {
          throw new Error(sessionResponse.msg)
        }
        const session = sessionResponse.model
        
        // 更新服务器上的用户信息
        const [res, level] = await Promise.all([
          this.updateUser(session.openid, user),
          this.getLevel(session.openid)
        ])
        if(level.model < 1) {
          showToast('账户未激活')
          return
        }

        // 保存session到本地
        setStorage({
          'openid': session.openid,
          'sessionKey': session.session_key,
          'userInfo': user
        }, true)
        // 保存到Vuex
        this.$store.dispatch("setLevel", level.model)
        this.$store.dispatch("setUser", user)
        this.user = user
      } catch(e) {
        console.error(e)
        showToast(e.message)
      } finally {
        // 取消loading界面
        uni.hideLoading()
      }
    },
    async getCode() {
      const pmslogin = promisifyWithArr(uni.login)()
      const [result, error] = await withTimeoutWithArr(pmslogin)
      // Promise函数异常处理
      if (error != null) {
        console.error(error)
        throw new Error(error)
      }
      // 判断是否成功获取用户识别码
      if (result && !result.code) {
        console.warn(result)
        throw new Error('获取失败')
      }
    
      return result.code
    },
    async code2session(code) {
      const requestUserInfo = promisifyWithArr(uni.request)({
        url: 'http://192.168.1.54:5000/user/getsession',
        data: { code: code }
      })
      const [result, error] = await withTimeoutWithArr(requestUserInfo, 10000)
      if (error != null) {
        console.error(error)
        throw new Error(error==='超时'?'超时':'网络异常')
      }
    
      return result
    },
    // async getInfo() {
    //   const pmsGetSetting = promisifyWithArr(uni.getSetting)()
    //   const [result, error] = await withTimeoutWithArr(pmsGetSetting)
    //   if (error != null) {
    //     console.error(error)
    //     throw new Error(error)
    //   }
    //   if(!result||!result.authSetting['scope.userInfo']) {
    //     this.needClearCache = true
    //     throw new Error('用户授权认证失败，请清除缓存后重新')
    //   }
    
    //   const pmsGetUserInfo = promisifyWithArr(uni.getUserInfo)()
    //   const [user, err] = await withTimeoutWithArr(pmsGetUserInfo)
    //   if (err != null) {
    //     console.error(err)
    //     throw new Error(err)
    //   }
    //   if(!user||!user.userInfo||!user.userInfo.nickName) {
    //     throw new Error('获取用户信息失败')
    //   }
    //   return user.userInfo
    // },
    async updateUser(openid, userInfo) {
      const updateUser = promisifyWithArr(uni.request)({
        url: 'http://192.168.1.54:5000/user/updateinfo',
        method: 'POST',
        header: { 'content-type': 'application/json' },
        data: {
          openid: openid,
          name: userInfo.nickName,
          avatar: userInfo.avatarUrl
        }
      })
      const [result, error] = await withTimeoutWithArr(updateUser, 10000)
      if (error != null) {
        throw new Error(error==='超时'?'更新用户信息失败：超时':'更新用户信息失败：网络异常')
      }
      const data = result.data
      if (data.code !== 200) {
        throw new Error(`更新用户信息失败：${data.msg}`)
      }
      
      return data
    },
    async getLevel(openid) {
      const reqLevel = promisifyWithArr(uni.request)({
        url: 'http://192.168.1.54:5000/user/findlevel',
        method: 'GET',
        data: { openid: openid }
      })
      const [result, error] = await withTimeoutWithArr(reqLevel, 10000)
      if (error != null) {
        throw new Error(error==='超时'?'获取用户权限失败：超时':'获取用户权限失败：网络异常')
      }
      const data = result.data
      if (data.code !== 200) {
        throw new Error(`获取用户权限失败：${data.msg}`)
      }
      
      return data
    },
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
