<template>
  <!-- <div class="sidebar">
    <h1>You have 12 tasks today</h1>
    <h2 class="">{{ today }}</h2>
    <nav>
      <router-link v-for="route in routes" :key="route.path" :to="route.path">{{ route.name }}</router-link>
    </nav>
  </div> -->

  <nav class="topbar">
    <input type="checkbox" id="vehicle1" name="vehicle1" v-model="svgState.allView">
    <label for="vehicle1" >
      <!-- Summary -->
      <!-- <icon name="icon" width="50" height="50"></icon> -->
      <!-- <img :src="svgSrc" alt=""> -->
      <div role="button">

        <Icon :transitionToAllView="transitionToAllView"
          :class="{ 'all_view': svgState.allView, 'dashboard_view': svgState.dashboardView, transition: svgState.transition }">
        </Icon>
        <span class="default_label"> {{ svgState.allView ? "All view" : "Dashboard View" }}</span>
  
        <span class="hover_label">Switch View </span>
      </div>
    </label>
  </nav>
  <router-view />
</template>

<script>
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns'
import Icon from "@/components/iconbox.vue";


export default {
  name: "Main",
  components: {
    Icon,
  },
  setup() {


    const router = useRouter();

    const routes = computed(() => {
      return router.getRoutes();
    });
    const svgSrc = require(`@/assets/icon.svg`);

    const svgState = ref({ dashboardView: true, allView: false, transition: false })
    // const transitionDirection = ref(false)

    const transitionToAllView = ref(false);

    const today = format(new Date(), 'MM/dd/yyyy')

    watchEffect(() => {
      svgState.value.dashboardView = !svgState.value.allView

      if (svgState.value.allView) {
        svgState.value.transition = true;
        transitionToAllView.value = true
        router.push('/summary');
      } else {
        router.push('/');
        svgState.value.transition = true;
        transitionToAllView.value = false


      }
    })


    return {
      routes,
      svgState,
      today,
      svgSrc,
      transitionToAllView,
    };
  },
};
</script>

<style lang="scss">
@use "@/stylesheets/variables.scss" as *;
@use "@/stylesheets/layout.scss" as *;
</style>
