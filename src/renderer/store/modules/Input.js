import gameState from '../../../Game'

let storedInput = getStoredInput()

const state = {
  inputmap: storedInput,
}
const mutations = {
  ASSIGN_INPUT (state, d) {
    state.inputmap[d.type][d.name][d.index] = d.input
    localStorage.setItem('inputmap_v1', JSON.stringify(state.inputmap))
  }
}
const getters = {
  isBindingPressed: state => (type, binding) => {
    return state.inputmap[type][binding] && state.inputmap[type][binding].some(x => gameState.input.isKeyPressed(x))
  },
  isBindingDown: state => (type, binding) => {
    return state.inputmap[type][binding] && state.inputmap[type][binding].some(x => gameState.input.isKeyDown(x))
  },
  isBindingUp: state => (type, binding) => {
    return state.inputmap[type][binding] && state.inputmap[type][binding].some(x => gameState.input.isKeyUp(x))
  }
}

export default {
  state,
  mutations,
  getters
}

function getStoredInput() {
  let storedInput = loadStoredInputData()
  let storedInputVersion = storedInput.version || 0
  let storedInputMaps = [
    mapV0ToV1
  ]

  while (storedInputVersion < storedInputMaps.length) {
    storedInput = storedInputMaps[storedInputVersion](storedInput)
    storedInputVersion = storedInput.version
    localStorage.setItem('inputmap_v' + storedInputVersion, JSON.stringify(storedInput))
  }

  return storedInput
}

function loadStoredInputData() {
  let storedInput

  //Get Version 1
  storedInput = localStorage.getItem('inputmap_v1')
  storedInput = storedInput ? JSON.parse(storedInput) : null
  if (storedInput === null) {
    //Get Version 0
    storedInput = localStorage.getItem('inputmap')
    storedInput = storedInput ? JSON.parse(storedInput) : null
  }
  if (storedInput === null) {
    //Get Default Data
    storedInput = require('../../../../static/inputmap.json')
  }

  return Object.assign(storedInput)
}

function mapV0ToV1(storedInput) {
  let globalInputs = getGlobalInputs();
  let overworldInputs = getOverworldInputs();
  let dungeonInputs = getDungeonInput();
  let newStoredInput = {
    global: {},
    overworld: {},
    dungeon: {}
  }
  for (let key in storedInput) {
    if (globalInputs.includes(key)) {
      newStoredInput['global'][key] = storedInput[key]
    }
    else if (overworldInputs.includes(key)) {
      newStoredInput['overworld'][key] = storedInput[key]
    }
    else if (dungeonInputs.includes(key)) {
      newStoredInput['dungeon'][key] = storedInput[key]
    }
  }
  newStoredInput.version = 1

  return newStoredInput
}

function getGlobalInputs() {
  return [
    "selector-up",
    "selector-down",
    "selector-left",
    "selector-right"
  ]
}

function getOverworldInputs() {
  return [
    "cycle-level",
    "cycle-shop",
    "cycle-misc",
    "cycle-warp",
    "level-1",
    "level-2",
    "level-3",
    "level-4",
    "level-5",
    "level-6",
    "level-7",
    "level-8",
    "level-9",
    "shop-arrow",
    "shop-bomb",
    "shop-key",
    "shop-food",
    "shop-candle",
    "shop-ring",
    "misc-potion",
    "misc-gamble",
    "misc-hints",
    "misc-sword",
    "warp-1",
    "warp-2",
    "warp-3",
    "warp-4"
  ]
}

function getDungeonInput() {
  return [
    "cycle-wall-up",
    "cycle-wall-down",
    "cycle-wall-left",
    "cycle-wall-right",
    "cycle-room-up",
    "cycle-room-down"
  ]
}
