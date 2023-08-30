<script setup>
const emit = defineEmits(["click-toggle"]);
</script>

<template>
  <v-app-bar color="red-darken-4" title="Message trace UI">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="emit('click-toggle')"></v-app-bar-nav-icon>
    </template>
  </v-app-bar>
</template>
