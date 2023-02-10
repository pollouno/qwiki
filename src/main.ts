import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import storage from "./ts/storage";
import { useQWiki } from "./ts/qwiki";

//import "./assets/main.css";
storage.load();

const app = createApp(App);
const qwiki = useQWiki();

app.use(router);
app.use(qwiki);
app.mount("#app");
