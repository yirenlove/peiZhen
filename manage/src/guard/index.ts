


const guard = (to:any,from:any)=>{
    console.log('全局守卫',from,to);
    
    const token = localStorage.getItem('token')
    if(!token && to.path !== '/login'){
        return '/login'
    }
    else if(token && to.path === '/login'){
        return '/'
    }
    return true
}
export default guard