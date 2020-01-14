<script>
import {
  promisifyWithArr,
  withTimeoutWithArr,
  showToast,
  setStorage
} from './common/FnUtil.js'

export default {
  onLaunch: async function() {
    // 查看用户是否已经授权登录
    // 清除缓存会将此状态清空
    // 但不会清除授权状态
    const authed = uni.getStorageSync("authed")
    if(authed) {
      const openid = uni.getStorageSync("openid")
      const level = await this.getLevel(openid).catch(e => {
        showToast('获取权限失败，请稍后重试')
        console.error(e)
        return
      })
      if(level.model < 1) {
        showToast('账户未激活')
        return
      }

      const user = uni.getStorageSync("userInfo")
      this.$store.dispatch("setUser", Object.assign(user, {openid: openid}))
      this.$store.dispatch("setLevel", level.model)

      showToast('获取登录信息成功')
    } else {
      // 登录
      const [res, level] = await this.login()
      .catch(err => {
        showToast(err.message)
        console.error(err)
        return
      })
      setStorage({ authed: true })
      showToast('获取用户信息成功')
    }
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  // 除组件生命周期钩子函数以外的函数都必须写在methods对象中
  // uni: onLaunch, onShow, onHidden 等
  // vue: beforeCreate, created, beforeMount, mounted 等
  methods: {
    async login() {
      // 展示loading界面
      uni.showLoading({ title: '正在登录', mask: true })
      try {
        // 取得用户识别码
        const code = await this.getCode()
        // 使用Promise.all 同时执行复数个异步函数
        const [sessionResult, user] = await Promise.all([
          // 用户识别码转换为用户openid和sessionKey
          // 唯有此WXApi返回JSON格式的字符串
          // 且不能由前端调用, 可委托给服务器
          // 可在服务端处理JSON字符串，也可让前端处理
          // 目前是前端处理
          this.code2session(code),
          // 用户授权后可获得用户信息
          this.getInfo()
        ])
        if (!sessionResult||!sessionResult.data) {
          throw new Error('获取session失败')
        }
        const sessionResponse = sessionResult.data
        if (sessionResponse.code !== 200) {
          throw new Error(sessionResponse.msg)
        }
        // 获取session对象
        const session = sessionResponse.model
        // 获取权限level
        const level = await this.getLevel(session.openid).catch(e => {
          showToast('获取权限失败，请稍后重试')
          console.error(e)
          return
        })
        if(level.model < 1) {
          showToast('账户未激活')
          return
        }
        showToast("登录成功")
        // 保存session到本地
        setStorage({
          'openid': session.openid,
          'sessionKey': session.session_key,
          'userInfo': user
        }, true)
        // 保存到Vuex
        this.$store.dispatch("setUser", user)
        this.$store.dispatch("setLevel", level.model)
        
        return Promise.all([
          // 更新服务器上的用户信息
          this.updateUser(session.openid, user),
          // 获取用户权限
          this.getLevel(session.openid)
        ])
      } catch (e) {
        console.error(e)
        showToast(e.message)
      } finally {
        // 取消loading界面
        uni.hideLoading()
      }
    },
    async getCode() {
      // 调用wx.login可获取用户临时身份信息
      // uni会自动转义到对应平台的接口(uni.login -> wx.login|ali.login|bd.login)
      const pmslogin = promisifyWithArr(uni.login)()
      // withTimeout 设置超时, 默认3000ms
      // 详细见\common\FnUtil.js
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
      // uni.request 发起http请求
      // 使用Promise封装避免callback 嵌套
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
    async getInfo() {
      // 微信调整此接口后
      // 用户未授权时调用此接口不会报错, 也不弹出授权弹窗
      // 而是直接返回一个空对象
      const pmsGetSetting = promisifyWithArr(uni.getSetting)()
      const [result, error] = await withTimeoutWithArr(pmsGetSetting)
      if (error != null) {
        console.error(error)
        throw new Error(error)
      }
      if(!result||!result.authSetting['scope.userInfo']) {
        throw new Error('用户授权认证失败，请前往用户界面授权')
      }

      // 用户授权后可调用此接口取得用户信息
      const pmsGetUserInfo = promisifyWithArr(uni.getUserInfo)()
      const [user, err] = await withTimeoutWithArr(pmsGetUserInfo)
      if (err != null) {
        console.error(err)
        throw new Error(err)
      }
      if(!user||!user.userInfo||!user.userInfo.nickName) {
        throw new Error('获取用户信息失败')
      }
      return user.userInfo
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
        // 模板字符串,使用反引号表示(esc下面那个键)
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
    }
  }
}
</script>

<style>
  /*每个页面公共css */
  @import 'colorui/main.css';
  @import 'colorui/icon.css'
</style>
