<template lang="pug">
div
  router-link.esc.flex.column.align-center(to="/")
    .fa.fa-times-circle-o.fa-lg
    div ESC
  .flex
    .letter L
    .letter E
    .letter V
    .letter E
    .letter L
    .letter -
    .letter X
  .flex(v-for="row in layout")
    .flex(v-for="cell in row" :class="[cell.type, {selected:selected.r === cell.r && selected.c === cell.c}, cell.marker]")
      div(v-if="cell.type==='room'") {{cell.text}}
</template>

<script>
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
let map = `
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

let layout = map.trim().split(/\r?\n/).map(x => x.split(''))

for (let i = 0; i < layout.length; i++) {
  for (let j = 0; j < layout[i].length; j++) {
    let obj = { r: i, c: j, marker: '' }
    switch (layout[i][j]) {
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
    layout[i][j] = obj
  }
}
let selected = { r: 0, c: 0 }
export default {
  computed: {
    ...mapGetters([
      'isBindingUp',
      'isBindingDown',
      'isBindingPressed'
    ]),
    ...mapState({
      roomMarkers: state => state.roomMarkers,
      wallMarkers: state => state.wallMarkers,
      inputmap: state => state.inputmap
    }),
  },
  data () {
    return {
      width: 8,
      height: 8,
      layout,
      selected
    }
  },
  methods: {
    cycleWall (wall) {
      let next = this.wallMarkers.indexOf(wall.marker) + 1
      if (next >= this.wallMarkers.length) next = 0
      wall.marker = this.wallMarkers[next]
    },
    cycleRoom (room) {
      let next = this.roomMarkers.indexOf(room.marker) + 1
      if (next >= this.roomMarkers.length) next = 0
      room.marker = this.roomMarkers[next]
      if (room.marker === 'interest') {
        room.text = '?'
      }
    },
    getCell (r, c) {
      let row = this.layout[r]
      if (!row) return undefined
      return row[c]
    },
    gameloop () {
      this.handleSelectorMovement()
      this.handleMarkerInput()
    },
    handleMarkerInput () {
      let { r, c } = this.selected
      if (this.isBindingDown('cycle-wall-left')) {
        let wall = this.getCell(r, c - 1)
        if (wall) {
          this.cycleWall(wall)
        }
      }
      if (this.isBindingDown('cycle-wall-right')) {
        let wall = this.getCell(r, c + 1)
        if (wall) {
          this.cycleWall(wall)
        }
      }
      if (this.isBindingDown('cycle-wall-up')) {
        let wall = this.getCell(r - 1, c)
        if (wall) {
          this.cycleWall(wall)
        }
      }
      if (this.isBindingDown('cycle-wall-down')) {
        let wall = this.getCell(r + 1, c)
        if (wall) {
          this.cycleWall(wall)
        }
      }
      if (this.isBindingDown('cycle-room')) {
        this.cycleRoom(this.layout[r][c])
      }
    },
    handleSelectorMovement () {
      if (this.isBindingDown('selector-up')) {
        this.selected.r = Math.max(0, this.selected.r - 2)
      }
      if (this.isBindingDown('selector-down')) {
        this.selected.r = Math.min(14, this.selected.r + 2)
      }
      if (this.isBindingDown('selector-left')) {
        this.selected.c = Math.max(0, this.selected.c - 2)
      }
      if (this.isBindingDown('selector-right')) {
        this.selected.c = Math.min(14, this.selected.c + 2)
      }
    },
  }
}
</script>

<style lang="sass">
$min: 1.8vh
$max: 9vh
$borderColor: grey

.wall-h,
.wall-v
  &.open
    background-color: white
  &.blocked
    background-color: #d52020
.wall-h
  height: $min
  width: $max
  border: 1xpx solid $borderColor

.wall-v
  height: $max
  width: $min
  border: 1px solid $borderColor

.room
  height: $max
  width: $max
  color: black
  border: 1px solid $borderColor
  align-items: center
  justify-content: space-around
  font-size: 1em
  &.selected
    //background-color: white
    border: 2px solid magenta
  &.checked
    background-color: white
  &.interest
    background-color: white
.spacer
  height: $min
  width: $min
  border: 1px solid $borderColor
  background-color: $borderColor

.letter
  width: $max + $min
  text-align: center
  font-size: 2vw
  padding-right: $min
.esc
  position: fixed
  right: 25px
  top: 10px
</style>

