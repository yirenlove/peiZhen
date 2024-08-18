import { createApp, toRaw } from 'vue'
import './style.css'
import App from './App.vue'
import PanelHead from './components/PanelHead.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import useStore from './store'




const app = createApp(App)
app.use(createPinia().use(piniaPluginPersistedstate))
const store = useStore()


const SotreItem = localStorage.getItem('store')
if(SotreItem){
    console.log(JSON.parse(SotreItem).routerList);
    
    store.dynamicMenu(JSON.parse(SotreItem).routerList)
    store.routerList.forEach(e =>{
        router.addRoute('main', toRaw(e))
    })
    console.log(router);
}
app.use(router)
app.component('PanelHead',PanelHead)
app.mount('#app')
console.log('main end');


