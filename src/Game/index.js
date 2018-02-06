import gamepad from './gamepad'
import keyboard from './keyboard'

const input = {
  frame: 0,
  keys: {},
  gamepads: gamepad.state.gamepads,
  isKeyPressed (code) {

    return this.keys[code] && this.keys[code].pressed
      || this.gamepads.some(x => x.state[code] && x.state[code].pressed)
  },
  isKeyDown (code) {
    return this.keys[code] && this.keys[code].frameDown === this.frame
      || this.gamepads.some(x => x.state[code] && x.state[code].frameDown === this.frame)
  },
  isKeyUp (code) {
    return this.keys[code] && this.keys[code].frameUp === this.frame
      || this.gamepads.some(x => x.state[code] && x.state[code].frameUp === this.frame)
  },
  getPressedKeys () {
    let pressedKeys = []
    for (let code in this.keys) {
      if (this.keys[code].pressed) {
        pressedKeys.push(this.keys[code])
      }
    }
    this.gamepads.forEach(g => {
      for (let code in g.state) {
        if (g.state[code].pressed) {
          pressedKeys.push(g.state[code])
        }
      }
    })
    return pressedKeys
  },
  updateState (frame) {
    this.frame = frame
    gamepad.updateState(frame)
    keyboard.updateState(frame)
    this.keys = {
      //...gamepad.state.keys,
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
