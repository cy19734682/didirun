import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth.js'
import home from './modules/home.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	mutations: {},
	actions:{},
	modules: {
    auth,
		home
	},
})
