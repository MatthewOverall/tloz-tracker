<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import AbstractInput from './AbstractInput'

export default AbstractInput.extend({
  data () {
    return {
      isBinding: false,
      bindingInputName: '',
      bindingIndex: -1,
      pressedKeys: [],
      inputType: 'global'
    }
  }
})
</script>
