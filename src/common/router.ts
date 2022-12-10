import { createRouter, createWebHashHistory } from "vue-router";

let routes=[
    {path:"/register",component:() => import("../view/Register.vue")},
    {path:"/login", component:() => import("../view/login.vue")},
    {path:"/home",component:()=> import("../view/Home.vue")}
]

const router = createRouter({
    history:createWebHashHistory(),
    routes,
});

export{router,routes}