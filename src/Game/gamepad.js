
const codeMap = {
  "B0": "A",
  "B1": "B",
  "B2": "X",
  "B3": "Y",
  "B4": "LB",
  "B5": "RB",
  "B6": "LT",
  "B7": "RT",
  "B8": "Select",
  "B9": "Start",
  "B10": "LStick",
  "B11": "RStick",
  "B12": "DUp",
  "B13": "DDown",
  "B14": "DLeft",
  "B15": "DRight"
}

const state = {
  frame: 0,
  gamepads: [],
  keys: {}
}

function addgamepad (gamepad) {
  state.gamepads[gamepad.index] = gamepad
}

function removegamepad (gamepad) {
  delete state.gamepads[gamepad.index]
}

function updateState (frame) {
  scangamepads()
  state.frame = frame
  state.gamepads.forEach(g => {
    // remap all the buttons
    let buttons = g.buttons.map((b, i) => {
      return {
        code: `C${g.index}B${i}`,
        pressed: b.pressed,
        value: b.value
      }
    })
    // remap each axis to a button press
    g.axes.forEach((a, i) => {
      buttons.push({
        code: `C${g.index}A${i}P`,
        pressed: a >= .5, //todo dead zone move to var
        value: a
      })
      buttons.push({
        code: `C${g.index}A${i}N`,
        pressed: a <= -.5,
        value: a
      })
    })

    // update the current state
    buttons.forEach(b => {
      let pbs = state.keys[b.code] = (state.keys[b.code] || {
        pressed: false,
        code: b.code,
        value: 0
      })
      if (!pbs.pressed && b.pressed) {
        pbs.frameDown = frame
      }
      if (pbs.pressed && !b.pressed) {
        pbs.frameUp = frame
      }
      pbs.pressed = b.pressed
      pbs.value = b.value
    })
  })

}

function scangamepads () {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in gamepads) {
        gamepads[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }
}

window.addEventListener("gamepadconnected", e => addgamepad(e.gamepad));
window.addEventListener("gamepaddisconnected", e => removegamepad(e.gamepad));

export default {
  state,
  updateState
}