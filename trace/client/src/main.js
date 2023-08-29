import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/router';

// Vuetify Imports
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
	components,
	directives,
	icons: { defaultSet: 'mdi' },
});

createApp(App).use(router).use(createPinia()).use(vuetify).mount('#app');
