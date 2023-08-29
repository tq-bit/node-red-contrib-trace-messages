// stores/counter.js
import { defineStore } from 'pinia';

export const useTraceStore = defineStore('trace', {
	state: () => ({
		traceLists: [
			{
				id: 0,
				receivedAt: new Date().toLocaleString(),
				list: [],
			},
		],
		error: null,
	}),
	actions: {
		connect(endpoint) {
			const events = new EventSource(endpoint || 'http://localhost:1880/api/sse');

			events.onmessage = (event) => {
				const data = JSON.parse(event.data);
				const entry = {
					receivedAt: new Date().toLocaleString(),
					id: this.traceLists.length + 1,
					list: data.traceList,
				};
				this.traceLists.push(entry);
			};
		},
	},
});
