<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTraceStore } from '../../store/trace';

const traceStore = useTraceStore();

const activeTrace = computed(() => traceStore.getTraceById(+useRoute().params.id));

const hasChangedProperty = (item) => {
	return item?.delta?.find(deltaEntry => deltaEntry.typeHasChanged || deltaEntry.valueHasChanged)
};
</script>

<template>
	<v-timeline class="pa-2" align="start">
		<v-timeline-item v-for="(item, index) in activeTrace?.list" :key="index" icon="mdi-info" :dot-color="hasChangedProperty(item) ? 'orange-darken-2' : 'green-darken-2'">

			<v-alert :title="`Step ${index + 1}`" border="start" variant="tonal" :color="hasChangedProperty(item) ? 'orange-darken-2' : 'green-darken-2'" class="mb-2" :text="`'${item.sourceNode.name ? item.sourceNode.name : new String()}' (${item.sourceNode.type
				}) to '${item.destNode.name}' (${item.destNode.type})`">
			</v-alert>

			<v-expansion-panels variant="inset" multiple>
				<v-expansion-panel v-for="entry in item.delta" :key="entry.propertyPath" :disabled="!entry.typeHasChanged && !entry.valueHasChanged">
					<v-expansion-panel-title color="gray">
						<span class="mr-2">
							{{ entry.propertyPath }}
						</span>
						<v-chip size="x-small" class="mr-2" v-if="entry.propertyAddedOrRemoved">New / Removed</v-chip>
						<v-chip size="x-small" class="mr-2" v-if="entry.typeHasChanged">Changed type</v-chip>
						<v-chip size="x-small" class="mr-2" v-if="entry.valueHasChanged">New value</v-chip>
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<v-list lines="three">
							<v-list-item v-if="entry.typeHasChanged" title="New type detected" :subtitle="`Type changed from '${entry.previousType}' to '${entry.currentType}'`">
							</v-list-item>
							<v-divider v-if="entry.typeHasChanged"></v-divider>
							<v-list-item v-if="entry.valueHasChanged" title="New value detected" :subtitle="`Value changed from '${entry.previousValue }' to '${entry.currentValue}' `">
							</v-list-item>
						</v-list>
					</v-expansion-panel-text>

				</v-expansion-panel>
			</v-expansion-panels>

		</v-timeline-item>
	</v-timeline>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
