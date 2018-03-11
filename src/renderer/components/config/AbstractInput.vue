<template lang="pug">
div
  table.binding-table.mb-20(:class="{'show-binding-overlay':isBinding}")
    thead
      tr(:class="inputType")
        th Input
        th Binding #1
        th Binding #2
        th Binding #3
    tbody
      tr(v-for="(input, k) in inputmap[inputType]")
        td {{k}}
        td(v-on:dblclick="mapInput(inputType, k, 0)") {{input[0]}}
        td(v-on:dblclick="mapInput(inputType, k, 1)") {{input[1]}}
        td(v-on:dblclick="mapInput(inputType, k, 2)") {{input[2]}}
  .binding-overlay(v-if="isBinding")
    p Press any key, esc to cancel, backspace to clear
    p ({{pressedKeys.join('+')}})
</template>

<script>
import Vue from  'vue'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState({
      markers: state => state.Main.markers,
      inputmap: state => state.Input.inputmap
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
      pressedKeys: [],
      inputType: 'abstract-none'
    }
  },
  methods: {
    mapInput (type, name, index) {
      this.isBinding = true
      this.bindingType = type
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
        })
        if (this.pressedKeys.some(x => this.$game.input.isKeyUp(x))) {
          this.assignCurrentInput()
        }
      }
    },
    endBinding () {
      this.isBinding = false
      this.bindingInputName = ''
      this.pressedKeys = []
    },
    assignCurrentInput () {
      this.$store.commit('ASSIGN_INPUT', {
        type: this.bindingType,
        name: this.bindingInputName,
        index: this.bindingIndex,
        input: this.pressedKeys.join("+")
      })
      this.endBinding()
    }
  }

})
</script>

<style lang="sass" scoped>
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
</style>
