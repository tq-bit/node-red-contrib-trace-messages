<script setup>
const emit = defineEmits(["click-toggle"]);

import { ref, computed, watch } from 'vue';
import { useTraceStore } from '../store/trace';

const url = ref("")

const isRegisterModalOpen = ref(false);
const closeModal = () => (isRegisterModalOpen.value = false);
watch(isRegisterModalOpen, () => (url.value = traceStore.getActiveUrl))

const traceStore = useTraceStore();
const registerUrl = () => {
  traceStore.setActiveUrl(url.value);
  traceStore.connect();
  isRegisterModalOpen.value = false;
};
</script>

<template>
  <v-app-bar color="red-darken-4" title="Message trace UI">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="emit('click-toggle')"></v-app-bar-nav-icon>
    </template>
    <v-dialog v-model="isRegisterModalOpen" width="auto">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-badge dot :color="traceStore.getConnectionStateUi.color">
            <v-icon :icon="traceStore.getConnectionStateUi.icon"></v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card width="600" class="mx-auto">
        <v-card-title>Connect to SSE trace URL</v-card-title>
        <v-card-subtitle>
          <p v-if="traceStore.getActiveUrl">{{ traceStore.getConnectionStateUi.text }} {{ traceStore.getActiveUrl }}</p>
          <p v-else>No URL registered yet</p>
        </v-card-subtitle>
        <v-card-text>
          <v-text-field label="Enter a URL" v-model="url" hide-details="auto"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green-darken-2" @click="registerUrl">Connect</v-btn>
          <v-btn class="justify-self-end" color="red-darken-2" @click="closeModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>
