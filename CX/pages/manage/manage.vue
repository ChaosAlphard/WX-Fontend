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
      <button class="submit cu-btn bg-cyan lg" @tap="agree">
        同意
      </button>
      <button class="submit cu-btn bg-red lg" @tap="disagree">
        不同意
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
      time: ''
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
      }
    },
    onLoad(option) {
      this.id = option.id
      this.openid = option.openid
      this.name = option.name
      this.msg = option.msg
      this.judge = option.judge
      this.time = option.time
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
  //
}
</style>
