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

<style>
@import url('https://fonts.googleapis.com/css?family=Rubik:400,700|VT323');

/* CSS */
body.theme-dark {
  background-color: #2e2e2e;
  /* font-family: 'Rubik', sans-serif; */
  font-family: 'VT323', monospace;
  font-size: 16px
}
* {
  margin: 0;
  padding: 0;
  cursor: default !important;
  box-sizing: border-box
}

:not(input):not(textarea),
:not(input):not(textarea)::after,
:not(input):not(textarea)::before {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}
input,
button,
textarea,
:focus {
  outline: none
}
</style>
