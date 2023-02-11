import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import { useQWiki } from "./ts/qwiki";

const app = createApp(App);
const qwiki = useQWiki();

app.use(router);
app.use(qwiki);

app.mount("#app");
