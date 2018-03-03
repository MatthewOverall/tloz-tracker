<template lang="pug">
.flex
  .level(v-for="(d, n) in dungeons['quest1']" :class="[{active:n == activeLevel}, 'level-'+n, {discovered: discoveredDungeons.includes(n)}]")
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
      activeLevel: state => state.Main.tracker.activeLevel,
      items: state => state.Main.items,
      oi: state => state.Main.tracker.overworldItems,
      inputmap: state => state.Input.inputmap,
      dungeons: state => state.Main.dungeons
    }),
    ...mapGetters([
      'isBindingUp',
      'isBindingDown',
      'isBindingPressed',
      'discoveredDungeons'
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
  $item-size: 36px
  $heart-size: 36px
  $triangle-font-size: 1.8em
  .spacer
    flex: 1
  .level
    display: flex
    flex-direction: column
    margin: 0 2px
    align-items: center
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
  .discovered
    .triangle
      background-color: #fd6e6e
  .triangle
    clip-path: polygon(50% 0, 0 100%, 100% 100%)
    background-color: #dcccb6
    width: $heart-size
    height: $heart-size - 2px
    display: flex
    flex-direction: column-reverse
    align-items: center
    color: #2e2e2e
    font-size: $triangle-font-size
    line-height: .8em
    font-weight: bold
    z-index: 1
    &.on
      background-color: orange
      color: white
      text-shadow: 2px 1px 0px #282828
  .heart
    font-size: $heart-size
    position: relative
    height: $heart-size
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
      color: #dcccb6
      content: "\F08A"
      font-family: FontAwesome
      position: absolute
  .item-box
    margin-top: 2px
    border: 2px solid #dcccb6
    height: $item-size
    width: $item-size
    background-color: #1f202c
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
    text-shadow: 2px 1px black
  .item
    height: 100%
    width: 100%
    background-size: cover
    &.boomerang
      background-image: url('../../../static/items/loz-boomerang.png')
    &.bow
      background-image: url('../../../static/items/loz-bow.png')
    &.blue-boomerang
      background-image: url('../../../static/items/loz-magical-boomerang.png')
    &.raft
      background-image: url('../../../static/items/loz-raft.png')
    &.stepladder
      background-image: url('../../../static/items/loz-step-ladder.png')
    &.recorder
      background-image: url('../../../static/items/loz-recorder.png')
    &.wand
      background-image: url('../../../static/items/loz-magical-rod.png')
    &.red-candle
      background-image: url('../../../static/items/loz-red-candle.png')
    &.book
      background-image: url('../../../static/items/loz-book-of-magic.png')
    &.magic-key
      background-image: url('../../../static/items/loz-magical-key.png')
    &.silvers
      background-image: url('../../../static/items/loz-silver-arrow.png')
    &.red-ring
      background-image: url('../../../static/items/loz-red-ring.png')
    &.white-sword
      background-image: url('../../../static/items/loz-white-sword.png')
    &.power-bracelet
      background-image: url('../../../static/items/loz-power-bracelet.png')
    &.heart-container
      background-image: url('../../../static/items/loz-heart-container.png')
</style>

