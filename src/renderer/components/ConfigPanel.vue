<template lang="pug">
.config-screen
  .input-mapper
    h2 Input Mapper
    router-link.esc.flex.column.align-center(to="/")
      .fa.fa-times-circle-o.fa-lg
      div ESC
  tabs
    tab(name="Global")
      global-input
    tab(name="Overworld")
      overworld-input
    tab(name="Dungeon")
      dungeon-input
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import GlobalInput from './config/GlobalInput'
import OverworldInput from './config/OverworldInput'
import DungeonInput from './config/DungeonInput'

export default {
  props: ['tileId'],
  components: {
    GlobalInput,
    OverworldInput,
    DungeonInput
  },
}
</script>

<style lang="sass">
/* This CSS is to handle tabbed panels, should be moved elsewhere
.tabs-component
  margin: 10px 0

.tabs-component-tabs
  border: solid 1px #ddd
  border-radius: 6px
  margin-bottom: 5px

@media (min-width: 400px)
  .tabs-component-tabs
    border: 0
    align-items: stretch
    display: flex
    justify-content: flex-start
    margin-bottom: -1px

.tabs-component-tab
  color: #999
  font-size: 16px
  font-weight: 600
  margin-right: 0
  list-style: none
  padding: 0 5px 0 5px
  background-color: #fff

.tabs-component-tab:not(:last-child)
  border-bottom: dotted 1px #ddd

.tabs-component-tab:hover
  color: #666

.tabs-component-tab.is-active
  color: #000

.tabs-component-tab.is-disabled *
  color: #cdcdcd
  cursor: not-allowed !important

@media (min-width: 400px)
  .tabs-component-tab
    background-color: #fff
    border: solid 1px #ddd
    border-radius: 3px 3px 0 0
    margin-right: .5em
    transform: translateY(2px)
    transition: transform .3s ease

  .tabs-component-tab.is-active
    border-bottom: solid 1px #fff
    z-index: 2
    transform: translateY(0)

  .tabs-component-panels
    padding: 10px 0
</style>
<style lang="sass" scoped>
.config-screen
  font-family: 'Rubik', sans-serif
  &.show-binding-overlay
    .input-mapper
      opacity: .2
.esc
  position: fixed
  right: 25px
  top: 30px
</style>
