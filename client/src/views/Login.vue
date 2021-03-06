<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1>Sign in</h1>
    <form v-on:submit.prevent="done()">
      <input
        class="form-control"
        type="text"
        v-model="name"
        required
        autofocus
        placeholder="Username"
      />
      <input
        class="form-control"
        type="text"
        v-model="password"
        required
        autofocus
        placeholder="Password"
      />
      <input class="btn btn-default" type="submit" value="Ok" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data: () => ({
    name: '',
  }),
  methods: {
    done() {
      fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.name,
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
          this.$router.push({
            path: 'list',
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
