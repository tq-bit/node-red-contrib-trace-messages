<script setup>
import { ref, watch } from 'vue';
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

const handleOpenMessageTrace = (id) => router.push(`/trace/${id}`)

</script>

<template>
	<v-banner lines="one" icon="mdi-lock" color="red-darken-2" class="my-4">
		<v-banner-text>
			Observe your Node-Red instance using SSE - nodes.
		</v-banner-text>

		<template v-slot:actions>
			<v-dialog v-model="isRegisterModalOpen" width="auto">
				<template v-slot:activator="{ props }">
					<v-btn color="red-darken-2" v-bind="props">
						Set URL
					</v-btn>
				</template>

				<v-card width="400" class="mx-auto">
					<v-card-text>
						{{ url }}
						<v-text-field label="Enter a URL" v-model="url" hide-details="auto"></v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-btn color="green-darken-2" @click="registerUrl">Register</v-btn>
						<v-btn class="justify-self-end" color="red-darken-2" @click="closeModal">Cancel</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
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