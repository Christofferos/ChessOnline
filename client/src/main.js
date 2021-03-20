import Vue from 'vue';
import io from 'socket.io-client';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

(async () => {
  // Find out if the user is already logged in
  const { isAuthenticated, username } = await fetch('/api/isAuthenticated')
    .then((resp) => {
      if (!resp.ok) console.log('Resp not ok');
      return resp.json();
    })
    .catch(err => console.log('EErr ', err));
  store.commit('setIsAuthenticated', isAuthenticated);
  store.commit('setUsername', username);

  new Vue({
    router,
    store,
    render: (h) => {
      if (!h) console.log('Unable to render');
      return h(App);
    },
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
})();
