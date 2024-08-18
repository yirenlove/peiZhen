<script setup lang="ts">
import { useRouter } from 'vue-router';
import useStore from '../store';

// 定义props
defineProps<{
    menuData: any,
    index: string
}>()

const store = useStore()
// 拿到路由实例
const router = useRouter()
const handleClick = (param: any,index:string) => {
    router.push(param.meta.path)
    store.updateMenuactive(index)
    store.selectMenu.find((item: any) => item.meta.path === param.meta.path) ? '' : store.selectMenu.push(param)
}
</script>

<template>
    <template v-for="item in menuData">
        <el-menu-item :index="`${index}-${item.meta.id}`" v-if="!item.children || item.children.length === 0"
            :key="`${index}-${item.meta.id}`" @click="handleClick(item, `${index}-${item.meta.id}`)">
            <i :class="`iconfont ${item.meta.icon}`" style="margin-right: 5px;font-size: 20px;"></i>
            <span>{{ item.meta.name }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="`${index}-${item.meta.id}`">
            <template #title><i :class="`iconfont ${item.meta.icon}`"
                    style="margin-right: 5px;font-size: 20px;"></i><span>{{
                        item.meta.name
                    }}</span></template>
            <tree-menu :index="`${index}-${item.meta.id}`" :menu-data="item.children"></tree-menu>
        </el-sub-menu>
    </template>
</template>

<style lang="less" scoped>

</style>