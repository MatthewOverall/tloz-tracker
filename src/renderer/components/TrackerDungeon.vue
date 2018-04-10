<template lang="pug">
div
  router-link.esc.flex.column.align-center(to="/")
    .fa.fa-times-circle-o.fa-lg
    div ESC
  .flex.dungeon-tracker
    .flex.column.dungeon-map
      .flex
        .letter L
        .letter E
        .letter V
        .letter E
        .letter L
        .letter -
        .letter {{activeLevel}}
      .flex(v-for="(row, r) in activeMap")
        .flex(v-for="(cell, c) in row" :class="[cell.type, {selected:selected.r === cell.r && selected.c === cell.c}, cell.marker, {overlay:overlayDungeon && cell.type ==='room' && overlay.map[r/2][c/2] == 'X'}]" @click="cycle(cell, 1)" @click.right.prevent="cycle(cell,-1)")
          div(v-if="cell.type==='room'" ) {{roomMarkers[cell.marker].text}}
    .flex.column.ml-10
      .flex.row
        .flex.level-select
            .flex(v-for="level in levelIds")
              .btn.mt-5(@click="selectLevel(level)" :class="{active:level == activeLevel}") level-{{level}}
        .flex.tracker-items.ml-20.mt-5
            tracker-items
      .flex.mt-10
        span Overlay Dungeon
        .btn.btn-xs.ml-5(@click="overlayQuest2 = !overlayQuest2" :class="{active:overlayQuest2}") 2nd Quest
      .overlay-select.mt-10
        div Lvl
        .flex(v-for="level in levelIds")
          .btn.btn-xs.mh-2(@click="setOverlay(level)" :class="{active:level == overlayDungeon}") {{level}}
</template>

<script>
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
import TrackerItems from './TrackerItems'
import router from '../router'

let selected = { r: 14, c: 12 }
export default {
  components: { TrackerItems },
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
      if (!this.overlayDungeon) return []
      let q = this.overlayQuest2 ? this.dungeons.quest2 : this.dungeons.quest1
      return q[this.overlayDungeon]
    }
  },
  data () {
    return {
      selected,
      overlayDungeon: 0,
      overlayQuest2: false
    }
  },
  methods: {
    setOverlay (level) {
      if (this.overlayDungeon == level) {
        this.overlayDungeon = 0
      } else {
        this.overlayDungeon = level
      }
    },
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
      this.handleDungeonSelectInput()
      this.handleRouteInput()
    },
    handleDungeonSelectInput () {
      if (this.isBindingDown('global', 'level-1')) {
        this.selectLevel(1)
      }
      if (this.isBindingDown('global', 'level-2')) {
        this.selectLevel(2)
      }
      if (this.isBindingDown('global', 'level-3')) {
        this.selectLevel(3)
      }
      if (this.isBindingDown('global', 'level-4')) {
        this.selectLevel(4)
      }
      if (this.isBindingDown('global', 'level-5')) {
        this.selectLevel(5)
      }
      if (this.isBindingDown('global', 'level-6')) {
        this.selectLevel(6)
      }
      if (this.isBindingDown('global', 'level-7')) {
        this.selectLevel(7)
      }
      if (this.isBindingDown('global', 'level-8')) {
        this.selectLevel(8)
      }
      if (this.isBindingDown('global', 'level-9')) {
        this.selectLevel(9)
      }
    },
    handleMarkerInput () {
      let { r, c } = this.selected
      let room = this.getCell(r, c)
      if (this.isBindingDown('dungeon', 'cycle-wall-left')) {
        let wall = this.getCell(r, c - 1)
        if (wall) {
          this.cycleWall(wall, 1)
          if (room.marker === 'default') {
            this.cycleRoom(room, 1)
          }
        }
      }
      if (this.isBindingDown('dungeon', 'cycle-wall-right')) {
        let wall = this.getCell(r, c + 1)
        if (wall) {
          this.cycleWall(wall, 1)
          if (room.marker === 'default') {
            this.cycleRoom(room, 1)
          }
        }
      }
      if (this.isBindingDown('dungeon', 'cycle-wall-up')) {
        let wall = this.getCell(r - 1, c)
        if (wall) {
          this.cycleWall(wall, 1)
          if (room.marker === 'default') {
            this.cycleRoom(room, 1)
          }
        }
      }
      if (this.isBindingDown('dungeon', 'cycle-wall-down')) {
        let wall = this.getCell(r + 1, c)
        if (wall) {
          this.cycleWall(wall, 1)
          if (room.marker === 'default') {
            this.cycleRoom(room, 1)
          }
        }
      }
      if (this.isBindingDown('dungeon', 'cycle-room-up')) {
        let room = this.getCell(r, c)
        this.cycleRoom(room, 1)
      } else if (this.isBindingDown('dungeon', 'cycle-room-down')) {
        let room = this.getCell(r, c)
        this.cycleRoom(room, -1)
      }
    },
    handleSelectorMovement () {
      if (this.isBindingDown('global', 'selector-up')) {
        this.selected.r = Math.max(0, this.selected.r - 2)
      }
      if (this.isBindingDown('global', 'selector-down')) {
        this.selected.r = Math.min(14, this.selected.r + 2)
      }
      if (this.isBindingDown('global', 'selector-left')) {
        this.selected.c = Math.max(0, this.selected.c - 2)
      }
      if (this.isBindingDown('global', 'selector-right')) {
        this.selected.c = Math.min(14, this.selected.c + 2)
      }
    },
    handleRouteInput () {
      if (this.isBindingDown('global', 'dungeon-map-toggle')) {
        router.push('/')
      }
    },
    selectLevel (level) {
      this.$store.commit('SET_ACTIVE_LEVEL', level)
    }
  }
}
</script>

<style lang="sass">
.dungeon-tracker .tracker-items .overworld-items,
.dungeon-tracker .tracker-items .level
  display: none
  &.active
    display: inherit
.dungeon-tracker .tracker-items .triangle
  color: transparent !important
  text-shadow: none !important

.dungeon-tracker 
  .items-box
    display: none !important
</style>

<style lang="sass" scoped="true">
$min: 2.3vh
$max: 8.5vh
$borderColor: grey

.dungeon-map
  background-color: #1f202c

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
