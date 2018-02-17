<template lang="pug">
.flex.column
  .map(v-bind:class="{'show-area':showArea}")
    .map-row(v-for="row in rows")
      .map-cell(
          v-bind:id="row+col" 
          v-for="col in cols" 
          v-bind:class="{selected:selectedCell == row+col}"
          v-on:mouseenter = "selectedCell = row+col"
          @click="cycleMarker(tileMarkers[row+col], 1, $event)"
          @click.right="cycleMarker(tileMarkers[row+col],-1, $event)"
        )
        img(v-bind:src="`./static/map/${row+col}.png`")
        .cell-cover(v-bind:class="tiles[row+col].area")
        tile-marker(:tile-id="row+col")
  .toolbar.flex.mt-10.ml-5.mr-5
    tracker-items
    .spacer
    .flex-column
      .btn.btn-sm(@click="resetAll") RESET
      .btn.btn-sm.mt-5(@click="load") LOAD
      .btn.btn-sm.mt-5(@click="save") SAVE
    .spacer
    .flex.column
      .btn.btn-sm(@click="changeQuest" :class="{active:$store.state.Main.tracker.activeQuest === 2}") 2nd Quest
      .btn.btn-sm.mt-5(@click="mixQuest" :class="{active:$store.state.Main.tracker.mixQuest}") Mix Quest
    .spacer
    .flex.column
      .btn.btn-sm(@click="showArea = !showArea" :class="{active:showArea}") AREA
      router-link.btn.btn-sm.mt-5(to="input") CONFIG
      router-link.btn.btn-sm.mt-5(to="dungeon") DUNGEONS
      //router-link.btn.btn-sm.mt-5(to="gamepad") Gamepad
      //.btn.btn-sm.mt-5 GAMEPAD
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { createWriteStream } from 'fs';
import TileMarker from './TileMarker'
import TrackerItems from './TrackerItems'
//import GamepadViewer from '../../Game/GamepadViewer'


export default {
  name: 'TrackerMap',
  components: { TileMarker, TrackerItems },
  computed: {
    ...mapState({
      tileMarkers: state => state.Main.tracker.overworld,
      markers: state => state.Main.markers.overworld,
      inputmap: state => state.Input.inputmap
    }),
    ...mapGetters([
      'getMarkersByGroup',
      'isBindingUp',
      'isBindingDown',
      'isBindingPressed',
      'tiles'
    ]),
    selectedTile () { return this.tileMarkers[this.selectedCell] }
  },
  data () {
    return {
      rows: "01234567",
      cols: "0123456789ABCDEF",
      selectedCell: "00",
      showArea: false
    }
  },
  mounted () {
  },
  methods: {
    cycleMarker (tile, amount, e) {
      e.preventDefault()
      let keys = Object.keys(this.markers)
      let nextIndex = keys.indexOf(tile.marker) + (amount || 1)
      if (nextIndex >= keys.length) nextIndex = 0
      if (nextIndex < 0) nextIndex = keys.length - 1
      this.$store.commit("SET_TILE_MARKER", { tile, marker: keys[nextIndex] })
    },
    cycleGroup (group) {
      let markers = Object.keys(this.getMarkersByGroup(group))
      let next = markers.indexOf(this.selectedTile.marker) + 1
      if (next >= markers.length) next = 0
      this.$store.commit("SET_TILE_MARKER", { tile: this.selectedTile, marker: markers[next] })
    },
    clearMarker () {
      if (this.selectedTile.marker === 'default') {
        this.$store.commit("SET_TILE_MARKER", { tile: this.selectedTile, marker: 'clear-marker' })
      }
      else {
        this.$store.commit("SET_TILE_MARKER", { tile: this.selectedTile, marker: 'default' })
      }
    },
    changeQuest () {
      this.$store.commit('CHANGE_QUEST')
    },
    mixQuest () {
      this.$store.commit('MIX_QUEST')
    },
    gameloop () {
      this.handleSelectorMovement()
      this.handleMarkerInput()
    },
    handleSelectorMovement () {
      if (this.isBindingDown('selector-up')) {
        this.moveSelector(-16)
      }
      if (this.isBindingDown('selector-down')) {
        this.moveSelector(16)
      }
      if (this.isBindingDown('selector-left')) {
        this.moveSelector(-1)
      }
      if (this.isBindingDown('selector-right')) {
        this.moveSelector(1)
      }
    },
    handleMarkerInput () {
      if (this.isBindingDown('cycle-level')) {
        this.cycleGroup('dungeon')
      }
      if (this.isBindingDown('cycle-shop')) {
        this.cycleGroup('shop')
      }
      if (this.isBindingDown('cycle-misc')) {
        this.cycleGroup('misc')
      }
      if (this.isBindingDown('cycle-warp')) {
        this.cycleGroup('warp')
      }
      if (this.isBindingDown('clear-marker')) {
        this.clearMarker()
      } else {
        Object.keys(this.markers).forEach(m => {
          if (this.isBindingDown(m)) {
            this.$store.commit("SET_TILE_MARKER", { tile: this.selectedTile, marker: m })
          }
        })
      }
    },
    moveSelector (amount) {
      let nextCell = (parseInt(this.selectedCell, 16) + amount)
      if (nextCell < 0 || nextCell >= 8 * 16) nextCell = this.selectedCell
      this.selectedCell = nextCell.toString(16).toUpperCase().padStart(2, "0")
    },
    resetAll () {
      this.$store.dispatch('RESET_ALL')
    },
    load () {
      this.$store.dispatch('LOAD')
    },
    save () {
      this.$store.dispatch('SAVE')
    }
  }
}
</script>

