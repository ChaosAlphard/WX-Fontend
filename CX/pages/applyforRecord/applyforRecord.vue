<template>
  <view class="record-wrapper">
    <view class="apply-list">
      <navigator class="apply-item" v-for="item in recordData" :key="item.id"
      :url="'../manage/manage?'+getParams(item)">
        <view :class="[judgeStatus(item.judge)]" class="apply-title">
          [{{judgeText(item.judge)}}] - 申请人：{{item.name}}
        </view>
        <view class="apply-content">
          信息:{{item.message}}
        </view>
        <view class="apply-footer">
          时间:{{item.time}}
        </view>
      </navigator>
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
    async getRecord(src) {
      const pmsRequest = promisify(uni.request)
      const result = await pmsRequest({
        url: 'http://192.168.1.54:5000/record/'+src
      }).catch(err => {
        showToast('网络异常')
      })
      const res = result.data
      if(!res||res.code !== 200) {
        showToast(res.msg)
      }
      this.recordData = res.data
    },
    getParams(i){
      return `id=${i.id}&openid=${i.openid}&name=${i.name}&msg=${i.message}&judge=${i.judge}&time=${i.time}`
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
    if(!option.openid) {
      showToast('获取openid失败')
    } else if(option.openid==="manage") {
      this.getRecord("queryall")
    } else {
      this.getRecord("querybyopenid?openid="+option.openid)
    }
  },
  beforeMount() {
    // this.getRecord("record/queryall")
  }
}
</script>

<style scoped>
.apply-list, .apply-item {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
}
.apply-item {
  background-color: #FFFFFF;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
}
.apply-item:not(:nth-last-child(1)){
  margin-bottom: 1.2rem;
}
.apply-title {
  font-size: 1rem;
}
.apply-content {
  font-size: 1.2rem;
  margin: 20rpx 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.apply-footer {
  font-size: 0.8rem;
}
</style>
