import Vue from 'vue'
import App from './App'

// Vuex
import store from './store/store.js'

// 引入自定义组件
import cuCustom from './colorui/components/cu-custom.vue'
import main from './pages/main/main.vue'
import applyFor from './pages/applyfor/applyfor.vue'
import user from './pages/user/user.vue'
// 组件挂载后可在全局直接使用
Vue.component('cu-custom', cuCustom)
Vue.component('c-main', main)
Vue.component('c-applyfor', applyFor)
Vue.component('c-user', user)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
