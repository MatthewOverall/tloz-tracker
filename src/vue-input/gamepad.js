const controllers = []

function addgamepad (gamepad) {
  console.log('gamepad added', gamepad)
  controllers[gamepad.index] = gamepad
}

function removegamepad (gamepad) {
  delete controllers[gamepad.index]
}

function updateStatus () {
  scangamepads()
  for (let j in controllers) {
    let controller = controllers[j]
    for (let i = 0; i < controller.buttons.length; i++) {
      var val = controller.buttons[i]
      var pressed = val == 1.0
      if (typeof (val) == 'object') {
        pressed = val.pressed
        val = val.value
      }
      var pct = Math.round(val * 100) + '%'
      if (pressed) {
        console.log(`button ${i} pressed`)
      }
    }
    for (let i = 0; i < controller.axes.length; i++) {
      // console.log(controller.axes[i])
    }
  }
  requestAnimationFrame(updateStatus)
}
requestAnimationFrame(updateStatus)

function scangamepads () {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }
}

window.addEventListener("gamepadconnected", e => addgamepad(e.gamepad));
window.addEventListener("gamepaddisconnected", e => removegamepad(e.gamepad));