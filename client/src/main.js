import Vue from 'vue';
import io from 'socket.io-client';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

(async () => {
  // Find out if the user is already logged in
  const { isAuthenticated, username } = await fetch('/api/isAuthenticated')
    .then(resp => resp.json())
    .catch(console.error);
  store.commit('setIsAuthenticated', isAuthenticated);
  store.commit('setUsername', username);

  new Vue({
    router,
    store,
    render: h => h(App),
    data: {
      socket: isAuthenticated ? io().connect() : '',
    },
  }).$mount('#app');
})();
