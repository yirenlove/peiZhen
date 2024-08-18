<script setup lang='ts'>
import { FormInstance } from 'element-plus';
import { ref, onMounted, nextTick } from 'vue';
import { menuList } from '../../../api';


const visible = ref(false)
const formData = ref({
    name: '',
    permissions: ''
})
const treeRef = ref()
const permissionData = ref([
    {
        label: '控制台',
        id: 1
    },
    {
        label: '权限管理',
        id: 2,
        disabled: true,
        children: [
            {
                label: '账号管理',
                id: 3,
                disabled: true
            },
            {
                label: '菜单管理',
                id: 4,
                disabled: true
            }
        ]
    },
    {
        label: '陪诊'
    }
])
// 表单校验
const formRef = ref<FormInstance>()
const rules = ref({
    name: [
        { required: true, message: '请填写权限名称', trigger: 'blur' },
    ]
})

const confirm = async (formRef: any) => {
    if (!formRef) return
    await formRef.validate((valida: any, fields: any) => {
        if (valida) {
            const selectList = treeRef.value.getCheckedKeys()
            JSON.stringify(selectList)
        } else {
            console.log('error,fail to submit', fields)
        }
    })

}

const tableData = ref({
    list: [],
    total: 4
})

const paginationData = ref({
    pageNum: 1,
    pageSize: 10
})
const getTableData = () => {
    menuList(paginationData).then((res: any) => {
        tableData.value.list = res.list
        tableData.value.total = res.total
    })
}

//打开弹窗dialog
const open = (data: any = null) => {
    visible.value = true
    if (data) {
        // 弹窗打开form是异步
        console.log(data);

        nextTick(() => {
            formData.value.name = data.name
            treeRef.value.setCheckedKeys(data.permissions)
        })
    }

}
// 关闭弹窗
const beforeClose = () => {
    visible.value = false
    formRef.value?.resetFields()
    treeRef.value.setCheckedKeys([4, 3])
}
// 权限列表
const data = ref([
    {
        id: 1,
        name: '管理员',
        permissionName: '控制台'
    },
    {
        id: 2,
        name: '管理员',
        permissionName: '控制台'
    },
    {
        id: 3,
        name: '管理员',
        permissionName: '控制台'
    },
    {
        id: 4,
        name: '管理员',
        permissionName: '控制台'
    }
])

// 下方页码数据
const handleSizeChange = (val:number)=>{
    paginationData.value.pageSize = val
    
}
const handleCurrentChange = (val:number)=>{
    paginationData.value.pageNum = val
}
onMounted(() => {

})
</script>

<template>
    <PanelHead></PanelHead>
    <el-button @click="open()"><i class="iconfont icon-filter-funnel-01"></i>&nbsp新增</el-button>
    <el-dialog v-model="visible" title="添加权限" :before-close="beforeClose">
        <el-form :rules="rules" ref="formRef" :model="formData" label-width="auto" label-position="left">
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" placeholder="请填写权限名称" />
            </el-form-item>
            <el-form-item label="权限" prop="premissions">
                <el-tree ref="treeRef" node-key="id" :data="permissionData" :show-checkbox="true"
                    :default-checked-keys="[3, 4]" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="confirm(formRef)">提交</el-button>
        </template>
    </el-dialog>
    <el-table :data="data" stripe style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissionName" label="菜单权限" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="console.log(scope)">操作</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination style="justify-content: flex-end;" v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize" layout="total, prev, pager, next" :total="tableData.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" size="small" />
</template>

<style scoped></style>