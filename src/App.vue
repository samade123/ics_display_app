<!-- <template>
  <div class="sidebar">
    <h1>You have 12 tasks today</h1>
    <h2 class="">{{Date.now()}}</h2>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
  </div>
  <router-view />
</template>

<style lang="scss">

@use "@/stylesheets/variables.scss"as *;
@use "@/stylesheets/layout.scss"as *;


</style> -->


<template>
  <div class="sidebar">
    <h1>You have 12 tasks today</h1>
    <h2 class="">{{ Date.now() }}</h2>
    <nav>
      <router-link v-for="route in routes" :key="route.path" :to="route.path">{{ route.name }}</router-link>
    </nav>
  </div>
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
