import Vue from 'vue'
import Vuex from 'vuex'
import tiles from '../../../static/tiles.json'

Vue.use(Vuex)

const state = {
  tiles: tiles,
  tracker: {
    levels: [{
      level: 1,
      triforceCollected: false,
      heartCollected: false,
      items:["",""]
    },
    {
      level: 2,
      triforceCollected: false,
      heartCollected: false,
      items:[""]
    }, {
      level: 3,
      triforceCollected: false,
      heartCollected: false,
      items:[""]
    }, {
      level: 4,
      triforceCollected: false,
      heartCollected: false,
      items:[""]
    }, {
      level: 5,
      triforceCollected: false,
      heartCollected: false,
      items:[""]
    }, {
      level: 6,
      triforceCollected: false,
      heartCollected: false,
      items:[""]
    }, {
      level: 7,
      triforceCollected: false,
      heartCollected: false,
      items:[""]
    }, {
      level: 8,
      triforceCollected: false,
      heartCollected: false,
      items:[""]
    }]
  }
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

const getters = {

}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
