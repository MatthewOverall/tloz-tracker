import Vue from 'vue'
import Vuex from 'vuex'
import tiles1q from '../../../static/tiles1q.json'
import tiles2q from '../../../static/tiles2q.json'
import markers from '../../../static/markers.json'
import inputmap from '../../../static/inputmap.json'
import createPersistedState from 'vuex-persistedstate'
import gameState from '../../Game'
import fs from 'fs'
const { dialog } = require('electron').remote
let tilesMixed = JSON.parse(JSON.stringify(tiles1q));
Vue.use(Vuex)

let storedInput = localStorage.getItem('inputmap')
if (storedInput) {
  storedInput = JSON.parse(storedInput)
} else {
  storedInput = inputmap
}

storedInput = Object.assign(inputmap, storedInput)

for (const key in tiles2q) {
  if (tiles2q[key].type) {
    tilesMixed[key].type = tiles2q[key].type
  }
}

let map = `
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
`

const state = {
  rows: '01234567',
  cols: '0123456789ABCDEF',
  items: [
    '',
    'book',
    'boomerang',
    'bow',
    'power-bracelet',
    'heart-container',
    'stepladder',
    'blue-boomerang',
    'magic-key',
    'raft',
    'recorder',
    'red-candle',
    'red-ring',
    'silvers',
    'wand',
    'white-sword',
  ],
  wallMarkers: markers.underworld.walls,
  roomMarkers: markers.underworld.rooms,
  markers: markers.overworld,
  inputmap: storedInput,
  tiles1q,
  tiles2q,
  tilesMixed,
  tracker: {
    overworld: {},
    activeLevel: 9,
    activeQuest: 1,
    overworldItems: {
      whiteSword: { id: 0 },
      coast: { id: 0 },
      armos: { id: 0 },
    },
    levels: []
  }
}

const mutations = {
  ASSIGN_INPUT (state, d) {
    state.inputmap[d.name][d.index] = d.input
    localStorage.setItem('inputmap', JSON.stringify(state.inputmap))
  },
  SET_ACTIVE_LEVEL (state, level) {
    state.tracker.activeLevel = level
  },
  SET_TILE_MARKER (state, { tile, marker }) {
    tile.marker = marker
    saveTracker()
  },
  SET_ITEM_MARKER (state, { item, markerId }) {
    item.id = markerId
    saveTracker()
  },
  TOGGLE_COLLECTED (state, item) {
    item.collected = !item.collected
    saveTracker()
  },
  SET_TRACKER (state, data) {
    state.tracker = data
  },
  RESET_ALL (state) {
    for (let r = 0; r < state.rows.length; r++) {
      for (let c = 0; c < state.cols.length; c++) {
        state.tracker.overworld[state.rows[r] + state.cols[c]] = { marker: 'default' }
      }
    }
    state.tracker.activeQuest = 1
    state.tracker.mixQuest = false
    state.tracker.levels = [{
      level: 1,
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }, { id: 0 }],
      map: {}
    },
    {
      level: 2,
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }],
      map: {}
    }, {
      level: 3,
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }],
      map: {}
    }, {
      level: 4,
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }]
    }, {
      level: 5,
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }],
      map: {}
    }, {
      level: 6,
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }],
      map: {}
    }, {
      level: 7,
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }],
      map: {}
    }, {
      level: 8,
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }, { id: 0 }],
      map: {}
    }, {
      level: 9,
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }, { id: 0 }],
      map: {}
    }]

    state.tracker.overworldItems = {
      whiteSword: { id: 0 },
      coast: { id: 0 },
      armos: { id: 0 },
    }

    state.tracker.levels.forEach(dungeon => {
      let dungeonLayout = map.trim().split(/\r?\n/).map(x => x.split(''))

      for (let i = 0; i < dungeonLayout.length; i++) {
        for (let j = 0; j < dungeonLayout[i].length; j++) {
          let obj = { r: i, c: j, marker: 'default' }
          switch (dungeonLayout[i][j]) {
            case '.':
              obj.type = 'spacer'
              break
            case '-':
              obj.type = 'wall-h'
              break
            case '|':
              obj.type = 'wall-v'
              break
            case 'R':
              obj.type = 'room'
              break
          }
          dungeonLayout[i][j] = obj
        }
      }
      dungeon.map = dungeonLayout
    })
    saveTracker()
  },
  CHANGE_QUEST (state) {
    state.tracker.activeQuest = state.tracker.activeQuest === 1 ? 2 : 1
  },
  MIX_QUEST (state) {
    state.tracker.mixQuest = !state.tracker.mixQuest
  }
}

const actions = {
  RESET_ALL ({ commit }) {
    dialog.showMessageBox({
      type: 'question',
      title: 'Reset Tracker?',
      message: 'Do you want to reset the tracker?',
      buttons: ['Yes', 'No'],
    }, result => {
      if (result === 0) {
        commit('RESET_ALL')
      }
    })
  },
  LOAD ({ commit }) {
    dialog.showOpenDialog({
      title: 'Open Tracker Data',
      filters: [{ name: 'Zelda Tracker', extensions: ['z1t'] }]
    }, file => {
      if (!file) return
      let content = fs.readFileSync(file[0])
      let data = JSON.parse(content)
      commit('SET_TRACKER', data)
    })
  },
  SAVE () {
    dialog.showSaveDialog({
      title: 'Save Tracker Data',
      filters: [{ name: 'Zelda Tracker', extensions: ['z1t'] }]
    }, file => {
      if (!file) return
      let content = JSON.stringify(state.tracker)
      fs.writeFileSync(file, content, 'utf-8')
    })
  }
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
  },
  activeLevel (state) {
    return state.tracker.levels.find(x => x.level === state.tracker.activeLevel)
  },
  tiles (state) {
    if (state.tracker.mixQuest) return state.tilesMixed
    return state.tracker.activeQuest === 1 ? state.tiles1q : state.tiles2q
  }
}


let storedTracker = localStorage.getItem('tracker')
if (storedTracker) {
  state.tracker = JSON.parse(storedTracker)
} else {
  mutations.RESET_ALL(state)
}


export default new Vuex.Store({
  strict: true,
  state,
  mutations,
  actions,
  getters,
  //plugins: [createPersistedState()]
})


function saveTracker () {
  localStorage.setItem('tracker', JSON.stringify(state.tracker))
}
