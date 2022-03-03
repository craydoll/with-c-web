import firebase from '@/plugins/firebase'

export const state = () => ({
  isLoggedIn: false,
  id: '',
  user: null,
})

export const getters = {
  isLoggedIn: (state) => {
    return state.isLoggedIn
  },
  id: (state) => {
    return state.id
  },
  user: (state) => {
    return state.user
  }
}

export const actions = {
  async loggedIn ({ commit, state }, id) {
    // 既にユーザー情報がある場合は何もしない
    try {
      console.log('loggedIn:' + id)
      await commit('login', id)
      return id
    } catch (err) {
      throw new Error('in auth:loggedIn:' + id + '/' + err.message)
    }
  },
  async logout ({ commit }) {
    await firebase.auth().signOut()
    console.log('logout')
    return commit('logout')
  },
  async setUser({ commit }, user) {
    await commit('updUser', user)
  }
}
export const mutations = {
  updUser (state, user) {
    state.user = user
  },
  login(state, id) {
    console.log('in mutations:login ' + id)
    state.isLoggedIn = true
    state.id = id
  },
  logout (state) {
    state.isLoggedIn = false
    state.id = ''
    state.user = null
  }
}
