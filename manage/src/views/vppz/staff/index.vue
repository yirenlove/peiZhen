<script lang="ts" setup>
import { ref } from 'vue';

const formRef = ref()
const dialogVisible = ref(true)
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
    console.log(123)
}
function confirm(ref: any) {
    console.log(ref);

}
</script>

<template>
    <el-dialog v-model="dialogVisible" title="添加人员" width="500" :before-close="handleClose">
        <el-form ref="formRef" :model="formData" label-width="auto" label-position="left">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-button type="primary" v-if="!formData.avatar">点击上传</el-button>
                <el-image v-else :src="formData.avatar"></el-image>
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
</template>

<style scoped></style>