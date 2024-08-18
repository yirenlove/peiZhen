<script setup lang="ts">
import treeMenu from './treeMenu.vue'
import { computed } from 'vue';
import useStore from '../store';

const store = useStore()
const menuData = computed(()=>store.routerList)
</script>

<template>
  <el-menu :collapse="store.isCollapse" active-text-color="#ffd04b" background-color="#545c64" class="aside-container"
    :default-active="store.menuActive" text-color="#fff" >
    <p class="logo">陪诊服务</p>
    <tree-menu index="1" :menuData="menuData"></tree-menu>
  </el-menu>
</template>

<style scoped lang="less">
.logo {
  font-size: large;
  text-align: center;
  padding: 10px;
  color: #fff;
}
</style>