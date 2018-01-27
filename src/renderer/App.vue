<template>
  <div id="app" class="theme-dark">
    <div class="tilebar">
      <div class="logo">Zelda Tracker</div>
      <div class="tilebar-spacer"></div>
      <div class="tilebar-btn minimize pt-3" @click="minimize">―</div>
      <div class="tilebar-btn maximize" @click="minimize">☐</div>
      <div class="tilebar-btn close " @click="minimize">✕</div>
    </div>
    <router-view class="app-view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'tloz-tracker',
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
@import url('https://fonts.googleapis.com/css?family=Rubik:400,700|VT323')

html
  overflow: hidden
body
  font-family: 'VT323', monospace
  font-size: 16px
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

.tilebar
  height: 20px
  display: flex
  justify-content: flex-end
  background-color: #2e2e2e
  -webkit-user-select: none
  -webkit-app-region: drag
  border-bottom: 1px solid black
  .logo
    padding-left: 5px
    -webkit-app-region: no-drag
    display: flex
    align-items: center
  .tilebar-spacer
    flex: 1
    height: 6px
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

</style>
