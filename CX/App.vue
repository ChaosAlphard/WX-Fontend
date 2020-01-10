<script>
import {
  promisifyWithArr,
  withTimeoutWithArr,
  showToast,
  setStorage
} from './common/FnUtil.js'

export default {
  onLaunch: async function() {
    const isLogin = uni.getStorageSync("isLogin")
    if(isLogin) {
      const user = uni.getStorageSync("userInfo")
      const openid = uni.getStorageSync("openid")
      this.$store.dispatch("setUser", Object.assign(user, {openid: openid}))
      showToast('获取登录信息成功')
      return
    }

    // 登录
    const res = await this.login()
    if(res.code === 200) {
      setStorage({isLogin: true})
    } else {
      showToast(res.message)
      console.warn(res)
    }
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  methods: {
    async login() {
      // 展示loading界面
      uni.showLoading({ title: '正在登录', mask: true })
      try {
        // 取得用户识别码
        const code = await this.getCode()
        // 使用Promise.all 同时执行复数个异步函数
        const [sessionResult, userResult] = await Promise.all([
          // 用户识别码转换为用户openid和sessionKey
          this.code2session(code),
          // 用户授权后可获得用户信息
          this.getInfo()
        ])
        // 获取session对象
        const session = this.getSessionData(sessionResult)
        // 获取用户信息
        const user = userResult.userInfo
      
        showToast("登录成功")
      
        // 保存session到本地
        setStorage({
          'openid': session.openid,
          'sessionKey': session.session_key,
          'userInfo': user
        }, true)
        // 保存到Vuex
        this.$store.dispatch("setUser", user)

        // 更新服务器上的用户信息
        return await this.updateUser(session.openid, user)
      } catch (e) {
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
        url: 'http://192.168.1.54:5000/user/getinfo',
        data: { code: code }
      })
      const [result, error] = await withTimeoutWithArr(requestUserInfo, 10000)
      if (error != null) {
        console.error(error)
        throw new Error(error==='超时'?'超时':'网络异常')
      }

      return result
    },
    async getInfo() {
      const pmsGetSetting = promisifyWithArr(uni.getSetting)()
      const [result, error] = await withTimeoutWithArr(pmsGetSetting)
      if (error != null) {
        console.error(error)
        throw new Error(error)
      }
      if(!result||!result.authSetting['scope.userInfo']) {
        throw new Error('用户授权认证失败')
      }

      const pmsGetUserInfo = promisifyWithArr(uni.getUserInfo)()
      const [user, err] = await withTimeoutWithArr(pmsGetUserInfo)
      if (err != null) {
        console.error(err)
        throw new Error(err)
      }
      if(!user) {
        throw new Error('获取用户信息失败')
      }
      return user
    },
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
    getSessionData(response) {
      if (!response&&!response.data) {
        throw new Error('获取session失败')
      }
      const data = response.data
      if (data.code !== 200) {
        throw new Error(data.msg)
      }
      return JSON.parse(data.model)
    }
  }
}
</script>

<style>
  /*每个页面公共css */
  @import 'colorui/main.css';
  @import 'colorui/icon.css'
</style>
