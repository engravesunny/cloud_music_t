import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import PromiseControl from './plugin/promise'

import '@/style/index.css'
import '@/style/root.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(PromiseControl);
app.use(router)
app.use(createPinia())
app.mount('#app')


