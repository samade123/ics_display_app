<template>
  <div class="sidebar">
    <h1>You have 12 tasks today</h1>
    <h2 class="">{{ Date.now() }}</h2>
    <nav>
      <router-link v-for="route in routes" :key="route.path" :to="route.path">{{ route.name }}</router-link>
    </nav>
  </div>

  <nav class="topbar">
    <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
    <label for="vehicle1"> Summary</label>
  </nav>
  <router-view />
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const routes = computed(() => {
      return router.getRoutes();
    });
    return {
      routes,
    };
  },
};
</script>

<style lang="scss">
@use "@/stylesheets/variables.scss" as *;
@use "@/stylesheets/layout.scss" as *;
</style>
