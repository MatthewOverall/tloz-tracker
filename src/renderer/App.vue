<template>
  <div id="app" class="theme-dark">
    <div class="tilebar">
      <div class="tilebar-spacer-left"></div>
      <div class="logo">TLOZ-TRACKER</div>
      <div class="tilebar-spacer"></div>
      <div class="tilebar-btn minimize pt-3" @click="minimize">―</div>
      <div class="tilebar-btn maximize" @click="minimize">☐</div>
      <div class="tilebar-btn close " @click="minimize">✕</div>
    </div>
    <router-view class="app-view"></router-view>
    <!-- <gamepad-viewer></gamepad-viewer> -->
  </div>
</template>

<script>
// import GamepadViewer from '../Game/GamepadViewer'

export default {
  name: 'tloz-tracker',
  // components: { GamepadViewer },
  mounted () {
  },
  methods: {
    minimize () {
      console.log("minimize")
      this.$electron.remote.BrowserWindow.getFocusedWindow().minimize()
    },
    maximize () {
      this.$electron.remote.BrowserWindow.getFocusedWindow().maximize()
    },
    close () {
      this.$electron.remote.BrowserWindow.getFocusedWindow().close()
    }
  }
}
</script>

<style lang="sass">
@import './assets/styles/main.sass'
@import url('https://fonts.googleapis.com/css?family=Share+Tech+Mono|VT323')

.gamepad
  position: fixed
  bottom: 0
  right: 30px
  transform-origin: bottom right
  z-index: 1
html
  overflow: hidden
body
  font-family: 'VT323', monospace
  font-size: 16px
  //font-family: 'Share Tech Mono', monospace
  //font-size: 12px
  &.theme-dark
    background-color: #2e2e2e
    color: white

*
  margin: 0
  padding: 0
  cursor: default
  box-sizing: border-box
  user-select: none
.app-view
  overflow-y: auto
  height: calc(100vh - 21px)

.tilebar
  height: 20px
  display: flex
  justify-content: flex-end
  background-color: #2e2e2e
  -webkit-user-select: none
  -webkit-app-region: drag
  border-bottom: 1px solid black
  &:after
    content: ''
    position: fixed
    height: 5px
    top: 0
    left: 0
    right: 0
    -webkit-app-region: no-drag
  .logo
    display: flex
    align-items: center
  .tilebar-spacer
    flex: 1
  .tilebar-spacer-left
    width: 10px
    -webkit-app-region: no-drag
  .tilebar-btn
    -webkit-app-region: no-drag
    width: 25px
    font-size: 14px
    display: flex
    justify-content: center
    cursor: pointer
    &:hover
      background-color: gray
      &.close
        background-color: red
::-webkit-scrollbar-button
  display: none
  height: 13px
  border-radius: 0px
  background-color: #AAA
  &:hover
    background-color: #AAA

::-webkit-scrollbar-thumb
  background-color: #9c9c9c
  &:hover
    background-color: #CCC

::-webkit-scrollbar-track
  background-color: #000000
  &:hover
    background-color: #000000

::-webkit-scrollbar
  width: 13px
</style>
