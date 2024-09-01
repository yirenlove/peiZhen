<script setup lang='ts'>
import { reactive, ref } from 'vue';

const toggle = ref(false);
const handleChange = () => {
    toggle.value = !toggle.value;
}

const userData = ref({
    email: '',
    passw: '',
    code: ''
})


const validText = ref<{ text: string, time: number }>({
    text: '发送验证码',
    time: 60
})
let flag = false
const decrease = () => {
    const rgex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (flag || !rgex.test(userData.value.email)) return
    const time = setInterval(() => {
        validText.value.time -= 1
        if (validText.value.time === 0) {
            validText.value.time = 60
            validText.value.text = '发送验证码'
            flag = false
            clearInterval(time)
        }
        validText.value.text = validText.value.time + 's'
    }, 1000);
    flag = true
    getCode(JSON.stringify({ email: userData.value.email })).then(res => {
        ElMessage.success('发送成功')
        console.log(res);

    })
}

// 表单校验
const nameValidator = (rule: any, value: string, callback: any) => {
    if (!value) {
        callback(new Error('请输入邮箱'))
    } else {
        const rgex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        rgex.test(value) ? callback() : callback(new Error('邮箱格式错误'))
    }
}
const passwValidator = (rule: any, value: string, callback: any) => {
    if (!value) {
        callback(new Error('请输入密码'))
    } else {
        const rgex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        rgex.test(value) ? callback() : callback(new Error('密码必须为6-16位字母和数字组合'))
    }
}
const rules = reactive({
    email: [{ validator: nameValidator, trigger: 'blur' }],
    passw: [{ validator: passwValidator, trigger: 'blur' }],
})

// 提交表单
import { getCode, signUp, login, menuPermission } from '../../api';
import { ElMessage, FormInstance } from 'element-plus';
import { useRouter } from 'vue-router';
import useStore from '../../store';
const router = useRouter()
const store = useStore()
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (!toggle.value) {
                console.log(JSON.stringify(userData.value))
                login(JSON.stringify(userData.value)).then((data: any) => {
                    ElMessage.success('登录成功')
                    // 保存token信息
                    localStorage.setItem('token', data.data.token)
                    menuPermission().then(res => {
                        store.dynamicMenu(JSON.parse(res.data.permissions))
                        store.routerList.forEach((e: any) => {
                            router.addRoute('main', e)
                        })
                        router.push('/dashboard')
                    })
                })
            }
            else {
                signUp(JSON.stringify(userData.value)).then(res => {
                    console.log(res)
                    ElMessage('注册成功')
                    toggle.value = !toggle.value
                })
            }
        } else {
            console.log('error submit!', fields)
        }
    })

}
const formRef = ref<FormInstance>()

</script>

<template>
    <el-row justify="center" align="middle">
        <el-card>
            <template #header>
                <div class="car-header">
                    <img src="https://hellorfimg.zcool.cn/provider_image/preview260/2239655931.jpg?x-image-process=image/format,webp"
                        alt="背景图片">
                </div>
            </template>
            <div class="jump-link"><el-link :underline="false" @click="handleChange" type="primary">{{
                !toggle ? '注册账号' : '返回登录' }}</el-link></div>
            <div class="main-body">
                <el-form ref="formRef" :model="userData" label-width="auto" :rules="rules">
                    <el-form-item prop="email"><el-input v-model="userData.email" placeholder="请输入邮箱">
                            <template #prefix>
                                <i class="iconfont icon-icon-test1"></i>
                            </template>
                        </el-input></el-form-item>
                    <el-form-item prop="passw"><el-input type="passw" :show-passw="true" v-model="userData.passw"
                            placeholder="请输入密码">
                            <template #prefix>
                                <i class="iconfont icon-icon-test"></i>
                            </template>
                        </el-input></el-form-item>
                    <el-form-item v-show="toggle" prop="code"><el-input v-model="userData.code" placeholder="请输入验证码">
                            <template #prefix>
                                <i class="iconfont icon-icon-test"></i>
                            </template>
                            <template #append>
                                <span style="cursor: pointer;" @click="decrease">{{ validText.text }}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="submit">
                        <el-button type="primary" @click="submitForm(formRef)">{{ !toggle ? '登录' : '注册' }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </el-row>
</template>

<style scoped>
.el-row {
    height: 100%;

    .jump-link {
        padding-right: 5px;
        text-align: right;
    }

    .el-card {
        max-width: 480px;
    }

    .el-button {
        width: 100%;
    }
}
</style>