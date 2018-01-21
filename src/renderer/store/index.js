import Vue from 'vue'
import Vuex from 'vuex'
import tiles from '../../../static/tiles.json'

Vue.use(Vuex)

const state = {
  tiles: tiles,
  items: ["", "bow", "boomerang", "blue-boomerang", "raft", "stepladder", "recorder", "wand", "red-candle", "red-ring", "book", "magic-key", "white-sword", "heart-container", "power-bracelet"],
  tracker: {
    overworldItems: {
      whiteSword: { id: 0 },
      coast: { id: 0 },
      armos: { id: 0 },
    },
    levels: [{
      level: 1,
      triforceCollected: false,
      heartCollected: false,
      items: [{ id: 0 }, { id: 0 }]
    },
    {
      level: 2,
      triforceCollected: false,
      heartCollected: false,
      items: [{ id: 0 }]
    }, {
      level: 3,
      triforceCollected: false,
      heartCollected: false,
      items: [{ id: 0 }]
    }, {
      level: 4,
      triforceCollected: false,
      heartCollected: false,
      items: [{ id: 0 }]
    }, {
      level: 5,
      triforceCollected: false,
      heartCollected: false,
      items: [{ id: 0 }]
    }, {
      level: 6,
      triforceCollected: false,
      heartCollected: false,
      items: [{ id: 0 }]
    }, {
      level: 7,
      triforceCollected: false,
      heartCollected: false,
      items: [{ id: 0 }]
    }, {
      level: 8,
      triforceCollected: false,
      heartCollected: false,
      items: [{ id: 0 }, { id: 0 }]
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
