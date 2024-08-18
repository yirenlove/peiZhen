<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { authAdmin } from '../../../api';
import moment from 'moment';

const visible = ref(false)
onMounted(() => {
    for(let i =0;i<options.value.length;i++){
        options.value[i].create_time = moment(options.value[i].create_time).format('YYYY-MM-DD')
    }
})
const options = ref<any>([
    {
        "create_time": 1721811358000,
        "id": 1,
        "active": 1,
        "mobile": "13623623252",
        "name": "allen",
        "permissions_id": 0
    }
])
const permissionsName = (id: any) => {
    const data = options.value.find((el: any) => el.id === id)
    return data ? data.name : '超级管理员'
}
const formRef = ref()
// 关闭弹窗
const beforeClose = () => {
    visible.value = false
    formRef.value?.resetFields()
}

const formData = ref({
    name: '',
    premissions_id: '',
    mobile:''
})  

const confirm = (formRef: any) => {
    
}
const paginationData = ref({
    pageNum: 1,
    pageSize: 10
})
const tableData = ref({
    list: [],
    total: 4
})
// 下方页码数据
const handleSizeChange = (val: number) => {
    paginationData.value.pageSize = val

}
const handleCurrentChange = (val: number) => {
    paginationData.value.pageNum = val
}
</script>

<template>

    <el-table :data="options" stripe style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{ permissionsName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active?'success':'danger'">
                    {{ scope.row.active ? '正常' : '异常' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间">
            <template #default="scope">
                <span>{{ scope.row.create_time }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="formData = { mobile: scope.row.mobile, name: scope.row.name, premissions_id: permissionsName(scope.row.permissions_id) },visible = true">操作</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model="visible" title="添加权限" :before-close="beforeClose">
        <el-form ref="formRef" :model="formData" label-width="auto" label-position="left">
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="formData.mobile"  disabled />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="formData.name" placeholder="" />
            </el-form-item>
            <el-form-item label="菜单权限" prop="id">
                <el-select v-model="formData.premissions_id" placeholder="选择权限" style="width: 240px">
                    <el-option v-for="item in options" :key="item.id"  :value="permissionsName(item.permissions_id)"/>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="confirm(formRef)">提交</el-button>
        </template>
    </el-dialog>
    <el-pagination style="justify-content: flex-end;" v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize" layout="total, prev, pager, next" :total="tableData.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" size="small" />
</template>

<style scoped></style>