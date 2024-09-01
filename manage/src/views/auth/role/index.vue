<script setup lang='ts'>
import { FormInstance } from 'element-plus';
import { ref, onMounted, nextTick } from 'vue';
import { menuList, getTreeMenu, setMenu } from '../../../api';


const visible = ref(false)
const formData = ref({
    name: '',
    permissions: ''
})
const treeRef = ref()
const permissionData = ref([
    {
        label: '控制台',
        id: 1,
        disabled: true
    },
    {
        label: '权限管理',
        id: 2,
        children: [
            {
                label: '账号管理',
                id: 3,
            },
            {
                label: '菜单管理',
                id: 4,
            }
        ]
    },
    {
        label: '陪诊',
        id: 5,
        children: [
            {
                label: '订单管理',
                id: 6,
            },
            {
                label: '陪护管理',
                id: 7,
            }
        ]
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
            const permissions = JSON.stringify(selectList)
            setMenu({ name: formData.value.name, permissions })
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
    pageNumber: 1,
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
    treeRef.value.setCheckedKeys([1])
}
// 权限列表
const data = ref([
    {
        id: 'ofjejawojifjeiowaj',
        name: '管理员',
        permissionName: '控制台'
    },
    {

        name: '管理员',
        permissionName: '控制台'
    },
    {

        name: '管理员',
        permissionName: '控制台'
    },
    {

        name: '管理员',
        permissionName: '控制台'
    }
])

// 下方页码数据
const handleSizeChange = (val: number) => {
    paginationData.value.pageSize = val

}
const handleCurrentChange = (val: number) => {
    paginationData.value.pageNumber = val
}
onMounted(() => {
    // 拿树状菜单权限数据
    getTreeMenu().then(res => {
        permissionData.value = res.data
    })
    getTreeMenu().then(res => {
        console.log(res);
    })
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
                    :default-checked-keys="[1]" />
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
    <el-pagination style="justify-content: flex-end;" v-model:current-page="paginationData.pageNumber"
        :page-size="paginationData.pageSize" layout="total, prev, pager, next" :total="tableData.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" size="small" />
</template>

<style scoped></style>