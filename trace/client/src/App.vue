<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import AppBar from './components/AppBar.vue';
import AppNav from './components/AppNav.vue';

const showNav = ref(true)
</script>

<template>
  <div>
    <v-layout class="rounded rounded-md">
      <AppBar @click-toggle="showNav = !showNav"></AppBar>

      <AppNav v-model="showNav"></AppNav>

      <v-main>
        <RouterView></RouterView>
      </v-main>
    </v-layout>

  </div>
</template>

<style scoped></style>
