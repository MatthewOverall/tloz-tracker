
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
  time: 0,
  gamepads: [],
}

function addgamepad (gamepad) {
  state.gamepads[gamepad.index] = gamepad
  gamepad.state = {}
  console.log("Gamepad added", gamepad)
}

function removegamepad (gamepad) {
  console.log("Gamepad Removed", gamepad)
  delete state.gamepads[gamepad.index]
}

function updateState (time) {
  scangamepads()

  state.time = time
  state.gamepads.forEach(g => {
    if (!g.state) g.state = {}
    // remap all the buttons
    let buttons = g.buttons.map((b, i) => {
      return {
        code: `CB${i}`,
        pressed: b.pressed,
        value: b.value
      }
    })
    // remap each axis to a button press
    g.axes.forEach((a, i) => {
      buttons.push({
        code: `CA${i}P`,
        pressed: a >= .7, //todo dead zone move to var
        value: a
      })
      buttons.push({
        code: `CA${i}N`,
        pressed: a <= -.7,
        value: a
      })
    })
    // update the current state
    buttons.forEach(b => {
      let pbs = g.state[b.code] = (g.state[b.code] || {
        pressed: false,
        code: b.code,
        value: 0
      })
      if (!pbs.pressed && b.pressed) {
        pbs.timeDown = time
      }
      if (pbs.pressed && !b.pressed) {
        pbs.timeUp = time
      }
      pbs.pressed = b.pressed
      pbs.value = b.value
    })
  })

}

function scangamepads () {
  var gamepads = navigator.getGamepads()

  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in state.gamepads) {
        state.gamepads[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }
}

export default {
  state,
  updateState
}