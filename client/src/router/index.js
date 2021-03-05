import Vue from 'vue';
import VueRouter from 'vue-router';
import ListView from '../views/List.vue';
import RoomView from '../views/Room.vue';
import LoginView from '../views/Login.vue';
import AdminView from '../views/Admin.vue';
import BookTimeSlot from '../views/BookTimeSlot.vue';
import TimeSlotTaken from '../views/TimeSlotTaken.vue';
import TimeSlotReserved from '../views/TimeSlotReserved.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/list' },
  { path: '/list', component: ListView },
  { path: '/room/:roomName', component: RoomView },
  { path: '/login', component: LoginView },
  { path: '/admin', component: AdminView },
  { path: '/bookTimeSlot/:timeSlotId', component: BookTimeSlot },
  { path: '/timeSlotTaken', component: TimeSlotTaken },
  { path: '/timeSlotReserved', component: TimeSlotReserved },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

// Setup Authentication guard
router.beforeEach((to, from, next) => {
  if (store.state.isAuthenticated === false && to.path === '/admin') {
    console.info('Unauthenticated user. Redirecting to login page.');
    next('/login');
  } else {
    next();
  }
  /* else if (
    store.state.hasSelectedTimeSlot === false &&
    to.path === '/bookTimeSlot/:timeSlotId'
  ) {
    console.log('Trying to access');
  } */
});

export default router;
