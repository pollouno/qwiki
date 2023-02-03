import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import storage from "./ts/storage";

//import "./assets/main.css";
storage.load();

const app = createApp(App);

app.use(router);
app.mount("#app");
