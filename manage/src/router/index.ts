import {createRouter,createWebHashHistory,RouteRecordRaw} from 'vue-router'

const {routerList} = JSON.parse(localStorage.getItem('store') || '{}') 
 

const routes:Array<RouteRecordRaw> = [
    {
        path:'/',
        component:()=>import('../views/Main.vue'),
        name:'main',
        redirect:():string=>{
            if (routerList[0]?.children){
                return routerList[0].children[0].meta.path 
            }
            else {
                return routerList[0].meta.path
            }
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
// import guardRule from '../guard'
// router.beforeEach(guardRule)

export default router