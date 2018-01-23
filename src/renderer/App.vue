<template>
  <div id="app" class="theme-dark">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'tloz-tracker',
  mounted () {
  }
}
</script>

<style lang="sass">
@import './assets/styles/main.sass'
@import url('https://fonts.googleapis.com/css?family=Rubik:400,700|VT323')

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

</style>
