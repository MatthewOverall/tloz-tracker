import gamepad from './gamepad'
const input = {
  listeners: [],
  state: {},
  isKeyDown (code) {
  },
  onInput (handler) {
    this.listeners.push(handler)
  },
  emitInput () {
    this.listeners.forEach(l => {
      l(this.state)
    });
  }
}

window.onkeydown = (e) => {
  if (!input.state[e.key]) {
    input.state[e.key] = {}
  }
  if (!input.state[e.key].pressed) {
    input.state[e.key].pressed = true
  }
  input.emitInput()
}

window.onkeyup = (e) => {
  let ks = input.state[e.key]
  if (!ks) ks = input.state[e.key] = {}
  ks.pressed = false
  input.emitInput()
}

export default input