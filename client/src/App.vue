<template>
  <div id="app">
    <nav class="navbar navbar-default navbar-inverse navbar-static-top" role="navigation">
      <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button
            type="button"
            class="navbar-toggle"
            data-toggle="collapse"
            data-target="#navbar-brand-centered"
          >
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <!-- navbar-brand-centered -->
          <div
            v-on:click="redirect('/list')"
            class="navbar-brand navbar-brand-centered"
            style="line-height: 1em; cursor: pointer;"
          >
            Time Slots
          </div>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="navbar-brand-centered">
          <ul class="nav navbar-nav">
            <div class="dropdown">
              <button v-on:click="toggleDropdownMenu()" class="dropbtn">Administrator</button>
              <div id="myDropdown" class="dropdown-content">
                <input
                  type="button"
                  v-on:click="redirect('/admin')"
                  value="Profile"
                  style="width: 100%"
                />
                <br />
                <input
                  type="button"
                  :disabled="checkLoginStatus()"
                  v-on:click="signOut()"
                  value="Sign out"
                  style="width: 100%"
                />
              </div>
            </div>
          </ul>
        </div>
        <!-- /.navbar-collapse -->
      </div>
      <!-- /.container-fluid -->
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
window.onclick = (event) => {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    let i;
    for (i = 0; i < dropdowns.length; i += 1) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

export default {
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
    toggleDropdownMenu() {
      document.getElementById('myDropdown').classList.toggle('show');
    },
    checkLoginStatus() {
      console.log(this.$store.state.isAuthenticated);
      return !this.$store.state.isAuthenticated;
    },
    signOut() {
      this.$store.state.isAuthenticated = false;
      fetch('/api/removeSession', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          console.log('something went wrong');
          throw new Error(resp.text);
        })
        .then((data) => {
          if (data.success) {
            this.redirect('/login?statusSuccess=Signed out successfully');
          }
        })
        .catch((error) => {
          console.error('Something went wrong');
          throw error;
        });
    },
  },
};
</script>

<style>
.html,
body {
  margin: 0;
  padding: 0;
  border: 0;
}

span.text-blue {
  color: #387eff;
}

button:focus {
  outline: 0;
}

.navbar .container {
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  width: 100%;
}

.navbar-brand-centered {
  position: absolute;
  left: 50%;
  display: block;
  width: 160px;
  text-align: center;
  background-color: transparent;
}

.navbar > .container .navbar-brand-centered,
.navbar > .container-fluid .navbar-brand-centered {
  margin-left: -80px;
}

.navbar {
  border-bottom: 0;
}

.navbar-default .navbar-nav > li:not(.active) > a:not(.unresponsive):hover {
  background-color: #0e0e0e;
}

.navbar-default .navbar-nav > .active > a,
.navbar-default .navbar-nav > .active > a:focus {
  background-color: #3873ff;
  color: #ffffff;
}

.navbar-default .navbar-nav > .active > a:hover {
  background-color: #1c65eb;
}

.nav.navbar-nav.navbar-right > li > .unresponsive:hover {
  color: #777777;
  cursor: default;
}

div.light-blue-background {
  background-color: #c5e7ff;
}

.green {
  color: #155724;
  background: #d4edda;
  border-color: #c3e6cb;
}

.red {
  color: #571515;
  background: #edd4d4;
  border-color: #e6c3c3;
}

.badge {
  border-radius: 5px;
  max-width: 300px;
}

.dropbtn {
  background-color: #3498db;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown a:hover {
  background-color: #ddd;
}

.show {
  display: block;
}
</style>
