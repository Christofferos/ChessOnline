<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1 class="login-title">Sign in</h1>
    <div id="statusSuccess" class="badge green"></div>
    <h4 class="login-status"></h4>

    <form class="account-form" v-on:submit.prevent="done()">
      <input
        class="form-control"
        type="text"
        v-model="username"
        required
        autofocus
        placeholder="Username"
      />
      <input
        class="form-control"
        type="password"
        v-model="password"
        required
        autofocus
        placeholder="Password"
      />
      <div id="statusFail" class="badge red"></div>
      <input class="btn btn-default login-button" type="submit" value="Sign in" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data: () => ({
    username: '',
    password: '',
  }),
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
          if (resp.ok) return resp;
          this.$store.commit('setIsAuthenticated', false);
          this.$router.push({
            path: 'login',
          });
          throw new Error(resp.text);
        })
        .then(() => {
          this.$store.commit('setIsAuthenticated', true);
          this.$store.commit('setUsername', this.username);
          this.$router.push({
            path: 'profile',
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

<style>
.login-title {
  color: white;
}

.form-control {
  margin-bottom: 20px;
  width: 200px;
  padding: 5px;
  line-height: 20px;
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
}

.account-form {
  display: flex;
  flex-direction: column;
  margin: 0;
  align-items: center;
  justify-content: center;
}

.login-button {
  background: #7fa650;
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 1.2;
  color: white;
  width: 200px;
  border: none;
}
.login-button:hover {
  background: #95bb4a;
  color: white;
}
</style>
