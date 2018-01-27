let queue = []

const state = {
  frame: 0,
  keys: {},
}

function updateState (frame) {
  state.frame = frame
  while (queue.length > 0) {
    let e = queue.shift()
    let key = state.keys[e.code] = (state.keys[e.code] || {
      keyCode: e.keyCode,
      code: e.code,
      pressed: false,
    })
    if (e.type === 'keydown') {
      key.pressed = true
      key.frame = 0
      key.frameDown = key.frameDown || frame
    } else {
      key.frameUp = frame
      key.pressed = false
      key.frameDown = 0
    }
  }
}

window.onkeydown = (e) => {
  queue.push(e)
}

window.onkeyup = (e) => {
  queue.push(e)
}

export default {
  state,
  updateState
}