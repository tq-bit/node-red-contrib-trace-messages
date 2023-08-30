<script setup>
import { computed } from 'vue';
import {useRoute} from 'vue-router'
import { useTraceStore } from '../store/trace';

const traceStore = useTraceStore();

const activeTrace = computed(() =>  traceStore.getTraceById(+useRoute().params.id))
</script>

<template>
	<h1>Trace</h1>
	activeTrace: {{ activeTrace }}
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
