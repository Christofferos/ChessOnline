<template>
  <div class="text-box col-md-4 col-md-offset-4" style="text-align: center">
    <h1 style="color: white">Welcome</h1>
    <img
      src="https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"
      style="width: 150px"
    />
    <h2 style="color: white">
      {{ capitalizeFirstLetter(this.currentlyLoggedIn) }}
    </h2>
    <h4 style="color: white">
      Experience Score: _
    </h4>

    <input
      class="btn btn-default login-button"
      type="button"
      value="Sign out"
      style="margin-top: 10px; margin-bottom: 10px"
      v-on:click="signOut()"
    />

    <div
      style="border: 2px solid black; width: 350px; margin: 75px auto 25px auto;
           background: #504F4C; border-radius: 5px; padding-bottom: 20px;"
    >
      <h1 style="color: white">Match history:</h1>
      <table style="width:95%; margin: auto; text-align: center">
        <!-- Map over history with table rows -->
        <tr>
          <th>Player</th>
          .
          <th>Result</th>
          <th>Moves</th>
          <th>Date</th>
        </tr>
        <!-- <div class="row">-</div>
        <div class="row">-</div>
        <div class="row">-</div> -->
      </table>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'Profile',
  components: {},
  data() {
    return {
      currentlyLoggedIn: '',
      success: true,
    };
  },
  created() {
    this.currentlyLoggedIn = this.$store.state.cookie.username;
    console.log('User logged in: ', this.$store.state.cookie.username);
    console.log('IsAuthenticated: ', this.$store.state.isAuthenticated);
    this.$root.socket = io().connect();
  },
  methods: {
    capitalizeFirstLetter(inputStr) {
      return inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
    },
    signOut() {
      fetch('/api/signOut', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          this.$store.commit('setIsAuthenticated', false);
          this.$store.commit('setUsername', '');
          this.$router.push({
            path: 'login',
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
