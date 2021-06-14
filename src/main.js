import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./stores";

//import VueCompositionApi from '@vue/composition-api'

createApp(App)
	.use(router)
	.use(store)
	.mount("#app");