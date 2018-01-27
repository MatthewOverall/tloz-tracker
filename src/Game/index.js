import gamepad from './gamepad'
import keyboard from './keyboard'

const input = {
  frame: 0,
  keys: {},
  isKeyPressed (code) {
    return this.keys[code] && this.keys[code].pressed
  },
  isKeyDown (code) {
    return this.keys[code] && this.keys[code].frameDown === this.frame
  },
  isKeyUp (code) {
    return this.keys[code] && this.keys[code].frameUp === this.frame
  },
  getPressedKeys () {
    let pressedKeys = []
    for (let code in this.keys) {
      if (this.keys[code].pressed) {
        pressedKeys.push(this.keys[code])
      }
    }
    return pressedKeys
  },
  updateState (frame) {
    this.frame = frame
    gamepad.updateState(frame)
    keyboard.updateState(frame)
    this.keys = {
      ...gamepad.state.keys,
      ...keyboard.state.keys
    }
  }
}

function gameloop (frame) {
  input.updateState(frame)
  window.dispatchEvent(new Event('gameloop'))
  requestAnimationFrame(gameloop)
}
requestAnimationFrame(gameloop)

export default {
  input
}
