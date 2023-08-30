<script setup>
import { onMounted } from 'vue';
import { useTraceStore } from '../../store/trace';
import { useRouter } from 'vue-router';

const traceStore = useTraceStore();
const router = useRouter();

const handleOpenMessageTrace = (id) => router.push(`/trace/${id}`)

onMounted(() => traceStore.connect());
</script>

<template>
	<h1>Home Page</h1>
	<v-list>
		<v-list-item
			v-for="trace in traceStore.traceLists"
			:key="trace.id"
      :link="true"
			:item-value="trace.id"
			:title="`Message # ${trace.id}`"
			:subtitle="`Received at ${trace.receivedAt}`"
      @click="handleOpenMessageTrace(trace.id)"
		></v-list-item>
	</v-list>
</template>