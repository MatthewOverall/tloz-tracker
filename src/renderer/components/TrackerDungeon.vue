<template lang="pug">
div
  router-link.esc.flex.column.align-center(to="/")
    .fa.fa-times-circle-o.fa-lg
    div ESC
  .flex
    .flex.column
      .flex.dungeon-map
        .letter L
        .letter E
        .letter V
        .letter E
        .letter L
        .letter -
        .letter {{activeLevel.level}}
      .flex(v-for="row in activeLevel.map")
        .flex(v-for="cell in row" :class="[cell.type, {selected:selected.r === cell.r && selected.c === cell.c}, cell.marker]" @click="cycle(cell, 1)" @click.right.prevent="cycle(cell,-1)")
          div(v-if="cell.type==='room'") {{roomMarkers[cell.marker].text}}
    .level-select
      .flex(v-for="level in levels")
        .btn.mt-5(@click="selectLevel(level.level)" :class="{active:level.level === activeLevel.level}") level-{{level.level}}
</template>

<script>
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'

let selected = { r: 14, c: 12 }
export default {
  computed: {
    ...mapGetters([
      'isBindingUp',
      'isBindingDown',
      'isBindingPressed',
      'activeLevel'
    ]),
    ...mapState({
      roomMarkers: state => state.roomMarkers,
      wallMarkers: state => state.wallMarkers,
      inputmap: state => state.inputmap,
      levels: state => state.tracker.levels
    }),
  },
  data () {
    return {
      selected
    }
  },
  methods: {
    cycleWall (wall, amount) {
      let keys = Object.keys(this.wallMarkers)
      let next = keys.indexOf(wall.marker) + amount
      if (next >= keys.length) next = 0
      if (next < 0) next = keys.length - 1
      this.$store.commit('SET_TILE_MARKER', { tile: wall, marker: keys[next] })
    },
    cycleRoom (room, amount) {
      let keys = Object.keys(this.roomMarkers)
      let next = keys.indexOf(room.marker) + amount
      if (next >= keys.length) next = 0
      if (next < 0) next = keys.length - 1
      this.$store.commit('SET_TILE_MARKER', { tile: room, marker: keys[next] })
    },
    cycle (obj, amount) {
      if (obj.type == 'room') {
        this.cycleRoom(obj, amount)
      } else if (obj.type.startsWith('wall')) {
        this.cycleWall(obj, amount)
      }
    },
    getCell (r, c) {
      let row = this.activeLevel.map[r]
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
          this.cycleWall(wall, 1)
        }
      }
      if (this.isBindingDown('cycle-wall-right')) {
        let wall = this.getCell(r, c + 1)
        if (wall) {
          this.cycleWall(wall, 1)
        }
      }
      if (this.isBindingDown('cycle-wall-up')) {
        let wall = this.getCell(r - 1, c)
        if (wall) {
          this.cycleWall(wall, 1)
        }
      }
      if (this.isBindingDown('cycle-wall-down')) {
        let wall = this.getCell(r + 1, c)
        if (wall) {
          this.cycleWall(wall, 1)
        }
      }
      if (this.isBindingDown('cycle-room-up')) {
        let room = this.getCell(r, c)
        this.cycleRoom(room, 1)
      } else if (this.isBindingDown('cycle-room-down')) {
        let room = this.getCell(r, c)
        this.cycleRoom(room, -1)
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
    selectLevel (level) {
      this.$store.commit('SET_ACTIVE_LEVEL', level)
    }
  }
}
</script>

<style lang="sass" scoped="true">
$min: 2.3vh
$max: 8.5vh
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
  font-size: 5vh
  background-color: white
  &.default
    background-color: transparent
  &.selected
    //background-color: white
    border: 2px solid magenta
  &.checked
    background-color: white
  &.interest
    background-color: white
  &.boss
    background-color: green
  &.triforce
    background-color: orange
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
  top: 30px

.level-select
  display: flex
  flex-direction: column
  margin-left: 10px
</style>

