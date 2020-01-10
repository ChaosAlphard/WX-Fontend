const state = {
  userInfo: null,
  isLogin: false
}

const getters = {
  getUserInfo: state => state.userInfo,
  isLogin: state => state.isLogin
}

const mutations = {
  userLogin(state, user) {
    state.userInfo = user
    state.isLogin = true
  },
  userLogout(state) {
    state.userInfo = null
    state.isLogin = false
  }
}

const actions = {
  setUser({commit}, user) {
    if(user!=null) {
      commit("userLogin", user)
    } else {
      commit("userLogout")
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}