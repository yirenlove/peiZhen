import {createRouter,createWebHashHistory,RouteRecordRaw} from 'vue-router'

const store = localStorage.getItem('store')

const routes:Array<RouteRecordRaw> = [
    {
        path:'/',
        component:()=>import('../views/Main.vue'),
        name:'main',
        redirect:()=>{
            if(store){
                const route = JSON.parse(store).routerList[0]
                if(route.children) return route.children[0].path 
                else return route.path 
            }
            return ''
        },
        children:[
           // ... 
        ]
    },
    {
        path:'/login',
        component:()=>import('../views/login/index.vue'),
        name:'login'
    }
]


const router = createRouter({
    history:createWebHashHistory(),
    routes
})

//  全局路由守卫
import guardRule from '../guard'
router.beforeEach(guardRule)

export default router