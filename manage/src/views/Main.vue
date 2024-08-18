<script setup lang='ts'>
import Aside from '../components/Aside.vue';
import NavHeader from '../components/NavHeader.vue';
</script>

<template>
    <div class="common-layout">
        <el-container>
            <Aside></Aside>
            <el-container>
                <el-header height="40px">
                    <NavHeader></NavHeader>
                </el-header>
                <el-main>
                    <RouterView></RouterView>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<style scoped>
.common-layout {
    height: 100%;
    .el-container {
        height: 100%;
    }
}
</style>