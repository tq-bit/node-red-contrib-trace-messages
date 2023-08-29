// stores/counter.js
import { defineStore } from 'pinia'

export const useTraceStore = defineStore('trace', {
  state: () =>  ({ traceLists: [], error: null }),
  actions: {
    connect(endpoint) {
      const events = new EventSource(endpoint || "http://localhost:1880/api/sse");

      events.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.traceLists.push(data);
      }
    }
  },
})