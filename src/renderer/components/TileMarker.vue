<template lang="pug">
.marker
  .tile-icon(v-if="tile && tileMarker && tileMarker.marker === 'default'" v-show="tile.type" :class="tile.type")
  .marker-icon(v-if="tileMarker.marker !== 'default'" :class="[marker.group, tileMarker.marker, markerState]")
    .marker-text {{marker.text}}
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  props: ['tileId'],
  computed: {
    tile () {
      return this.tiles[this.tileId]
    },
    marker () {
      return this.markers[this.tileMarker.marker]
    },
    markerState () {
      let currentMarker = this.markers[this.tileMarker.marker];
      switch(currentMarker.group) {
        case 'dungeon':
          if (this.levels[currentMarker.level].triforce.collected) {
            return 'triforce-collected'
          }
        break
      }
      return ''
    },
    tileMarker () {
      return this.tileMarkers[this.tileId]
    },
    ...mapState({
      markers: state => state.Main.markers.overworld,
      levels: state => state.Main.tracker.levels,
      tileMarkers: state => state.Main.tracker.overworld
    }),
    ...mapGetters([
      'tiles'
    ])
  },
  data () {
    return {

    }
  },
  mounted () {

  }
}
</script>

<style lang="sass">
.marker
  display: flex
  align-items: center
  justify-content: center
  .marker-icon
    height: 100%
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    border: 2px solid black
    box-shadow: 2px 2px 4px black
    .marker-text
      color: white
      font-size: 4vw
    &.clear
      height: 60%
      width: 40%
      background-color: gray
      opacity: .4
    &.dungeon
      border-color: rgba(0, 0, 0, 1)
      background-color: red
      &.triforce-collected
        background-color: rgba(175, 175, 175, 0.75)
        .marker-text
          color: rgba(150, 0, 0, 1)
    &.misc
      height: 90%
      width: 90%
      border-color: rgba(240, 248, 255, 0.75)
      background-color: rgba(255, 101, 215, 0.58)
    &.shop
      height: 90%
      width: 90%
      background-color: rgba(5, 93, 185, 0.58)
      border-color: rgba(240, 248, 255, 0.75)
.tile-icon
  height: 60%
  width: 40%
  border: 2px solid black
  box-shadow: 2px 2px 4px black
  &.raft
    background-color: brown
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
</style>