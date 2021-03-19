import Vue from 'vue';
import io from 'socket.io-client';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

(async () => {
  console.log('MAIN');
  // Find out if the user is already logged in
  const { isAuthenticated, username } = await fetch('/api/isAuthenticated')
    .then(resp => resp.json())
    .catch(console.error);
  store.commit('setIsAuthenticated', isAuthenticated);
  store.commit('setUsername', username);

  const VueObj = new Vue({
    router,
    store,
    render: h => h(App),
    data: {
      socket: isAuthenticated
        ? io().connect('https://localhost:8989', {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity,
        })
        : '',
    },
  }).$mount('#app');

  /* VueObj.socket.on('reconnect', () => console.log('RECONNECTED!!!'));
  VueObj.socket.on('connect', () => console.log('CONNECT!!!'));
  VueObj.socket.on('disconnect', () => console.log('DISCONNECT!!!')); */
})();
