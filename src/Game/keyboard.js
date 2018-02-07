let queue = []

const state = {
  time: 0,
  keys: {},
}

function updateState (time) {
  state.time = time
  while (queue.length > 0) {
    let e = queue.shift()
    let key = state.keys[e.code] = (state.keys[e.code] || {
      keyCode: e.keyCode,
      code: e.code,
      pressed: false,
    })
    if (e.type === 'keydown') {
      key.pressed = true
      key.time = 0
      key.timeDown = key.timeDown || time
    } else {
      key.timeUp = time
      key.pressed = false
      key.timeDown = 0
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