<script setup>
import { RouterLink, useRouter } from 'vue-router'
const emit = defineEmits(['update:modelValue', 'clickNavItem']);
const props = { showNav: Boolean }
const router = useRouter();
</script>

<template>
  <v-navigation-drawer v-model="props.showNav">
    <v-list>
      <v-list-item v-for="item in router.getRoutes().filter(route => !route.path.includes(':'))" :key="item.path" :value="item">
        <RouterLink :to="item.path" style="text-decoration: none; color: inherit">
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </RouterLink>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
