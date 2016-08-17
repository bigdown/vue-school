import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  title:'首页'
}

const mutations = { 
	MODIFYTITLE(state , strTitle){
		state.title = strTitle
	}
}

export default new Vuex.Store({
  state,
  mutations
})