<style lang="sass" scoped="true">
  .spacer
    flex: 1
  .map
    display: flex
    flex-direction: column
    &.show-area
      .cell-cover
        &.death-mountain
          background-color: rgba(144, 106, 0, 0.5)
        &.coast
          background-color: rgba(178, 230, 255, 0.47)
        &.dead-woods
          background-color: rgba(168, 0, 0, 0.5)
        &.desert
          background-color: rgba(251, 255, 24, 0.5)
        &.forest
          background-color: rgba(8, 133, 0, 0.5)
        &.grave
          background-color: rgba(117, 171, 209, 0.5)
        &.lake
          background-color: rgba(0, 231, 242, 0.55)
        &.lost-hills
          background-color: rgba(144, 106, 0, 0.5)
        &.river
          background-color: rgba(28, 17, 199, 0.5)
        &.start
          background-color: rgba(240, 68, 235, 0.5)
  .map-row
    display: flex
    flex-direction: row
  .map-cell
    position: relative
    img
      width: 100%
      display: block
      opacity: 0.5
    &.selected
      .cell-cover
        //background-color: rgba(255,255,255,.8)
        border: 4px solid magenta
        //animation: glow 400ms ease-out infinite alternate
    // &:hover
    //   .cell-cover
    //     border: 1px solid white
    //     background-color: rgba(255,255,255,.3)
    .cell-cover
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      z-index: 2
    .marker
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      z-index: 1
  @keyframes glow 
      0% 
        border-color: magenta
        box-shadow: 0 0 5px rgba(0,255,0,.2), inset 0 0 5px rgba(0,255,0,.1), 0 2px 0 #000;
      // 50% 
      //   border-color: red
      //   box-shadow: 0 0 20px rgba(0,255,0,.6), inset 0 0 10px rgba(0,255,0,.4), 0 2px 0 #000;
        //background-color: blue
      100% 
        border-color: white
        box-shadow: 0 0 5px rgba(0,255,0,.2), inset 0 0 5px rgba(0,255,0,.1), 0 2px 0 #000;
  .toolbar
    align-items: flex-start
</style>
