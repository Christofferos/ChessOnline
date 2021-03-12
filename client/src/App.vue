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
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div
          class="collapse navbar-collapse"
          id="navbar-brand-centered"
          style="text-align: center;"
        >
          <ul class="nav navbar-nav">
            <li v-on:click="redirect('/login')">
              <a style="cursor: pointer; "
                ><img src="../public/logoNavbar.png" style="height: 27px"
              /></a>
            </li>
            <li v-on:click="redirect('/login')">
              <a style="cursor: pointer; line-height: 2;">Profile</a>
            </li>
            <li v-on:click="redirect('/list')">
              <a style="cursor: pointer; line-height: 2">Play Chess</a>
            </li>
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
export default {
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
  },
  mounted() {
    /* const chessboardJs = document.createElement('script');
    chessboardJs.setAttribute(
      'src',
      'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js',
    );
    document.head.appendChild(chessboardJs);
    const chessboardJQuery = document.createElement('script');
    chessboardJQuery.setAttribute('src', 'https://code.jquery.com/jquery-1.12.4.min.js');
    document.head.appendChild(chessboardJQuery);
    const chessboardCss = document.createElement('link');
    chessboardCss.setAttribute(
      'href',
      'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css',
    );
    document.head.appendChild(chessboardCss); */
  },
  /* head: {
    link: [
      {
        rel: 'stylesheet',
        href: './chessboard/css/chessboard-1.0.0.min.css',
      },
    ],
    script: [
      { type: 'text/javascript', src: 'https://code.jquery.com/jquery-1.12.4.min.js' },
      { type: 'text/javascript', src: './chessboard/chessboard-1.0.0.min.js' },
    ],
  }, */
};
</script>

<style>
.html,
body {
  margin: 0;
  padding: 0;
  border: 0;
  background: #464541;
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
</style>
