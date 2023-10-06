<script setup>
import { ref, computed, watch } from 'vue';
import { useTraceStore } from '../../store/trace';
import { useRouter } from 'vue-router';

const router = useRouter();
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
const connectionColor = computed(() => {
	if(traceStore.connectionState === 0) {
		return "blue-darken-2";
	}

	if(traceStore.connectionState === 1) {
		return "green-darken-1";
	}
	if(traceStore.connectionState === 2) {
		return "red-darken-2";
	}
})

const connectionText = computed(() => {
	if(traceStore.connectionState === 0) {
		return "Not connected";
	}
	if(traceStore.connectionState === 1) {
		return "Connected";
	}
	if(traceStore.connectionState === 2) {
		return "Error";
	}
})

const handleOpenMessageTrace = (id) => router.push(`/trace/${id}`)

</script>

<template>
	<v-banner lines="one" icon="mdi-lock" color="red-darken-2" class="my-4">
		<v-banner-text>
			Observe your Node-Red instance using SSE - nodes.
		</v-banner-text>

		<template v-slot:actions>

		</template>
	</v-banner>
	<v-table density="comfortable">
		<thead>
			<tr>
				<th class="text-left">
					ID
				</th>
				<th class="text-left">
					Trace size
				</th>
				<th class="text-left">
					Received at
				</th>
			</tr>
		</thead>

		<tbody>
			<tr v-for="trace in traceStore.traceLists" :key="trace.id" @click="handleOpenMessageTrace(trace.id)">
				<td>{{ trace.id }}</td>
				<td>{{ trace.list.length }} modification(s)</td>
				<td>{{ trace.receivedAt }}</td>
			</tr>
		</tbody>
	</v-table>
</template>