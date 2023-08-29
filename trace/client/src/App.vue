<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <v-layout class="rounded rounded-md">
      <v-app-bar color="teal-darken-4" title="Message trace UI">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>
      </v-app-bar>

      <v-navigation-drawer>
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <RouterView></RouterView>
      </v-main>
    </v-layout>


    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>

  </div>
</template>

<style scoped></style>
