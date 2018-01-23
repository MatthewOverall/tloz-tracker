import Vue from 'vue'
import Vuex from 'vuex'
import tiles from '../../../static/tiles.json'
import markers from '../../../static/markers.json'
Vue.use(Vuex)

const state = {
  rows: '01234567',
  cols: '0123456789ABCDEF',
  items: ['', 'bow', 'boomerang', 'blue-boomerang', 'raft', 'stepladder', 'recorder', 'wand', 'red-candle', 'red-ring', 'book', 'magic-key', 'white-sword', 'heart-container', 'power-bracelet'],
  markers: markers,
  tracker: {
    tiles: tiles,
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
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

const getters = {

}


for (let r = 0; r < state.rows.length; r++) {
  for (let c = 0; c < state.cols.length; c++) {
    state.tracker.tiles[state.rows[r] + state.cols[c]].marker = 'default'
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
