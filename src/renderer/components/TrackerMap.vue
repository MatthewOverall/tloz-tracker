<template lang="pug">
.flex.column
  .map(v-bind:class="{'show-area':showArea}")
    .map-row(v-for="row in rows")
      .map-cell(
          v-bind:id="row+col" 
          v-for="col in cols" 
          v-bind:class="{selected:selectedCell == row+col}"
          v-on:mouseenter = "selectedCell = row+col"
          @click="cycleMarker(tiles[row+col], 1, $event)"
          @click.right="cycleMarker(tiles[row+col],-1, $event)"
        )
        img(v-bind:src="`./static/map/${row+col}.png`")
        .cell-cover(v-bind:class="tiles[row+col].area")
        tile-marker(:tile-id="row+col")
  .toolbar.flex.mt-10.ml-5.mr-5
    .level(v-for="l in levels")
      .triforce-heart(:class="'level-'+l.level")
        .triangle(@click="toggle(l.triforce)" :class="{on:l.triforce.collected}")
          | {{l.level}}
        .heart(@click="toggle(l.heart)" :class="{on:l.heart.collected}")
      .item-box(v-for="item in l.items" @click="cycleItem(item)" @click.right.prevent="cycleItem(item,-1)")
        .item(:class="items[item.id]")
    .overworld-items
      .overworld-item
        .item-box
          .item(:class="items[oi.armos.id]" @click="cycleItem(oi.armos)" @click.right.prevent="cycleItem(oi.armos,-1)")
        .item-label A
      .overworld-item
        .item-box
          .item(:class="items[oi.whiteSword.id]" @click="cycleItem(oi.whiteSword)" @click.right.prevent="cycleItem(oi.whiteSword,-1)")
        .item-label WS
      .overworld-item
        .item-box
          .item(:class="items[oi.coast.id]" @click="cycleItem(oi.coast)" @click.right.prevent="cycleItem(oi.coast,-1)")
        .item-label C
    .spacer
    .btn.btn-sm.mr-5(@click="resetAll") RESET
    .btn.btn-sm.mr-5(@click="load") LOAD
    .btn.btn-sm.mr-5(@click="save") SAVE
    .spacer
    .flex.column
      .btn.btn-sm(@click="showArea = !showArea" :class="{active:showArea}") AREA
      router-link.btn.btn-sm.mt-5(to="input") CONFIG
      router-link.btn.btn-sm.mt-5(to="dungeon") DUNGEONS
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { createWriteStream } from 'fs';
import TileMarker from './TileMarker'


export default {
  name: 'TrackerMap',
  components: { TileMarker },
  computed: {
    ...mapState({
      tiles: state => state.tracker.tiles,
      levels: state => state.tracker.levels,
      items: state => state.items,
      oi: state => state.tracker.overworldItems,
      markers: state => state.markers,
      inputmap: state => state.inputmap
    }),
    ...mapGetters([
      'getMarkersByGroup',
      'isBindingUp',
      'isBindingDown',
      'isBindingPressed'
    ]),
    selectedTile () { return this.tiles[this.selectedCell] }
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
    toggle (item) {
      this.$store.commit("TOGGLE_COLLECTED", item)
    },
    cycleItem (item, amount) {
      let nextId = item.id + (amount || 1)
      if (nextId >= this.items.length) nextId = 0
      if (nextId < 0) nextId = this.items.length - 1
      this.$store.commit("SET_ITEM_MARKER", { item: item, markerId: nextId })
    },
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
      }
      Object.keys(this.markers).forEach(m => {
        if (this.isBindingDown(m)) {
          this.selectedTile.marker = m
        }
      })
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
  .level
    display: flex
    flex-direction: column
    margin: 0 2px
  .triforce-heart
    display: flex
    flex-direction: column
    &.level-9
      opacity: 0
    &.compact
      flex-direction: row
      .heart
        font-size: 1.1em
        left: -7px
        height: 0
        width: 0
  .triangle
    clip-path: polygon(50% 0, 0 100%, 100% 100%)
    background-color: grey
    width: 28px
    height: 26px
    display: flex
    flex-direction: column-reverse
    align-items: center
    color: #2e2e2e
    font-size: 1.5em
    line-height: .8em
    font-weight: bold
    z-index: 1
    &.on
      background-color: orange
      color: white
      text-shadow: 2px 1px 0px #282828
  .heart
    font-size: 1.8em
    position: relative
    height: 28px
    &.on
      &:before
        color: red
        display: inline
        opacity: 1
      &:after
        color: white
    &:before
      content: "\F004"
      font-family: FontAwesome
      position: absolute
      opacity: 0
    &:after
      color: grey
      content: "\F08A"
      font-family: FontAwesome
      position: absolute
  .item-box
    margin-top: 2px
    border: 2px solid grey
    height: 28px
    width: 28px
    border-radius: 4px
    display: flex
    align-items: center
    justify-content: center
  .overworld-item
    display: flex
    flex-direction: row-reverse
    align-items: center
  .item-label
    color: white
    font-size: 1.5em
    margin: 0 5px
  .item
    height: 20px
    width: 20px
    background-image: url('../../../static/items/sprites-items.gif')
    background-repeat: no-repeat
    background-position: 100px 100px
    &.boomerang
       background-position: -278px 1px
    &.bow
       background-position: -317px 2px
    &.blue-boomerang
       background-position: -119px -77px
    &.raft
       background-position: -318px -78px
    &.stepladder
       background-position: -318px -38px
    &.recorder
       background-position: -358px -78px
    &.wand
       background-position: -198px -78px
    &.red-candle
       background-position: -78px -118px
    &.book
       background-position: -238px 2px
    &.magic-key
       background-position: -158px -78px
    &.silvers
       background-position: -38px -118px
    &.red-ring
       background-position: -118px -118px
    &.white-sword
       background-position: -358px -118px
    &.power-bracelet
       background-position: -278px -78px
    &.heart-container
       background-position: -237px -37px
</style>
