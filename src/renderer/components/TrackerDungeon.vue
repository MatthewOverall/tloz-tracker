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
        .letter {{activeLevel}}
      .flex(v-for="(row, r) in activeMap")
        .flex(v-for="(cell, c) in row" :class="[cell.type, {selected:selected.r === cell.r && selected.c === cell.c}, cell.marker, {overlay:cell.type ==='room' && overlay.map[r/2][c/2] == 'X'}]" @click="cycle(cell, 1)" @click.right.prevent="cycle(cell,-1)")
          div(v-if="cell.type==='room'" ) {{roomMarkers[cell.marker].text}}
    .flex.column.ml-10
      .level-select
        .flex(v-for="level in levelIds")
          .btn.mt-5(@click="selectLevel(level)" :class="{active:level == activeLevel}") level-{{level}}
      .flex.mt-10 
        span Overlay Dungeon
        .btn.btn-xs.ml-5(@click="overlayQuest2 = !overlayQuest2" :class="{active:overlayQuest2}") 2nd Quest
      .overlay-select.mt-10
        div Lvl
        .flex(v-for="level in levelIds")
          .btn.btn-xs.mh-2(@click="overlayDungeon = level" :class="{active:level == overlayDungeon}") {{level}}
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
      'activeMap',
    ]),
    ...mapState({
      roomMarkers: state => state.Main.roomMarkers,
      wallMarkers: state => state.Main.wallMarkers,
      inputmap: state => state.Input.inputmap,
      dungeons: state => state.Main.dungeons,
      levelIds: state => state.Main.levelIds,
      activeLevel: state => state.Main.tracker.activeLevel,
      maps: state => state.Main.tracker.maps
    }),
    overlay () {
      let q = this.overlayQuest2 ? this.dungeons.quest2 : this.dungeons.quest1
      return q[this.overlayDungeon]
    }
  },
  data () {
    return {
      selected,
      overlayDungeon: 1,
      overlayQuest2: false
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
      let row = this.activeMap[r]
      if (!row) return undefined
      return row[c]
    },
    gameloop () {
      this.handleSelectorMovement()
      this.handleMarkerInput()
    },
    handleMarkerInput () {
      let { r, c } = this.selected
      let room = this.getCell(r, c)
      if (this.isBindingDown('cycle-wall-left')) {
        let wall = this.getCell(r, c - 1)
        if (wall) {
          this.cycleWall(wall, 1)
          if (room.marker === 'default') {
            this.cycleRoom(room, 1)
          }
        }
      }
      if (this.isBindingDown('cycle-wall-right')) {
        let wall = this.getCell(r, c + 1)
        if (wall) {
          this.cycleWall(wall, 1)
          if (room.marker === 'default') {
            this.cycleRoom(room, 1)
          }
        }
      }
      if (this.isBindingDown('cycle-wall-up')) {
        let wall = this.getCell(r - 1, c)
        if (wall) {
          this.cycleWall(wall, 1)
          if (room.marker === 'default') {
            this.cycleRoom(room, 1)
          }
        }
      }
      if (this.isBindingDown('cycle-wall-down')) {
        let wall = this.getCell(r + 1, c)
        if (wall) {
          this.cycleWall(wall, 1)
          if (room.marker === 'default') {
            this.cycleRoom(room, 1)
          }
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
  &.overlay
    background-color: #033859
  &.selected
    border: 2px solid magenta
  &.checked
    background-color: white
  &.interest
    background-color: white
  &.boss
    background-color: green
  &.triforce
    background-color: orange
  &.stair-1,
  &.stair-2,
  &.stair-3,
  &.stair-4,
  &.stair-5,
  &.stair-6,
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
  top: 30px

.level-select
  display: flex
  flex-direction: column

.overlay-select
  display: flex
  flex-wrap: wrap
</style>

