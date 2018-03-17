<template lang="pug">
div
  table
    thead
      tr(v-for="(item, index) in meta")
        input(v-bind:id="index", type="checkbox", v-bind:checked="config[index]", v-on:click="checkboxClicked($event)")
        label(v-bind:for="index") {{meta[index].description}}
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      config: state => state.ConfigBehavior.config.values,
      meta: state => state.ConfigBehavior.config.meta
    })
  },
  methods: {
    checkboxClicked(event) {
      this.$store.commit('ASSIGN_CONFIG_BEHAVIOR', {
        name: event.target.id,
        value: event.target.checked
      })
    }
  }
}
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

input
  vertical-align: middle
label
  padding-left: 0.25rem
  margin-top: 4px
  vertical-align: middle
</style>
