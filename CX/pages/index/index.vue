<template>
  <view class="content">
    <!-- Content Start -->
    <!-- v-if: 表达式中结果为true时才渲染(render)对应的组件 -->
    <!-- 此处为根据data中curPage属性切换render的组件 -->
    <c-applyfor v-if="curPage==='apply-for'&&isLogin" class="comp" :key="'apply-for'"/>
    <c-user v-else-if="curPage==='user'" class="comp" :key="'user'"/>
    <c-main v-else class="comp" :key="'main'"/>
    <!-- Content End -->

    <!-- Bottom Bar Start -->
    <view class="cu-bar tabbar bg-white foot">
      <!-- 主页 -->
      <!-- changePage: 切换curPage -->
      <!-- :class为v-bind:class的简写
      可将数据绑定的html属性中 -->
      <!-- 此处的{'text-blue': boolean}意为，
      当boolean为true时，绑定text-blue到class中 -->
      <view class="action" data-name="main" @click="changePage"
      :class="{'text-blue': isCurPage('main')}">
        <!-- 使用iconFont做图标展示，本质为特殊字体，
        可用文本方法控制(font-size, text-shadow等) -->
        <view class="cuIcon-home"></view>
        <view>主页</view>
      </view>
      <!-- 申请 -->
      <view v-if="isLogin&&level!==0" class="action" data-name="apply-for" @click="changePage"
      :class="{'text-blue': isCurPage('apply-for')}">
        <view class="cuIcon-roundadd"></view>
        <view>申请</view>
      </view>
      <!-- 用户 -->
      <view class="action" data-name="user" @click="changePage"
      :class="{'text-blue': isCurPage('user')}">
        <view class="cuIcon-people"></view>
        <view>用户</view>
      </view>
    </view>
    <!-- Bottom Bar End -->
  </view>
</template>

<script>
  export default {
    // data必须是由一个函数返回的对象，
    // 否则data将暴露在此文件所在的作用域中，
    // 可被其他组件修改
    // es5写法如下
    // data: function() { return { key: value } }
    // es6可用解构或箭头函数改写
    // data() { return { key: value } }
    // data: () => { return { key: value } }
    // 箭头后只有一个`表达式`的时候会默认返回, 所以可改写为如下形式
    data: () => ({
      curPage: 'main'
    }),
    // 计算属性，当属依赖的值发生改变后会进行计算，返回新值，watch也有类似效果
    computed: {
      // 可写为函数形式，也可写为对象形式
      // isLogin() { return this.$store.getters.isLogin }
      isLogin: {
        get() {
          return this.$store.getters.isLogin
        },
        set(val) {}
      },
      level() {
        return this.$store.getters.level
      }
    },
    onLoad() {
      console.log('index load')
    },
    methods: {
      changePage(ev) {
        this.curPage = ev.currentTarget.dataset.name
      },
      isCurPage(page) {
        return this.curPage === page
      }
    }
  }
</script>

<style scoped>
/* .content {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
} */

.content .comp {
  position: relative;
}
</style>
