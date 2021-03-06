import fs from 'fs'
import markers from '../../../../static/markers.json'
import dungeons from '../../../../static/dungeons.json'
import tiles1q from '../../../../static/tiles1q.json'
import tiles2q from '../../../../static/tiles2q.json'

import { getDefaultState } from '../defaultState'
const { dialog } = require('electron').remote


let tilesMixed = JSON.parse(JSON.stringify(tiles1q));
for (const key in tiles2q) {
  if (tiles2q[key].type) {
    tilesMixed[key].type = tiles2q[key].type
  }
}
let defaultState = getDefaultState()

const state = {
  levelIds: '123456789',
  items: [
    '',
    'bow',
    'stepladder',
    'recorder',
    'power-bracelet',
    'raft',
    'silvers',
    'white-sword',
    'wand',
    'book',
    'boomerang',
    'blue-boomerang',
    'heart-container',
    'magic-key',
    'red-candle',
    'red-ring',
  ],
  wallMarkers: markers.underworld.walls,
  roomMarkers: markers.underworld.rooms,
  markers,
  dungeons,
  tiles1q,
  tiles2q,
  tilesMixed,
  tracker: defaultState
}

const mutations = {
  SET_ACTIVE_LEVEL (state, level) {
    state.tracker.activeLevel = level
  },
  SET_TILE_MARKER (state, { tile, marker }) {
    tile.marker = marker
    saveTracker()
  },
  SET_ITEM_MARKER (state, { item, marker }) {
    item.id = marker
    saveTracker()
  },
  TOGGLE_COLLECTED (state, item) {
    item.collected = !item.collected
    saveTracker()
  },
  SET_TRACKER (state, data) {
    state.tracker = data
  },
  SET_ITEM_BOX (state, data) {
    state.tracker.levels[data.levelIndex].items.splice(data.itemIndex, 1, data.item);
  },
  RESET_ALL (state) {
    state.tracker = getDefaultState()
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
  activeMap (state) {
    return state.tracker.maps[state.tracker.activeLevel]
  },
  tiles (state) {
    if (state.tracker.mixQuest) return state.tilesMixed
    return state.tracker.activeQuest === 1 ? state.tiles1q : state.tiles2q
  },
  getMarkersByGroup: state => (group) => {
    let grouped = {}
    for (const key in state.markers.overworld) {
        if (state.markers.overworld[key].group === group) {
          grouped[key] = state.markers.overworld[key]
        }
    }
    return grouped
  },
  activeMarkers(state){
    return Object.values(state.tracker.overworld).map(x => x.marker)
  },
  discoveredDungeons(state, getters){
    return getters.activeMarkers.filter(x => x.startsWith('level')).map(x => x.substring(6))
  },
  discoveredItems(state){
    return[
      state.tracker.overworldItems.armos.id,
      state.tracker.overworldItems.coast.id,
      state.tracker.overworldItems.whiteSword.id
    ].concat(...Object.values(state.tracker.levels).map(x => x.items.map(a => a.id)))
  },
  unDiscoveredItems(state,getters){
    return state.items.filter(x => !getters.discoveredItems.includes(x))
  },
  stateOfItems(state,getters){
    let discovered = getters.discoveredItems.filter(x => {return x !== ""});
    return state.items.map(x => {
      let found = x !== "" ? discovered.includes(x) : false;
      return {"name": x, "found": found};
    });
  }

}


let storedTracker = localStorage.getItem('tracker')
if (storedTracker) {
  state.tracker = JSON.parse(storedTracker)
} else {
  mutations.RESET_ALL(state)
}


export default {
  state,
  mutations,
  actions,
  getters,
}


function saveTracker () {
  localStorage.setItem('tracker', JSON.stringify(state.tracker))
}
