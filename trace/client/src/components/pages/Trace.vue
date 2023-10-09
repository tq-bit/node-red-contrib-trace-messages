<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTraceStore } from '../../store/trace';

const traceStore = useTraceStore();
const router = useRouter()

const activeTrace = computed(() => traceStore.getTraceById(+useRoute().params.id));

const hasChangedProperty = (item) => {
	return item?.delta?.find(deltaEntry => deltaEntry.typeHasChanged || deltaEntry.valueHasChanged)
};

const stringifiedValue = (entry) =>  computed(() => {
	return typeof entry === 'object' ? JSON.stringify(entry) : entry
});

const onClickNavBack = () => {
  router.push('/')

}
</script>

<template>
	<v-banner sticky lines="two" color="theme">
    <v-icon class="mr-2" icon="mdi-arrow-left" @click="onClickNavBack"></v-icon>
		<v-banner-text>
			Trace for message {{ activeTrace?.id }} from {{ activeTrace?.receivedAt }}
		</v-banner-text>
	</v-banner>
	<v-timeline class="pa-2" align="start">
		<v-timeline-item v-for="(item, index) in activeTrace?.list" :key="index" icon="mdi-info" :dot-color="hasChangedProperty(item) ? 'blue-darken-4' : 'green-darken-4'">

			<v-alert density="compact" border="start" variant="tonal" :color="hasChangedProperty(item) ? 'blue-darken-4' : 'green-darken-4'" class="mb-2" :text="`'${item.sourceNode.name ? item.sourceNode.name : new String()}' (${item.sourceNode.type
				}) to '${item.destNode.name}' (${item.destNode.type})`">
			</v-alert>

			<v-expansion-panels variant="inset" multiple>
				<v-expansion-panel v-for="entry in item.delta" :key="entry.propertyPath" :disabled="!entry.typeHasChanged && !entry.valueHasChanged">
					<v-expansion-panel-title color="gray">
						<span class="mr-2">
							{{ entry.propertyPath }}
						</span>
						<v-chip size="x-small" class="mr-2" color="green" v-if="entry.propertyAdded">New</v-chip>
						<v-chip size="x-small" class="mr-2" color="red" v-if="entry.propertyRemoved">Removed</v-chip>
						<v-chip size="x-small" class="mr-2" color="orange" v-if="entry.typeHasChanged">Changed type</v-chip>
						<v-chip size="x-small" class="mr-2" color="purple"  v-if="entry.valueHasChanged">Changed value</v-chip>
					</v-expansion-panel-title>
					<v-expansion-panel-text>
						<v-list lines="three">
							<v-list-item v-if="entry.typeHasChanged" title="New type detected" :subtitle="`Type changed from '${entry.previousType}' to '${entry.currentType}'`">
							</v-list-item>
							<v-divider v-if="entry.typeHasChanged"></v-divider>
							<v-list-item v-if="entry.valueHasChanged" title="New value detected" :subtitle="`Value changed from '${stringifiedValue(entry.previousValue).value}' to '${stringifiedValue(entry.currentValue).value}' `">
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
