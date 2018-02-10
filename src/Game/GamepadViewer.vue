<template lang="pug">
  .gamepad(:style="{transform: 'scale('+scale+')'}")
    .resizer
      .resize-up(@click="scale += .05") +
      .resize-down.ml-10(@click="scale -= .05") -
    .controller.xbox
      img(src="./gamepad-templates/xbox-pad-dark.svg" )
      .button(v-for="(button, i) in buttons" :class="['btn'+i, {pressed: buttons[i] && buttons[i].pressed}]")
      .joystick.joystick-1
        .joystick-inner.button(:class="[{pressed: buttons[10] && (buttons[10].pressed || Math.abs(axes[0]) >= .7 || Math.abs(axes[1]) >= .7)}]" :style="{transform:'translateX('+axes[0] * joffset+'px) translateY('+axes[1] *joffset+'px) rotateY('+axes[0] *1.5* joffset+'deg) rotateX('+-axes[1] * 1.5*joffset+'deg)'}")
      .joystick.joystick-2
        .joystick-inner.button(:class="[{pressed: buttons[11] &&(buttons[11].pressed || Math.abs(axes[2]) >= .7 || Math.abs(axes[3]) >= .7)}]" :style="{transform:'translateX('+axes[2] * joffset+'px) translateY('+axes[3] *joffset+'px) rotateY('+axes[2] *1.5* joffset+'deg) rotateX('+-axes[3] * 1.5*joffset+'deg)'}")
</template>

<script>
import Game from '../Game'

export default {
  data () {
    return {
      buttons: [],
      axes: [],
      joffset: 20,
      scale: 1
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
.resizer
  display: flex
  position: absolute
  bottom: 10%
  width: 100%
  z-index: 2
  align-items: center
  justify-content: center
  .resize-up,
  .resize-down
    width: 40px
    height: 40px
    font-size: 30px
    border: 2px solid white
    background-color: grey
    display: flex
    align-items: center
    justify-content: center
.controller
  font-family: 'helvetica'
  color: white
  position: relative
  img
    display: block
    width: 100%

.joystick
  height: 65px
  width: 65px
  //background-color: #0074d9
  border-radius: 100%
  display: flex
  align-items: center
  justify-content: center

  .joystick-inner
    height: 80%
    width: 80%
    background-color: #1a63ad
    border: 2px solid white
    border-radius: 100%
.button
  position: absolute
  // background-color: orange
  // opacity: .5
  &.pressed
    background-color: magenta !important
    opacity: 1
.xbox
  .joystick
    position: absolute
    &.joystick-1
      top: 80px
      left: 107px

    &.joystick-2
      top: 164px
      right: 168px
    
  .btn0,
  .btn1,
  .btn2,
  .btn3,
    height: 38px
    width: 38px
    background-color: #616161 
    border-radius: 100%
    display: flex
    align-items: center
    justify-content: center
    font-size: 2em
    font-weight: bold
    &.pressed
      color: black
  .btn0 // A
    //background-color: green
    top: 131px
    right: 111px
    &:after
      content: 'A'
  .btn1 // B
    //background-color: red
    top: 93px
    right: 74px
    &:after
      content: 'B'
  .btn2 // X
    //background-color: blue
    top: 93px
    right: 148px
    &:after
      content: 'X'
  .btn3 // Y
    //background-color: orange
    top: 56px
    right: 111px
    &:after
      content: 'Y'

  .btn4,
  .btn5,
  .btn6,
  .btn7

  .btn4,
  .btn5
    height: 27px
    width: 121px
    border-radius: 50% / 100%
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
    top: 5px
  .btn4 // LB
    left: 79px
    transform: rotate(-15deg)
  .btn5 // RB
    right: 79px
    transform: rotate(15deg)

  .btn6,
  .btn7
    width: 50px
    height: 45px
    top: 20px
    border: 1px solid #484847
    background-color: #1f1f21
  .btn6 // LT
    left: 12px
    border-radius: 10% 100% 10% 10%
    transform: rotate(-155deg)
  .btn7 // RT
    right: 12px
    border-radius: 100% 10% 10% 10%
    transform: rotate(155deg)


  .btn8,
  .btn9
    height: 25px
    width: 25px
    border-radius: 100%
    top: 100px
  .btn8 // Select
    left: 224px
  .btn9 // Start
    right: 219px
  .btn10 // LStick
  .btn11 // RStick
  
  .btn12,
  .btn13
    height: 27px
    width: 27px
    left: 194px
  .btn14,
  .btn15
    height: 27px
    width: 27px
    top: 185px
  .btn12 // DUp
    top: 162px
    border-radius: 5px 5px 0 0
  .btn13 // DDown
    top: 207px
    border-radius: 0 0 5px 5px
  .btn14 // DLeft
    left: 173px
    border-radius: 5px 0 0 5px
  .btn15 // DRight
    left: 216px
    border-radius: 0 5px 5px 0

</style> 

