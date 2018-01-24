const gamepads = []
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
  controllers: []
}

function addgamepad (gamepad) {
  gamepads[gamepad.index] = gamepad
}

function removegamepad (gamepad) {
  delete gamepads[gamepad.index]
}

function updateStatus () {
  scangamepads()
  let events = []

  gamepads.forEach(g => {
    let gs = state.controllers[g.index] = (state.controllers[g.index] || { buttons: {} })

    // remap all the buttons
    let buttons = g.buttons.map((b, i) => {
      return {
        id: `C${g.index}B${i}`,
        pressed: b.pressed,
        value: b.value
      }
    })
    // remap each axis to a button press
    g.axes.forEach((a, i) => {
      buttons.push({
        id: `C${g.index}A${i}P`,
        pressed: a >= .4, //.6 is dead zone move to var
        value: a
      })
      buttons.push({
        id: `C${g.index}A${i}N`,
        pressed: a <= -.4,
        value: a
      })
    })
    buttons.forEach(b => {
      let pbs = gs.buttons[b.id] = (gs.buttons[b.id] || { pressed: false })
      if (pbs.pressed != b.pressed) {
        let e = {
          gamepad: g,
          pressed: b.pressed,
          value: b.value,
          code: b.id,
          type: b.pressed ? 'keydown' : 'keyup'
        }
        events.push(e)
      }
      gs.buttons[b.id] = b
    })

  })
  events.forEach(e => window.dispatchEvent(new CustomEvent('ongamepadinput', { detail: e })))
  requestAnimationFrame(updateStatus)
}
requestAnimationFrame(updateStatus)

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