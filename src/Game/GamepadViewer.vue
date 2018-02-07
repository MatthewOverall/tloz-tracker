<template lang="pug">
  .canvas.controller.xbox
    .button(v-for="(button, i) in buttons" :class="['btn'+i, {pressed: buttons[i] && buttons[i].pressed}]")
    .joystick-outer
      .joystick-inner(:style="{transform:'translateX('+axes[0] * 40+'px) translateY('+axes[1] *40+'px) rotateY('+axes[0] * 40+'deg) rotateX('+-axes[1] * 40+'deg)'}")
    .joystick-outer
      .joystick-inner(:style="{transform:'translateX('+axes[2] * 40+'px) translateY('+axes[3] *40+'px) rotateY('+axes[2] * 40+'deg) rotateX('+-axes[3] * 40+'deg)'}")      
</template>

<script>
import Game from '../Game'

export default {
  data () {
    return {
      buttons: [],
      axes: []
    }
  },
  methods: {
    gameloop () {
      if (Game.state.frame % 2 != 0) return
      let gp = Game.input.gamepads[0]
      if (!gp) return
      gp.axes.forEach((a, i) => this.axes.splice(i, 1, a))
      gp.buttons.forEach((b, i) => this.buttons.splice(i, 1, b))
    }
  }
}
</script>

<style lang="sass" scoped>
$green: #9aca36;
$blue: #5086c6;
$yellow: #fec75d;
$red: #c14135;
$grey: #dbdcdf;
$dark-grey: #272827;

.controller
  position: relative

.canvas
  font-family: 'helvetica'
  font-size: 16px
  color: white
.joystick-outer
  height: 150px
  width: 150px
  background-color: #0074d9
  border-radius: 100%
  display: flex
  align-items: center
  justify-content: center
  .joystick-inner
    height: 90%
    width: 90%
    background-color: red
    border-radius: 100%
.xbox
  .btn0,
  .btn1,
  .btn2,
  .btn3,
    height: 40px
    width: 40px
    background-color: #0074d9
    border-radius: 100%
    display: flex
    align-items: center
    justify-content: center
    font-size: 2em
    font-weight: bold
    &.pressed
      background-color: white
      color: black
  .btn0 // A
    background-color: green
    &:after
      content: 'A'
  .btn1 // B
    background-color: red
    &:after
      content: 'B'
  .btn2 // X
    background-color: blue
    &:after
      content: 'X'
  .btn3 // Y
    background-color: orange
    &:after
      content: 'Y'

  .btn4,
  .btn5,
  .btn6,
  .btn7
    border: 1px solid darken($grey, 55%)
    color: darken($grey, 55%)

  .btn4,
  .btn5
    background: linear-gradient(to bottom, darken($grey, 45%) 14%,darken($grey, 30%) 27%,darken($grey, 35%) 46%,darken($grey, 35%) 100%);
    height: 30px
    width: 100px
  .btn4 // LB
    border-radius: 35px 120px 15px 25px
  .btn5 // RB
    border-radius: 120px 35px 25px 15px
  
  .btn6,
  .btn7
    width: 30px
    height: 40px
    background: linear-gradient(to bottom, #989aa3 14%, #8a8d97 27%, #7d808b 56%, #7d808b 60%, #646771 71%, #34363b 100%)
  .btn6 // LT
    border-radius: 25px 25px 0 0!important
  .btn7 // RT
    border-radius: 25px 25px 0 0!important

  .btn8,
  .btn9
    height: 10px
    width: 30px
    border-radius: 4px
    background-color: orange
  .btn8 // Select
  .btn9 // Start

  .btn10 // LStick
    background-color: orange
  .btn11 // RStick
    background-color: orange
  .btn12 // DUp
    background-color: orange
  .btn13 // DDown
    background-color: orange
  .btn14 // DLeft
    background-color: orange
  .btn15 // DRight
    background-color: orange

</style> 

