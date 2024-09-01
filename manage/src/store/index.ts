import { defineStore } from "pinia";
import { ref } from "vue";

const useStore = defineStore("store",()=>{
    const isCollapse = ref<boolean>(false);
    const selectMenu = ref<any>([]);
    const routerList = ref<any>([])
    const menuActive = ref<string>('')
    function closeMenu(item:object){
        if(selectMenu.value.indexOf(item)!==-1){
            selectMenu.value.splice(item,1);
        }
    }
    function dynamicMenu(payload:any){
        // 导入 views 文件夹的 vue 文件
        const modules = import.meta.glob('../views/**/**/*.vue')
        console.log(modules);
        function setComponent(route:any){
                route.forEach((e:any) => {
                if(e.children){
                    setComponent(e.children)
                }else {
                    const key = `../views${e.meta.path}/index.vue`
                    e.component = modules[key]
                }
            });
        }
        setComponent(payload)
        routerList.value = payload
    }
    function updateMenuactive(payload:string){
        menuActive.value = payload
    }
    return { isCollapse, selectMenu,closeMenu,dynamicMenu,routerList,menuActive,updateMenuactive }
},{
    persist:true
});

export default useStore;