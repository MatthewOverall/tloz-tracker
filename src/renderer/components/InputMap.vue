<template lang="pug">
.config-screen(:class="{'show-binding-overlay':isBinding}")
  .input-mapper
    h2 Input Mapper
    router-link.esc.flex.column.align-center(to="/")
      .fa.fa-times-circle-o.fa-lg
      div ESC
    table.binding-table.mb-20
      thead
        tr
          th Input
          th Binding #1
          th Binding #2
          th Binding #3
      tbody
        tr(v-for="(input, k) in inputmap")
          td {{k}}
          td(v-on:dblclick="mapInput(k, 0)") {{input[0]}}
          td(v-on:dblclick="mapInput(k, 1)") {{input[1]}}
          td(v-on:dblclick="mapInput(k, 2)") {{input[2]}}
  .binding-overlay(v-if="isBinding")
    p Press any key, esc to cancel, backspace to clear
    p ({{pressedKeys.join('+')}})
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  props: ['tileId'],
  computed: {
    ...mapState({
      markers: state => state.markers,
      inputmap: state => state.inputmap
    }),
    ...mapGetters([
      'isBindingUp',
      'isBindingDown',
      'isBindingPressed'
    ]),
  },
  data () {
    return {
      isBinding: false,
      bindingInputName: '',
      bindingIndex: -1,
      pressedKeys: []
    }
  },
  methods: {
    mapInput (name, index) {
      this.isBinding = true
      this.bindingInputName = name
      this.bindingIndex = index
    },
    gameloop () {
      if (this.isBinding) {
        if (this.$game.input.isKeyUp('Escape')) {
          this.endBinding()
          return
        }
        if (this.$game.input.isKeyUp('Backspace')) {
          this.pressedKeys = []
          this.assignCurrentInput()
          return
        }
        let pressed = this.$game.input.getPressedKeys()
        
        pressed.forEach(k => {
          if (!this.pressedKeys.includes(k.code)) {
            this.pressedKeys.push(k.code)
          }
        });
        if (this.pressedKeys.some(x => this.$game.input.isKeyUp(x))) {
          this.assignCurrentInput()
        }
        console.log(this.pressedKeys)
      }
    },
    endBinding () {
      this.isBinding = false
      this.bindingInputName = ''
      this.pressedKeys = []
    },
    assignCurrentInput () {
      this.$store.commit('ASSIGN_INPUT', {
        name: this.bindingInputName,
        index: this.bindingIndex,
        input: this.pressedKeys.join("+")
      })
      this.endBinding()
    }
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

table 
  border-collapse: collapse
  width: 95%
  margin: auto

th, td 
  padding: 0.25rem
  text-align: left
  border: 1px solid black

td:hover
  background-color: #455371

tbody tr:nth-child(odd) 
  background: #3f3f3f


.map-group
  .markers
    display: flex
    flex-wrap: wrap
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
  justify-content: center
  flex-direction: column

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