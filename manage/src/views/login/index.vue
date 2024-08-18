<script setup lang='ts'>
import { reactive, ref } from 'vue';

const toggle = ref(false);
const handleChange = () => {
    toggle.value = !toggle.value;
}

const userData = ref({
    username: '',
    password: '',
    validCode: ''
})


const validText = ref<{ text: string, time: number }>({
    text: '发送验证码',
    time: 60
})
let flag = false
const decrease = () => {
    if (flag) return
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
    getCode(JSON.stringify({ phoneNumber: userData.value.username })).then(res => {
        ElMessage.success('发送成功')
        console.log(res);

    })
}

// 表单校验
const nameValidator = (rule: any, value: string, callback: any) => {
    if (!value) {
        callback(new Error('请输入手机号'))
    } else {
        const rgex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        rgex.test(value) ? callback() : callback(new Error('手机号格式错误'))
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
    username: [{ validator: nameValidator, trigger: 'blur' }],
    password: [{ validator: passwValidator, trigger: 'blur' }],
})

// 提交表单
import { getCode, signUp, login } from '../../api';
import { ElMessage, FormInstance } from 'element-plus';
import { useRouter } from 'vue-router';
import useStore from '../../store';
const router = useRouter()
const store = useStore()
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        store.dynamicMenu([
            {
                path: 'dashboard',
                meta: { name: '控制台', path: '/dashboard',id:1 },
                component: ''
            },
            {
                path: 'auth',
                meta: { name: '权限管理', path: '/auth',id:2 },
                children: [
                    {
                        path: 'admin',
                        component: '',
                        meta: { name: '账号管理', path: '/auth/admin',id:1 }
                    },
                    {
                        path: 'group',
                        component: '',
                        meta: { name: '角色管理', path: '/auth/group',id:2 }
                    }
                ]
            },
            {
                path:'vppz',
                meta:{name:'陪诊人员',path:'/vppz',id:3},
                children:[
                    {
                        path:'order',
                        component:'',
                        meta:{name:'订单管理',path:'/vppz/order',id:1}
                    },
                    {
                        path:'staff',
                        component:'',
                        meta:{name:'陪护管理',path:'/vppz/staff',id:2}
                    }
                ]
            }
        ])
        store.routerList.forEach(e => {
            router.addRoute('main',e)
        })
        router.push('/')
        if (valid) {
            if (!toggle.value) {
                login(JSON.stringify(userData.value)).then((data: any) => {
                    ElMessage.success('登录成功')
                    // 保存token信息
                    localStorage.setItem('token', data.token)
                    store.dynamicMenu([
                        {
                            path:'dashboard',
                            meta:{name:'控制台',path:'/dashboard'},
                            component:''
                        },
                        {
                            Path:'auth',
                            meta:{name:'权限管理',path:'/auth'},
                            children:[
                                {
                                    path: 'admin',
                                    component: '',
                                    meta:{name:'账号管理',Path:'/auth/admin'}
                                },
                                {
                                    path:'group',
                                    component:'',
                                    meta:{name:'角色管理',Path:'/auth/group'}
                                }
                            ]
                        }
                    ])
                    console.log('ok')
                    router.push('/')
                })
            }
            else {
                signUp(JSON.stringify(userData.value)).then(res => {
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
                    <el-form-item prop="username"><el-input v-model="userData.username" placeholder="请输入手机号">
                            <template #prefix>
                                <i class="iconfont icon-icon-test1"></i>
                            </template>
                        </el-input></el-form-item>
                    <el-form-item prop="password"><el-input type="password" :show-password="true"
                            v-model="userData.password" placeholder="请输入密码">
                            <template #prefix>
                                <i class="iconfont icon-icon-test"></i>
                            </template>
                        </el-input></el-form-item>
                    <el-form-item v-show="toggle" prop="validCode"><el-input v-model="userData.validCode"
                            placeholder="请输入验证码">
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