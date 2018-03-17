const state = {
  config: {
    values: getConfigBehaviorValues(),
    meta: {
      overworldTrackMouse: {
        description: "Overworld map cursor tracks mouse cursor",
        type: "boolean"
      }
    }
  }
}

const mutations = {
  ASSIGN_CONFIG_BEHAVIOR (state, d) {
    state.config.values[d.name] = d.value
    localStorage.setItem('config_behavior', JSON.stringify(state.config.values))
  }
}

const getters = {
  getConfig: state => (name) => {
    return state.config[name]
  }
}

export default {
  state,
  mutations,
  getters
}

function getDefaultConfigBehaviorValues() {
  return {
    overworldTrackMouse: true
  }
}

function getStoredConfigBehaviorValues() {
  try {
    return JSON.parse(
      localStorage.getItem('config_behavior')
    );
  } catch (ex) {
    return {}
  }
}

function getConfigBehaviorValues() {
  return Object.assign(
    getDefaultConfigBehaviorValues(),
    getStoredConfigBehaviorValues()
  );
}
