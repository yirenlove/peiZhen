<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';

const formRef = ref()
const dialogVisible = ref(false)

const formData = ref({
    id: '',
    mobile: '',
    active: 1,
    age: 20,
    avatar: '',
    name: '',
    sex: ''
})
function handleClose() {
    dialogVisible.value = false
    formRef.value.resetFields()
}
function deleteConfirm() {
    if (selectList.value.length === 0) {
        ElMessage.error('请选择至少一项')
        return
    }
    ElMessage.success('成功')
}
function deleteCancel() {
    ElMessage.error('取消操作')
}
const rules = {
    name: [{ required: true, trigger: 'blur', message: '请填写姓名' }],
    avatar: [{ required: true, message: '请上传头像' }],
    sex: [{ required: true, trigger: 'blur', message: '请选择性别' }],
    mobile: [{ required: true, trigger: 'blur', message: '请填写手机号' }],
}

const photos = ref([
    {
        id: 1,
        url: 'http://img.92fa.com/pic/TX107_07.jpg'
    },
    {
        id: 2,
        url: 'http://img.92fa.com/pic/TX107_08.jpg'
    },
    {
        id: 3,
        url: 'http://img.92fa.com/pic/TX107_25.jpg'
    },
    {
        id: 4,
        url: 'http://img.92fa.com/pic/TX107_27.jpg'
    },
    {
        id: 5,
        url: 'http://img.92fa.com/pic/TX1396_00.jpg'
    }
])
const dialogImgVisible = ref(false)
const selectId = ref<number>()
function imgConfirm() {
    formData.value.avatar = photos.value[selectId.value as number - 1].url
    dialogImgVisible.value = false
}
async function confirm(ref: any) {
    if (!ref) return
    await ref.validate((valid: boolean) => {
        if (valid) {
            ElMessage.success('提交成功')
            handleClose()
        }
        else {
            ElMessage.error('请填写完整信息')
        }
    })

}
// table 列表相关操作
const tableData = ref<any>({
    list: [],
    total: 1
})

const paginationData = ref({
    pageNum: 1,
    pageSize: 10
})

function getDadaList() {
    setTimeout(() => {
        tableData.value.list = [
            {
                id: '1',
                mobile: '14767754621',
                active: 1,
                age: 20,
                avatar: 'http://img.92fa.com/pic/TX107_08.jpg',
                name: 'jojo',
                sex: '男',
                create_time: '2023-01-01'
            },
            {
                id: '2',
                mobile: '14767754621',
                active: 1,
                age: 20,
                avatar: 'http://img.92fa.com/pic/TX107_08.jpg',
                name: 'jojo',
                sex: '男',
                create_time: '2023-01-01'
            }
        ]
    }, 1000);
}
function open(rowData = null) {
    dialogVisible.value = true
    nextTick(() => {
        if (rowData) {
            Object.assign(formData.value, rowData)
        }
    })

}
const selectList = ref<any>([])
function selectFn(arr: any[]) {

    selectList.value = arr.map(e => e.id)
    console.log(selectList.value);

}
onMounted(() => {
    getDadaList()

})


</script>

<template>
    <el-button type="primary" @click="dialogVisible = true">新增</el-button>
    <el-popconfirm title="是否删除" confirm-button-text="是" cancel-button-text="否" @confirm="deleteConfirm"
        @cancel="deleteCancel">
        <template #reference>
            <el-button type="danger">Delete</el-button>
        </template>
    </el-popconfirm>
    <el-dialog v-model="dialogVisible" title="添加人员" width="500" :before-close="handleClose">
        <el-form :rules="rules" ref="formRef" :model="formData" label-width="auto" label-position="left">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-button type="primary" v-if="!formData.avatar" @click="dialogImgVisible = true">点击上传</el-button>
                <el-image v-else :src="formData.avatar" style="width: 100px;"></el-image>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="formData.sex">
                    <el-option value="男"></el-option>
                    <el-option value="女"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="formData.age" :min="18" :max="60" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="formData.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="生效" prop="active">
                <el-radio-group v-model="formData.active">
                    <el-radio value="1">是</el-radio>
                    <el-radio value="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="confirm(formRef)">提交</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="dialogImgVisible" title="图片选择" width="680">
        <div class="img-list">
            <div v-for="item of photos" class="img-box" @click="selectId = item.id">
                <i class="iconfont icon-mti-duihao checked" v-show="item.id === selectId"
                    style="background-color: gray;"></i>
                <el-image style="width: 150px;height: 150px;" :src="item.url" :key="item.id" />
            </div>
        </div>
        <template #footer>
            <el-button @click="dialogImgVisible = false">取消</el-button>
            <el-button type="primary" @click="imgConfirm">提交</el-button>
        </template>
    </el-dialog>
    <!-- table -->
    <el-table :data="tableData.list" stripe style="width: 100%" @selection-change="selectFn">
        <el-table-column type="selection" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="avatar" label="头像">
            <template #default="scope">
                <el-image :src="scope.row.avatar" style="width: 50px;" />
            </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="active" label="状态" />
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">操作</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped lang="less">
.img-list {
    display: flex;
    flex-wrap: wrap;
}

.img-box {
    position: relative;
    margin-right: 5px;
    margin-bottom: 5px;

    .checked {
        position: absolute;
        z-index: 1;
    }
}
</style>