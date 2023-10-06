// stores/counter.js
import { defineStore } from 'pinia';

export const useTraceStore = defineStore('trace', {
	state: () => ({
		event: null,
		url: "",
		connectionState: 0,
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
		getConnectionState: state => (state.connectionState),
		getConnectionStateUi: state => {
			if (state.connectionState === 0) {
				return {
					color: "blue-darken-2",
					icon: "mdi-access-point",
					text: "Not connected"
				}
			}

			if (state.connectionState === 1) {
				return {
					color: "green-darken-1",
					icon: "mdi-access-point-check",
					text: "Connected"
				}
			}

			return {
				color: "orange-darken-2",
				icon: "mdi-access-point-minus",
				text: "Error"
			}
		}
	},
	actions: {
		setActiveUrl(url) {
			this.url = url;
		},
		connect() {
			if(this.getActiveUrl) {
				if(this.event) this.event.close();
				this.event = new EventSource(this.getActiveUrl);
				this.event.onopen = () => this.connectionState = this.event.readyState;

				this.event.onmessage = (event) => {
					this.connectionState = this.event.readyState;
					const data = JSON.parse(event.data);
					const entry = {
						receivedAt: new Date().toLocaleString(),
						id: this.traceLists.length,
						list: data.traceList,
					};
					this.traceLists.push(entry);
				};

				this.event.onclose = () => {
					this.connectionState = this.event.readyState;
				}
				this.event.onerror = () => {
					this.connectionState = this.event.readyState;
				}
			}
		},
	},
});
