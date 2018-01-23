import gamepad from './gamepad'
import { log } from 'util';
const listeners = [];

const input = {
  keys: {
  },
  getPressedKeys () {
    let pressed = []
    for (const k in this.keys) {
      if (this.keys.hasOwnProperty(k)) {
        pressed.push(this.keys[k])
      }
    }
  },
  isKeyDown (code) {
    return this.keys[code] && this.keys[code].pressed
  },
  onInput (handler) {
    listeners.push(handler)
  }
}

function emitInput (e) {
  listeners.forEach(l => {
    l(e, input)
  });
}

window.onkeydown = (e) => {
  console.log(e)
  if (!input.keys[e.code]) {
    input.keys[e.code] = {}
  }
  if (!input.keys[e.code].pressed) {
    input.keys[e.code].keyCode = e.keyCode
    input.keys[e.code].key = e.key
    input.keys[e.code].code = e.code
    input.keys[e.code].pressed = true
  }
  emitInput(e)
}

window.onkeyup = (e) => {
  let ks = input.keys[e.code]
  if (!ks) ks = input.keys[e.code] = {}
  ks.pressed = false
  emitInput(e)
}

export default input