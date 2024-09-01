import { createApp, toRaw } from 'vue'
import './style.css'
import App from './App.vue'
import PanelHead from './components/PanelHead.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import useStore from './store'
import router from './router/index'



const app = createApp(App)
app.use(createPinia().use(piniaPluginPersistedstate))
const store = useStore()

const SotreItem = localStorage.getItem('store')
if(SotreItem){    
    store.dynamicMenu(JSON.parse(SotreItem).routerList)
    store.routerList.forEach((e:any) =>{
        router.addRoute('main', toRaw(e))
    })
}
app.use(router)
app.component('PanelHead',PanelHead)
app.mount('#app')
console.log('main end');


