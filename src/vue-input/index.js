import Input from './input'

// This is your plugin object. It can be exported to be used anywhere.
const VueInput = {
  install (Vue, options) {
    Vue.mixin({
      mounted () {
        if (this.handleInput) {
          Input.onInput(this.handleInput)
        }
      }
    });
  }
};

export default VueInput;