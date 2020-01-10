import Vue from 'vue'
import App from './App'

// Vuex
import store from './store/store.js'

// 自定义组件
import cuCustom from './colorui/components/cu-custom.vue'
import main from './pages/main/main.vue'
import applyFor from './pages/applyfor/applyfor.vue'
import user from './pages/user/user.vue'
// 组件挂载
Vue.component('cu-custom', cuCustom)
Vue.component('c-main', main)
Vue.component('apply-for', applyFor)
Vue.component('user', user)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
