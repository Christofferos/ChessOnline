import Vue from 'vue';
import VueRouter from 'vue-router';
import ListView from '../views/List.vue';
import RoomView from '../views/Room.vue';
import LoginView from '../views/Login.vue';
import ProfileView from '../views/Profile.vue';
import SignUp from '../views/SignUp.vue';

import store from '../store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/list' },
  { path: '/list', component: ListView },
  { path: '/room/:roomName', component: RoomView },
  { path: '/login', component: LoginView },
  { path: '/profile', component: ProfileView },
  { path: '/signUp', component: SignUp },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

// Setup Authentication guard
router.beforeEach(async (to, from, next) => {
  // Check if session is valid before routing
  const { isAuthenticated } = await fetch('/api/isAuthenticated')
    .then(resp => resp.json())
    .catch(console.error);
  store.commit('setIsAuthenticated', isAuthenticated);

  // ...
  if (store.state.isAuthenticated === false && to.path !== '/login' && to.path !== '/signUp') {
    console.info('Unauthenticated user. Redirecting to login page.');
    next('/login');
  } else if (store.state.isAuthenticated && to.path === '/login') {
    console.info('Redirecting to profile page.');
    next('/profile');
  } else {
    next();
  }
});

export default router;
