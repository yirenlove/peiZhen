import axios from "axios";
import { ElMessage } from "element-plus";

const https = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
});

// 添加请求拦截器
https.interceptors.request.use(function (config) {
    // 获取token
    config.headers["Content-Type"] = "application/json";
    const token = localStorage.getItem("token");
    
    // 不需要token的接口
    const whiteUrl = ['/getCode', '/signUp', '/login']
    if (token && !whiteUrl.includes(config.url as string)) {
        config.headers.Authorization = token
        
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
https.interceptors.response.use(function (response) {
    if (response.data.code === -1) {
        ElMessage.warning(response.data.message)
    }
    else if(response.data.code === -2){
        localStorage.removeItem('token')
        location.href = location.origin
    }
    return response.data;
}, function (error) {

    return Promise.reject(error);
});

export default https