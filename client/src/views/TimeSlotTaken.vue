<template>
  <div class="container">
    <section class="col-md-10 col-md-offset-1">
      <div
        style="
          text-align: center;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          display: flex;
        "
      >
        <h1 class="row" style="display: flex; justify-content: center; align-items: center">
          This time slot is taken. Please select another one.
        </h1>
        <input type="button" v-on:click="redirect()" value="Go Back" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TimeSlotTaken',
  components: {},
  data: () => ({}),
  methods: {
    redirect() {
      this.$router.push('/list');
    },
  },
};
</script>
