import gameState from './index'
// This is your plugin object. It can be exported to be used anywhere.
const VueGame = {
  install (Vue, options) {
    Vue.prototype.$game = gameState
    Vue.mixin({
      mounted () {
        if (this.gameloop) {
          window.addEventListener('gameloop', this.gameloop)
        }
      },
      beforeDestroy () {
        if (this.gameloop) {
          window.removeEventListener('gameloop', this.gameloop)
        }
      }
    });
  }
};

export default VueGame;