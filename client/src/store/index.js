import Vue from 'vue';
import Vuex from 'vuex';
import Clipboard from 'v-clipboard';
import VueHead from 'vue-head';

Vue.use(Vuex);
Vue.use(Clipboard);
Vue.use(VueHead);

// no-param-reassign prevents store.isAuthenticated = isAuthenticated
/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    cookie: {
      username: '',
    },
  },
  mutations: {
    setIsAuthenticated(store, isAuthenticated) {
      store.isAuthenticated = isAuthenticated;
    },
    setUsername(store, username) {
      store.cookie.username = username;
    },
  },
  actions: {},
  modules: {},
});
