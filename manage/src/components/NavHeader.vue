<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useStore from '../store';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const store = useStore()
const route = useRoute()
const router = useRouter()
// 控制侧边栏的显示与否
const handleClick = () => {
    store.isCollapse = !store.isCollapse

}
/*
 * 关闭菜单
 * @param item  
*/
const handleClose = (item: { meta: { path: string } }) => {
    const { selectMenu: setList } = storeToRefs(store)
    if (route.path === item.meta.path) {
        const idx = setList.value.indexOf(item)
        setList.value.splice(idx, 1)
        store.closeMenu(item)
        if (setList.value[idx]) router.push(setList.value[idx].meta.path)
        else setList.value.length ? router.push(setList.value[idx - 1].meta.path) : router.push('/')
    }
    else {
        store.closeMenu(item)
    }
}
const logout = (command: any) => {
    if (command === 'yes') {
        localStorage.removeItem('token')
        localStorage.removeItem('store')
        router.replace('/login')
    }
}
</script>

<template>
    <header class="nav-container">
        <div class="left flex">
            <div @click="handleClick" style="font-size: 20px;cursor: pointer; margin-right: 10px;"><i
                    class="iconfont icon-tool-01"></i>
            </div>
            <ul class="flex">
                <li v-for="item of store.selectMenu" style="height: 100%;margin-right: 10px;">
                    <i :class="`iconfont ${item.meta.icon}`"></i>
                    <router-link :to="item.meta.path" :class="{ active: route.path == item.meta.path }"
                        style="height: 100%;line-height: 40px; margin-left:5px;margin-right: 5px;" >{{ item.meta.name
                        }}</router-link>
                    <i @click="handleClose(item)" class="iconfont icon-mtiIcon-caozuo-guanbi_solid close"></i>
                </li>
            </ul>
        </div>
        <div class="right">
            <el-dropdown @command="logout">
                <div class="el-dropdown-link flex">
                    <el-avatar>
                        <img src="https://img.alicdn.com/imgextra/i1/O1CN01EI93PS1xWbnJ87dXX_!!6000000006451-2-tps-150-150.png"
                            alt="用户头像">
                    </el-avatar>
                    <p class="user-name">admin</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="yes">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </header>
</template>

<style scoped lang="less">
.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.active {
    color: skyblue;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    .user-name {
        margin-left: 8px;
    }

    .left {
        height: 100%;

        ul {
            height: 100%;
        }

        li {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
        }

        .close {
            // transition: all 0.3s;
            visibility: hidden;
        }

        li:hover {
            .close {
                visibility: visible;
            }

            color:skyblue;
            background-color: rgba(64, 158, 255, .1);
        }
    }
}
</style>
