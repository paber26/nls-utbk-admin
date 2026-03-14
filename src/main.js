import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import router from "./router"
import { CkeditorPlugin } from "@ckeditor/ckeditor5-vue"
import "ckeditor5/ckeditor5.css"

const app = createApp(App)
app.use(router)
// app.use(CKEditor.default || CKEditor)
app.use(CkeditorPlugin)
// app.use(CKEditor)
app.mount("#app")

// const app = createApp(App)

// app.use(CKEditor)

// app.mount("#app")
