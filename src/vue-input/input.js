import gamepad from './gamepad'
import { log } from 'util';
const listeners = []


const input = {
  frame: 0,
  buffer: [],
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
  //returns true the first frame the input is pressed
  isKeyDown (code) {
    return this.keys[code] && this.keys[code].pressedThisFrame
  },
  //returns true whenever the key is held down
  isKeyPressed (code) {
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

window.addEventListener('ongamepadinput', (e) => {
  let d = e.detail
  d.preventDefault = () => { }
  input.keys[d.code] = d
  emitInput(d)
})

window.onkeydown = (e) => {
  if (!input.keys[e.code]) {
    input.keys[e.code] = {}
  }
  if (!input.keys[e.code].pressed) {
    input.keys[e.code].keyCode = e.keyCode
    input.keys[e.code].key = e.key
    input.keys[e.code].code = e.code
    input.keys[e.code].pressed = true
    input.keys[e.code].pressedThisFrame = true
  } else {
    input.keys[e.code].pressedThisFrame = false
  }
  emitInput(e)
}

window.onkeyup = (e) => {
  let ks = input.keys[e.code]
  if (!ks) ks = input.keys[e.code] = {}
  ks.pressed = false
  ks.releasedThisFrame = true
  emitInput(e)
}

export default input