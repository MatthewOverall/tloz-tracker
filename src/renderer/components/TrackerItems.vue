<template lang="pug">
.flex
  //- .level(v-for="l in levels")
  //-   .triforce-heart(:class="'level-'+l.level")
  //-     .triangle(@click="toggle(l.triforce)" :class="{on:l.triforce.collected}")
  //-       | {{l.level}}
  //-     .heart(@click="toggle(l.heart)" :class="{on:l.heart.collected}")
  //-   .item-box(v-for="item in l.items" @click="cycleItem(item)" @click.right.prevent="cycleItem(item,-1)")
  //-     .item(:class="items[item.id]")
  .level(v-for="(d, n) in dungeons['quest1']")
    .triforce-heart(:class="'level-'+n")
      .triangle(@click="toggleTriforce(n)" :class="{on:levels[n].triforce.collected}")
        | {{n}}
      .heart(@click="toggleHeart(n)" :class="{on:levels[n].heart.collected}")
    .item-box(v-for="(item, i) in d.items")
      .item(:class="items[levels[n].items[i].id]" @click="cycleItem(levels[n].items[i])" @click.right.prevent="cycleItem(levels[n].items[i],-1)")
  .overworld-items
    .overworld-item
      .item-box
        .item(:class="items[oi.armos.id]" @click="cycleItem(oi.armos)" @click.right.prevent="cycleItem(oi.armos,-1)")
      .item-label A
    .overworld-item
      .item-box
        .item(:class="items[oi.whiteSword.id]" @click="cycleItem(oi.whiteSword)" @click.right.prevent="cycleItem(oi.whiteSword,-1)")
      .item-label WS
    .overworld-item
      .item-box
        .item(:class="items[oi.coast.id]" @click="cycleItem(oi.coast)" @click.right.prevent="cycleItem(oi.coast,-1)")
      .item-label C
</template>


<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'TrackerItems',
  computed: {
    ...mapState({
      levels: state => state.Main.tracker.levels,
      items: state => state.Main.items,
      oi: state => state.Main.tracker.overworldItems,
      inputmap: state => state.Input.inputmap,
      dungeons: state => state.Main.dungeons
    }),
    ...mapGetters([
      'isBindingUp',
      'isBindingDown',
      'isBindingPressed',
    ])
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    toggle (item) {
      this.$store.commit("TOGGLE_COLLECTED", item)
    },
    cycleItem (item, amount) {
      let nextId = item.id + (amount || 1)
      if (nextId >= this.items.length) nextId = 0
      if (nextId < 0) nextId = this.items.length - 1
      this.$store.commit("SET_ITEM_MARKER", { item: item, markerId: nextId })
    },
    toggleTriforce (level) {
      this.toggle(this.levels[level].triforce)
    },
    toggleHeart (level) {
      this.toggle(this.levels[level].heart)
    },
    cycleDungeonItem (level, index) {
      let l = this.levels[level]
      let item = l.items[index] || ''
      let next = this.items.indexOf(item) + 1
      if (next >= this.items.length) next = 0
      if (next < 0) next = this.items.length - 1
      this.$store.commit('SET_ITEM_BOX', { levelIndex: level, itemIndex: index, item: this.items[next] })
      //l.items2[index] = this.items[next]
    }
  }
}
</script>

<style lang="sass" scoped="true">
  .spacer
    flex: 1
  .level
    display: flex
    flex-direction: column
    margin: 0 2px
  .triforce-heart
    display: flex
    flex-direction: column
    &.level-9
      opacity: 0
    &.compact
      flex-direction: row
      .heart
        font-size: 1.1em
        left: -7px
        height: 0
        width: 0
  .triangle
    clip-path: polygon(50% 0, 0 100%, 100% 100%)
    background-color: grey
    width: 28px
    height: 26px
    display: flex
    flex-direction: column-reverse
    align-items: center
    color: #2e2e2e
    font-size: 1.5em
    line-height: .8em
    font-weight: bold
    z-index: 1
    &.on
      background-color: orange
      color: white
      text-shadow: 2px 1px 0px #282828
  .heart
    font-size: 28px
    position: relative
    height: 28px
    &.on
      &:before
        color: red
        display: inline
        opacity: 1
      &:after
        color: white
    &:before
      content: "\F004"
      font-family: FontAwesome
      position: absolute
      opacity: 0
    &:after
      color: grey
      content: "\F08A"
      font-family: FontAwesome
      position: absolute
  .item-box
    margin-top: 2px
    border: 2px solid grey
    height: 28px
    width: 28px
    border-radius: 4px
    display: flex
    align-items: center
    justify-content: center
  .overworld-item
    display: flex
    flex-direction: row-reverse
    align-items: center
  .item-label
    color: white
    font-size: 1.5em
    margin: 0 5px
  .item
    height: 20px
    width: 20px
    background-image: url('../../../static/items/sprites-items.gif')
    background-repeat: no-repeat
    background-position: 100px 100px
    &.boomerang
       background-position: -278px 1px
    &.bow
       background-position: -317px 2px
    &.blue-boomerang
       background-position: -119px -77px
    &.raft
       background-position: -318px -78px
    &.stepladder
       background-position: -318px -38px
    &.recorder
       background-position: -358px -78px
    &.wand
       background-position: -198px -78px
    &.red-candle
       background-position: -78px -118px
    &.book
       background-position: -238px 2px
    &.magic-key
       background-position: -158px -78px
    &.silvers
       background-position: -38px -118px
    &.red-ring
       background-position: -118px -118px
    &.white-sword
       background-position: -358px -118px
    &.power-bracelet
       background-position: -278px -78px
    &.heart-container
       background-position: -237px -37px
</style>

