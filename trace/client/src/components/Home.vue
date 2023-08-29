<script setup>
import { onMounted } from 'vue';
import { useTraceStore } from '../store/trace';

const traceStore = useTraceStore()

onMounted(() => traceStore.connect())
</script>

<template>
  <h1>Home Page</h1>
  <ul>
    <li v-for="(trace) in traceStore.traceLists" :key="trace.id">
    {{ trace.receivedAt }} | {{ trace.id }}
  </li>
  </ul>
  {{ traceStore.traceLists }}
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
