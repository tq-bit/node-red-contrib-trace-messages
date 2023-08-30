// stores/counter.js
import { defineStore } from 'pinia';

export const useTraceStore = defineStore('trace', {
	state: () => ({
		url: "",
		traceLists: [
			{
				id: 0,
				receivedAt: new Date().toLocaleString(),
				list: [],
			},
		],
		error: null,
	}),
	getters: {
		getTraceById: (state) => (id) => state.traceLists.find((trace) => trace.id === id),
		getActiveUrl: state => state.url,
	},
	actions: {
		setActiveUrl(url) {
			this.url = url;
		},
		connect() {
			if(this.getActiveUrl) {
				const events = new EventSource(this.getActiveUrl);
				events.onmessage = (event) => {
					const data = JSON.parse(event.data);
					const entry = {
						receivedAt: new Date().toLocaleString(),
						id: this.traceLists.length,
						list: data.traceList,
					};
					this.traceLists.push(entry);
				};
			}
		},
	},
});
