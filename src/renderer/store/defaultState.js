const rows = '01234567'
const cols = '0123456789ABCDEF'
const dungeon_template = `
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
-.-.-.-.-.-.-.-
R|R|R|R|R|R|R|R
`

function getDefaultState () {
  const state = {
    overworld: {},
    activeLevel: 9,
    activeQuest: 1,
    mixQuest: false,
    overworldItems: {
      whiteSword: { id: 0 },
      coast: { id: 0 },
      armos: { id: 0 },
    },
    maps: {},
    levels: {}
  }

  // populate default overworld markers
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < cols.length; c++) {
      state.overworld[rows[r] + cols[c]] = { marker: 'default' }
    }
  }

  // populate default level states
  for (let level = 1; level <= 9; level++) {
    state.levels[level] = {
      triforce: { collected: false },
      heart: { collected: false },
      items: [{ id: 0 }, { id: 0 }]
    }

    let map = dungeon_template.trim().split(/\r?\n/).map(x => x.split(''))
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        let obj = { r: i, c: j, marker: 'default' }
        switch (map[i][j]) {
          case '.':
            obj.type = 'spacer'
            break
          case '-':
            obj.type = 'wall-h'
            break
          case '|':
            obj.type = 'wall-v'
            break
          case 'R':
            obj.type = 'room'
            break
        }
        map[i][j] = obj
      }
    }
    state.maps[level] = map
  }

  return state
}

export {
  getDefaultState
}