<template>
  <div
    class="text-box col-md-4 col-md-offset-4"
    style="text-align: center; align-items: center; justify-content: center"
  >
    <h1>Sign in</h1>
    <div id="statusSuccess" class="badge green"></div>
    <h4 class="login-status"></h4>
    <form v-on:submit.prevent="done()">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">Username</span>
        </div>
        <input
          required=""
          type="text"
          v-model="username"
          class="form-control"
          aria-describedby="basic-addon3"
        />
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">Password</span>
        </div>
        <input
          required=""
          type="password"
          v-model="password"
          class="form-control"
          aria-describedby="basic-addon3"
        />
      </div>
      <div id="statusFail" class="badge red"></div>
      <br />
      <input class="btn btn-default" type="submit" value="Sign in" />
    </form>
  </div>
</template>

<script>
import store from '../store';

export default {
  name: 'Login',
  components: {},
  data: () => ({
    username: '',
    password: '',
  }),
  mounted() {
    if (this.$router.history.current.query) {
      console.log(this.$router.history.current.query.statusSuccess);
      if (this.$router.history.current.query.statusSuccess) {
        document.querySelector(
          '#statusSuccess',
        ).innerText = this.$router.history.current.query.statusSuccess;
      }
    }
  },
  methods: {
    done() {
      fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((resp) => {
          if (resp.ok) {
            store.state.isAuthenticated = true;
            //
            const cookieUsername = document.cookie.split('username=')[1].split(';')[0];
            console.log('cookie-username=', cookieUsername);
            this.$store.state.cookie.username = cookieUsername;
            return resp;
          }
          document.querySelector('#statusFail').innerText = 'Wrong username and/or password';
          this.$store.commit('setIsAuthenticated', false);
          this.$router.push({
            path: 'login',
          });
          throw new Error(resp.text);
        })
        .then(() => {
          this.$store.commit('setIsAuthenticated', true);
          this.$router.push({
            path: 'admin',
          });
        })
        .catch((error) => {
          console.error('Authentication failed unexpectedly');
          throw error;
        });
    },
  },
};
</script>
