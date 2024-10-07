import {createRouter, createWebHistory} from "vue-router"
import Home from "../pages/Home.vue"
import index from "../pages/Index.vue"
const routes = [
    {
        path : '/',
        name : 'LandingPage',
        component : index,
        beforeEnter : (to, from, next) => {
            const token = localStorage.getItem('token')
            if(token){
                next('/home')
            }else{
                next()
            }
        }
    },
    {
        path : '/home',
        name : 'Home',
        component : Home,
        beforeEnter : (to, from, next) => {
            const token = localStorage.getItem('token')
            if(!token){
                next('/')
            }else{
                next()
            }
        }
    }
]


const router  = createRouter({
    history: createWebHistory(),
    routes
})  

export default router