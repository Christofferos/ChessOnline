# Client

The client is an so called Single-Page-Application and is built using a javascript framework called `Vue.js`.

## Files

As you can see there are quite a few files in this directory, however most of them are configuration files that you don't have to (nor is expected to) understand in order to complete the lab.

The files you should care about are located in the `src` (source) folder:

**main.js:** This is the entry file for you client. It takes care of setting up the Vue app that will run the rest of your code.

**App.vue:** This is the entry point of your Vue app. As you can see the file has the extension `.vue` instead of `.js`, this is to indicate that this file is in fact not strictly javascript, but in fact a [Vue Single-File Component](https://vuejs.org/v2/guide/single-file-components.html). If you open `App.vue` you will see that it looks quite like HTML. Before moving on I would recommend going through the Vue 101 interactive tutorial linked in the Docs & Resources section of the README.

**views/*.vue:** These files define the views of your application. A view is what you in general would think of as a "page", it contains everything you see on the website (except the Navigation which is defined in `App.vue`).

**store/index.js:** This file contains the global storage of your application. You can think of it as some sort of database that gets emptied whenever you reload the page. Its purpose is to make sure that the apps state is stored in a single place and not scattered to the four winds.

**router/index.js:** This files contains the logic that determine what view should be shown to the user depending on what URL the user has visited. For example `localhost:8989/#/list` will display the `List.vue` component to the user.

**assets/*:** This is where you put any images or other none code assets that you want to include in your application.

## Docs & Resources

* Vue 101 Interactive Tutorial __(recommended)__:  <https://scrimba.com/p/pXKqta/cQ3QVcr>
* Vue single file components: <https://vuejs.org/v2/guide/single-file-components.html>
* Vue templating directives: <https://vuejs.org/v2/api/#Directives>
* Vue router docs: <https://router.vuejs.org/>
* Vuex (store) docs: <https://vuex.vuejs.org/>
* Socket io (client): <https://socket.io/docs/client-api/>

These links are just recommendations, you might not need all of them, or you might need to find your own sources. <br>
Good luck!
