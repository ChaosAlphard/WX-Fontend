<template>
  <view class="record-wrapper">
    <view class="cu-list menu">
      <view class="cu-item apply-item" v-for="item in recordData" :key="item.id">
        <view class="content">
          <view :class="[judgeStatus(item.judge)]" class="apply-title">
            [{{judgeText(item.judge)}}] - 申请人：{{item.name}}
          </view>
          <view class="apply-content">
            <text>信息:{{item.message}}</text>
          </view>
          <view class="apply-footer">
            <text>时间:{{item.time}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { promisify, showToast } from '../../common/FnUtil.js'
  
export default {
  data: () => ({
    recordData: []
  }),
  methods: {
    async getRecord() {
      const pmsRequest = promisify(uni.request)
      const result = await pmsRequest({
        url: 'http://192.168.1.54:5000/record/queryall'
      }).catch(err => {
        showToast('网络异常')
      })
      const res = result.data
      if(!res||res.code !== 200) {
        showToast(res.msg)
      }
      this.recordData = res.data.reverse()
    },
    judgeStatus(status) {
      switch(status) {
        case 1: {
          return ['cuIcon-roundcheckfill','text-cyan']
        }
        case 2: {
          return ['cuIcon-roundclosefill', 'text-red']
        }
        default: {
          return  ['cuIcon-questionfill','text-grey']
        }
      }
    },
    judgeText(status) {
      switch(status) {
        case 1: {
          return '通过'
        }
        case 2: {
          return '否决'
        }
        default: {
          return  '待定'
        }
      }
    }
  },
  onLoad(option) {
    console.log(option)
  },
  beforeMount() {
    this.getRecord()
  }
}
</script>

<style scoped>
.apply-item:not(:nth-last-child(1)){
  margin-bottom: 1.2rem;
}
.apply-title {
  font-size: 1rem;
}
.apply-content {
  font-size: 1.2rem;
  margin: 18rpx 0;
}
.apply-footer {
  font-size: 0.8rem;
}
</style>
