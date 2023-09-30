<template>
  <div class="home summary">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <Summary msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Summary from "@/components/Summary.vue";

export default {
  name: "HomeView",
  components: {
    Summary,
  },
};
</script>
