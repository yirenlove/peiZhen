import request from '../utils/request.ts'

//发送验证码
export const getCode = (data:string)=>{
    return request.post('/getCode',data)
}
// 注册
export const signUp = (data:string)=>{
    return request.post('/signUp',data)
}
// 登录
export const login = (data:string)=>{
    return request.post('/login',data)
}

// 权限管理列表
export const authAdmin = (data:string)=>{
    return request.post('auth/admin',data)
}

// 菜单权限数据
export const getMenu = ()=>{
    return request.get('user/admin')
}

// 菜单权限修改
export const setMenu = (data:any)=>{
    return request.post('/user/setmenu',data)
}

// 菜单权限列表
export const menuList = (data:any)=>{
    return request.get('user/getmenu',data)
}

// 权限下拉列表
export const menuSelectList = ()=>{
    
}

// 用户菜单权限
export const menuPermission = ()=>{
    return request.get('/menu/permissions')
}