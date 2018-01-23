<template lang="pug">
.config-screen(:class="{'show-binding-overlay':isBinding}")
  .input-mapper
    h2 Input Mapper
    router-link.esc.flex.column.align-center(to="/")
      .fa.fa-times-circle-o.fa-lg
      div ESC
    div 
      p Dungeons
      .marker-input-map
        .marker
          .marker-icon.level-1.dungeon
            .marker-text L1
        .keybind(@click="bindkey('level-1')")
          | x
  .binding-overlay(v-if="isBinding")
    p Press any key, esc to cancel
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['tileId'],
  computed: {
    ...mapState({
      markers: state => state.markers
    }),
  },
  data () {
    return {
      isBinding: false
    }
  },
  mounted () {

  }
}
</script>

<style lang="sass" scoped>
.config-screen
  font-family: 'Rubik', sans-serif
  &.show-binding-overlay
    .input-mapper
      opacity: .2
.esc
  position: fixed
  right: 25px
  top: 10px

.binding-overlay
  position: fixed
  top: 0
  bottom: 0
  right: 0
  left: 0
  background-color: #2f9aac
  border-radius: 10px
  margin: 10%
  display: flex
  align-items: center
  justify-content: space-around

.keybind
  background-color: gray
  border: 1px solid black
  border-radius: 4px
  text-align: center
  width: 50px
  cursor: pointer
.marker-input-map
  display: flex
  flex-direction: column
  width: fit-content
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
    &.clear
      display: none
    .marker-text
      color: white
      font-size: 2em
    &.dungeon
      border-color: rgba(0, 0, 0, 1)
      background-color: red
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
</style>