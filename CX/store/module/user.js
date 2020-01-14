const state = {
  userInfo: null,
  isLogin: false,
  level: 0
}

const getters = {
  getUserInfo: state => state.userInfo,
  isLogin: state => state.isLogin,
  level: state => state.level
}

const mutations = {
  userLogin(state, user) {
    state.userInfo = user
    state.isLogin = true
  },
  userLogout(state) {
    state.userInfo = null
    state.isLogin = false
    state.level = 0
  },
  setLevel(state, level) {
    state.level = level
  }
}

const actions = {
  setUser({commit}, user) {
    if(user!=null) {
      commit("userLogin", user)
    } else {
      commit("userLogout")
    }
  },
  setLevel({commit}, level) {
    commit("setLevel", level)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}