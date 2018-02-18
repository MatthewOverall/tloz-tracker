import gameState from '../../../Game'

let storedInput = getStoredInput()

const state = {
  inputmap: storedInput,
}
const mutations = {
  ASSIGN_INPUT (state, d) {
    state.inputmap[d.name][d.index] = d.input
    localStorage.setItem('inputmap', JSON.stringify(state.inputmap))
  }
}
const getters = {
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

export default {
  state,
  mutations,
  getters
}

function getStoredInput() {
  let inputmap = require('../../../../static/inputmap.json')
  let storedInput = localStorage.getItem('inputmap') || {}
  return Object.assign(inputmap, storedInput)
}
