import gamepad from './gamepad'
import keyboard from './keyboard'

const state = {
  frame: 0
}

const input = {
  time: 0,
  keys: {},
  gamepads: gamepad.state.gamepads,
  isKeyPressed (code) {

    return this.keys[code] && this.keys[code].pressed
      || this.gamepads.some(x => x.state[code] && x.state[code].pressed)
  },
  isKeyDown (code) {
    return this.keys[code] && this.keys[code].timeDown === this.time
      || this.gamepads.some(x => x.state[code] && x.state[code].timeDown === this.time)
  },
  isKeyUp (code) {
    return this.keys[code] && this.keys[code].timeUp === this.time
      || this.gamepads.some(x => x.state[code] && x.state[code].timeUp === this.time)
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
  updateState (time) {
    this.time = time
    gamepad.updateState(time)
    keyboard.updateState(time)
    this.keys = {
      //...gamepad.state.keys,
      ...keyboard.state.keys
    }
  }
}

function gameloop (time) {
  input.updateState(time)
  state.frame += 1
  window.dispatchEvent(new Event('gameloop'))
  requestAnimationFrame(gameloop)

}
requestAnimationFrame(gameloop)

export default {
  input,
  state
}
