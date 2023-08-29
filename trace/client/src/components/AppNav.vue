<script setup>
const emit = defineEmits(['update:modelValue']);
const props = {
  showNav: Boolean
}
</script>

<template>
  <v-navigation-drawer v-model="props.showNav">
    <v-list>
      <v-list-item title="Navigation drawer"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
