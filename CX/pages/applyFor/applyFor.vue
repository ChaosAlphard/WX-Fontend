<template>
  <view class="applyfor-wrapper">
    <view class="cu-form-group margin-top">
      <view class="title">申请人</view>
      <input placeholder="输入名字, 长度不超过10, 不能出现数字"
      name="user" v-model="usrInput" />
    </view>

    <view class="cu-form-group margin-top align-start">
      <view class="title">申请信息</view>
      <textarea placeholder="输入信息, 长度不超过30"
      v-model="msgInput" />
    </view>

    <button class="submit cu-btn bg-cyan lg" @tap="requestSub"
    :loading="btnLoading" :disabled="!isAvailable">
      提交
    </button>
    
    <view class="cu-form-group margin-top">
      <navigator
      url="../manage/manage?openid=oqFTn5Yr2QNr_-492HBzh7I_w53Y&name=万&msg=测试">
        管理(开发only, 生产环境应去掉此按钮)
      </navigator>
    </view>
  </view>
</template>

<script>
import { promisify, showToast } from '../../common/FnUtil.js'

export default {
  data: () => ({
    msgInput: '',
    usrInput: '',
    btnLoading: false
  }),
  watch: {
    msgInput(newVal, oldVal) {
      if (newVal.trim().length > 30) {
        return
      }
      this.msgInput = newVal
    },
    usrInput(newVal, oldVal) {
      if (newVal.trim().length > 10) {
        return
      }
      this.usrInput = newVal
    }
  },
  computed: {
    isAvailable() {
      return (
        this.msgInput.trim().length > 0 &&
        this.usrInput.trim().length > 0 && 
        !/[0-9`~,.?/\\'";:<>\[\]{}\-_=+\|]/
        .test(this.usrInput.trim())
      )
    }
  },
  methods: {
    async submit() {
      //this.btnLoading = true
      const openid = uni.getStorageSync('openid')
      if(!openid) {
        showToast('获取用户信息失败')
        this.btnLoading = false
        return
      }
      const pmsRequest = promisify(uni.request)
      const result = await pmsRequest({
        url: 'http://192.168.1.54:5000/wx/applyforRepair',
        method: 'POST',
        header: { 'content-type': 'application/json' },
        data: {
          openid: openid,
          name: this.usrInput,
          message: this.msgInput
        }
      }).catch(e => {
        this.btnLoading = false
        showToast('服务器异常')
        console.error(e)
      })
      
      const data = result.data
      if(!data||data.code !== 200) {
        showToast(result.data.msg)
      } else {
        showToast('发送成功')
      }
      
      this.msgInput = this.usrInput = ''
      this.btnLoading = false
    },
    // 订阅一次消息
    async requestSub() {
      this.btnLoading = true

      const pmsReqSub = promisify(uni.requestSubscribeMessage)
      const res = await pmsReqSub({
        tmplIds: ['AHpAmF18906B5wZ_zsB799T8KHi4wPtK4pL0Ro6a4Ew']
      }).catch(err => {
        showToast('订阅失败')
        console.error(err)
        return;
      })
      if(res['AHpAmF18906B5wZ_zsB799T8KHi4wPtK4pL0Ro6a4Ew'] !== 'accept') {
        showToast('取消订阅后将无法及时接收通知')
      }
      
      this.submit()
    }
  }
}
</script>

<style scoped>
.applyfor-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
}

.applyfor-wrapper .submit {
  width: 90%;
  margin: 2rem 5%;
}
</style>
