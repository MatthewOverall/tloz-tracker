<template lang="pug">
.flex.column
  .map(v-bind:class="{'show-area':showArea}")
    .map-row(v-for="row in rows")
      .map-cell(
          v-bind:id="row+col" 
          v-for="col in cols" 
          v-bind:class="{selected:selectedCell == row+col}"
          @click="selectedCell = row+col"
        ) 
        img(v-bind:src="`./static/map/${row+col}.png`")
        .cell-cover(v-bind:class="tiles[row+col].area")
        .icon(v-if="tiles[row+col]" v-show="tiles[row+col].type" :class="tiles[row+col].type") 
  .toolbar.flex
    div
      .toggle(@click="showArea = !showArea" :class="{on:showArea}") AREA
    .level(v-for="l in levels")
      .triforce-heart.compact
        .triangle(@click="l.triforceCollected = !l.triforceCollected" :class="{on:l.triforceCollected}")
          | {{l.level}}
        .heart(@click="l.heartCollected = !l.heartCollected" :class="{on:l.heartCollected}")
      .item-box(v-for="i in l.items")
        .item
          | {{l.item}}
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TrackerMap',
  computed: mapState({
    tiles: state => state.tiles,
    levels: state => state.tracker.levels
  }),
  data () {
    return {
      rows: "01234567",
      cols: "0123456789ABCDEF",
      selectedCell: "00",
      showArea: false
    }
  }
}
</script>

<style lang="sass">
  .flex
    display: flex
    &.column
      flex-direction: column
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
        border: 4px solid white
        animation: glow 400ms ease-out infinite alternate
    &:hover
      .cell-cover
        border: 4px solid white
        background-color: rgba(255,255,255,.3)
    .cell-cover
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0

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
  .icon
    height: 60%
    width: 40%
    margin: auto
    border: 2px solid black
    box-shadow: 2px 2px 4px
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 1
    &.raft
     background-color: red
    &.recorder
      background-color: red
    &.bracelet
      background-color: magenta
    &.cave
      background-color: yellow
    &.tree
      background-color: lime
    &.bomb
      background-color: #44c9f1

  .toggle
    border: 3px solid gray
    color: gray
    display: inline-block
    padding: 2px
    text-align: center
    &.on
      color: white
      border: 3px solid white

  .level
    display: flex
    flex-direction: column
    margin: 0 2px
  .triforce-heart
    display: flex
    flex-direction: column
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
    height: 24px
    width: 24px
    border-radius: 4px
</style>
