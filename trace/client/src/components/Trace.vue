<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTraceStore } from '../store/trace';

const traceStore = useTraceStore();

const activeTrace = computed(() => traceStore.getTraceById(+useRoute().params.id));
</script>

<template>
	<v-timeline align="start">
		<v-timeline-item v-for="(item, index) in activeTrace?.list" :key="index" fill-dot>
			<v-card :title="`Step ${index + 1}`" :subtitle="`'${item.sourceNode.name ? item.sourceNode.name : new String()}' (${item.sourceNode.type
				}) to '${item.destNode.name}' (${item.destNode.type})`">

					<v-expansion-panels variant="inset" multiple>
						<v-expansion-panel v-for="entry in item.delta" :key="entry.propertyPath" :disabled="!entry.typeHasChanged && !entry.valueHasChanged">
							<v-expansion-panel-title color="red-darken-2">
								<span class="mr-2">
									{{ entry.propertyPath }}
								</span>
								<v-chip size="x-small" class="mr-2" v-if="entry.propertyAddedOrRemoved">New / Removed</v-chip>
								<v-chip size="x-small" class="mr-2" v-if="entry.typeHasChanged">Changed type</v-chip>
								<v-chip size="x-small" class="mr-2" v-if="entry.valueHasChanged">New value</v-chip>
							</v-expansion-panel-title>
							<v-expansion-panel-text>
								<v-list lines="three">
									<v-list-item v-if="entry.typeHasChanged">
										<v-list-item-title>New type detected</v-list-item-title>
										<v-list-item-text>Type changed from "{{ entry.previousType }}" to "{{ entry.currentType }}"</v-list-item-text>
									</v-list-item>
									<v-divider v-if="entry.typeHasChanged"></v-divider>
									<v-list-item v-if="entry.valueHasChanged">
										<v-list-item-title>New value detected</v-list-item-title>
										<v-list-item-text>Value changed from "{{ entry.previousValue }}" to "{{ entry.currentValue }}"</v-list-item-text>
									</v-list-item>
								</v-list>
							</v-expansion-panel-text>

						</v-expansion-panel>
					</v-expansion-panels>

			</v-card>
		</v-timeline-item>
	</v-timeline>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
