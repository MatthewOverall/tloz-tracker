import Vue from 'vue'
import Vuex from 'vuex'
import tiles from '../../../static/tiles.json'
import markers from '../../../static/markers.json'
import inputmap from '../../../static/inputmap.json'
import createPersistedState from 'vuex-persistedstate'

import gameState from '../../Game'
Vue.use(Vuex)

const state = {
  rows: '01234567',
  cols: '0123456789ABCDEF',
  items: ['', 'bow', 'boomerang', 'blue-boomerang', 'raft', 'stepladder', 'recorder', 'wand', 'red-candle', 'red-ring', 'book', 'magic-key', 'white-sword', 'heart-container', 'power-bracelet'],
  wallMarkers: ['','open','blocked'],
  roomMarkers: ['','checked','interest'],
  markers: markers,
  inputmap: inputmap,
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
  ASSIGN_INPUT (state, d) {
    state.inputmap[d.name][d.index] = d.input
  }
}

const actions = {
}

const getters = {
  getMarkersByGroup: state => (group) => {
    let grouped = {}
    for (const key in state.markers) {
      if (state.markers.hasOwnProperty(key)) {
        if (state.markers[key].group === group) {
          grouped[key] = state.markers[key]
        }
      }
    }
    return grouped
  },
  isBindingPressed: state => (binding) => {
    return state.inputmap[binding] && state.inputmap[binding].some(x => gameState.input.isKeyPressed(x))
  },
  isBindingDown: state => (binding) => {
    return state.inputmap[binding] && state.inputmap[binding].some(x => gameState.input.isKeyDown(x))
  },
  isBindingUp: state => (binding) => {
    return state.inputmap[binding] && state.inputmap[binding].some(x => gameState.input.isKeyUp(x))
  }
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
  getters,
  plugins: [createPersistedState()]
})
