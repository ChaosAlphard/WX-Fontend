import Vue from 'vue'
import App from './App'

import store from './store'

// 自定义导航栏
import cuCustom from './colorui/components/cu-custom.vue'

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

// 自定义组件挂载到全局
Vue.component('c-nav',cuCustom)

const app = new Vue({
	store,
	...App
})
app.$mount()
