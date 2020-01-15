<template>
  <view class="manage-wrapper">
    <view class="list-item">
      <view class="title">申请人</view>
      <view class="content">{{name}}</view>
    </view>
    <view class="list-item">
      <view class="title">申请信息</view>
      <view class="content">{{msg}}</view>
    </view>
    <view class="list-item">
      <view class="title">申请时间</view>
      <view class="content">{{time}}</view>
    </view>
    <view class="list-item">
      <view class="title">是否通过</view>
      <view class="content" :class="[judgeStatus(judge)]">
        {{judgeText(judge)}}
      </view>
    </view>
    
    <view class="submit-wrapper" v-if="isLogin&&level===2&&judge==='0'">
      <button class="submit cu-btn bg-red lg" :loading="btnLoading" @tap="disagree">
        不同意
      </button>
      <button class="submit cu-btn bg-cyan lg" :loading="btnLoading" @tap="agree">
        同意
      </button>
    </view>
  </view>
</template>

<script>
import {promisify, showToast} from '../../common/FnUtil.js'
  
  export default {
    data: () => ({
      id: '',
      openid: '',
      name: '',
      msg: '',
      judge: '',
      time: '',
      btnLoading: false
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
      async agree() {
        const res = await promisify(uni.showModal)({
          title: '同意',
          content: '确定？决定后就不能反悔了',
          confirmColor: '#DD514C',
          cancelColor: '#1CBBB4'
        }).catch(err => {
          showToast('调用失败:'+err.message)
          console.warn(err)
        })
        if(res.confirm !== true){
          showToast('取消')
          return
        }
        this.btnLoading = true

        // 获取订阅
        // const pmsReqSub = promisify(uni.requestSubscribeMessage)
        // const res = await pmsReqSub({
        //   tmplIds: ['AHpAmF18906B5wZ_zsB799T8KHi4wPtK4pL0Ro6a4Ew']
        // }).catch(err => {
        //   showToast('订阅失败')
        //   console.error(err)
        //   return;
        // })
        // if(res['AHpAmF18906B5wZ_zsB799T8KHi4wPtK4pL0Ro6a4Ew'] !== 'accept') {
        //   showToast('取消订阅后将无法及时接收通知')
        // }
        // 获取订阅

        this.sendJudge(true)
      },
      async disagree() {
        const res = await promisify(uni.showModal)({
          title: '不同意',
          content: '确定？决定后就不能反悔了',
          confirmColor: '#DD514C',
          cancelColor: '#1CBBB4'
        }).catch(err => {
          showToast('调用失败:'+err.message)
          console.warn(err)
        })
        if(res.confirm !== true){
          showToast('取消')
          return
        }
        this.btnLoading = true
        
        // 获取订阅
        // const pmsReqSub = promisify(uni.requestSubscribeMessage)
        // const res = await pmsReqSub({
        //   tmplIds: ['AHpAmF18906B5wZ_zsB799T8KHi4wPtK4pL0Ro6a4Ew']
        // }).catch(err => {
        //   showToast('订阅失败')
        //   console.error(err)
        //   return;
        // })
        // if(res['AHpAmF18906B5wZ_zsB799T8KHi4wPtK4pL0Ro6a4Ew'] !== 'accept') {
        //   showToast('取消订阅后将无法及时接收通知')
        // }
        // 获取订阅
        
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
        this.judge = flag?'1':'2'
        this.btnLoading = false
      },
      judgeStatus(status) {
        switch(status) {
          case '1': {
            return ['cuIcon-roundcheckfill','text-cyan']
          }
          case '2': {
            return ['cuIcon-roundclosefill', 'text-red']
          }
          default: {
            return  ['cuIcon-questionfill','text-grey']
          }
        }
      },
      judgeText(status) {
        switch(status) {
          case '1': {
            return '通过'
          }
          case '2': {
            return '否决'
          }
          default: {
            return  '待定'
          }
        }
      },
      async getApplyforInfo(guid) {
        const res = await promisify(uni.request)({
          url: 'http://192.168.1.54:5000/record/getbyguid',
          data: { guid: guid }
        }).catch(err => {
          showToast('获取信息失败')
          console.error(err)
          return;
        })
        const data = res.data
        if(!res||res.code!==200) {
          showToast(res.msg)
          return
        }
        const item = data.model
        this.id = item.id
        this.openid = item.openid
        this.name = item.name
        this.msg = item.msg
        this.judge = item.judge
        this.time = item.time
      }
    },
    onLoad(option) {
      if(!option.id) {
        showToast('获取id失败')
        return
      }
      if(!option.judge) {
        this.getApplyforInfo(option.id)
      } else {
        this.id = option.id
        this.openid = option.openid
        this.name = option.name
        this.msg = option.msg
        this.judge = option.judge
        this.time = option.time
      }
    }
  }
</script>

<style scoped>
.manage-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.list-item {
  position: relative;
  width: 100%;
  padding: 5% 2%;
  margin-top: 1.2rem;
  box-sizing: border-box;
  background-color: #FFFFFF;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  font-size: 0.8rem;
}
.list-item .title {
  width: 4rem;
  flex-shrink: 0;
}
.list-item .content {
  flex-grow: 1;
  word-break: break-all;
}

.submit-wrapper {
  width: 100%;
  margin: 2rem 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
}
</style>
