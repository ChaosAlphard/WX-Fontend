<template>
  <view>
    <view class="cu-form-group">
      (开发only, 生产环境应从option中获取guid(id))
    </view>
    <view class="cu-form-group">
      <view class="title">输入guid:</view>
      <input type="text" v-model="id"/>
    </view>
    <view class="cu-form-group">openid: {{openid}}</view>
    <view class="cu-form-group">name: {{name}}</view>
    <view class="cu-form-group">msg: {{msg}}</view>
    
    <button class="submit cu-btn bg-cyan lg" @tap="agree"
    >
      同意
    </button>
    
    <button class="submit cu-btn bg-red lg" @tap="disagree"
    >
      不同意
    </button>
  </view>
</template>

<script>
import {promisify, showToast} from '../../common/FnUtil.js'
  
  export default {
    data: () => ({
      id: '',
      openid: '',
      name: '',
      msg: ''
    }),
    methods: {
      agree() {
        this.sendJudge(true)
      },
      disagree() {
        this.sendJudge(false)
      },
      async sendJudge(flag) {
        const pmsRequest = promisify(uni.request)
        const result = await pmsRequest({
          url: 'http://192.168.1.54:5000/wx/replyRepair',
          method: 'POST',
          header: { 'content-type': 'application/json' },
          data: {
            id: this.id,
            openid: this.openid,
            isAgree: flag?"true":""
          }
        }).catch(err => {
          showToast('服务器异常')
          console.error(err)
        })
        
        const data = result.data
        if(!data||data.code !== 200) {
          showToast(data.msg)
        }
        
        console.warn('To do', result)
      }
    },
    onLoad(option) {
      this.openid = option.openid
      this.name = option.name
      this.msg = option.msg
      console.log(option)
    }
  }
</script>

<style scoped>

</style>
