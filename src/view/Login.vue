<template>
    <div class="board">
        <div>
            <div @click="toRegister" class="button2">
                <div style="position: absolute; right:22px;">注册</div>
            </div>
            <div class="button1">
                <div style="position:absolute;left:22px;">登录</div>
            </div>
        </div>
        <n-form ref="formRef" :rules="rules" :model="user">
            <n-form-item path="email" style="position:absolute;left:70px;top:150px;width:350px;">
                <n-input v-model:value="user.email" size="large" round placeholder="手机号"/> 
            </n-form-item>
            <n-form-item path="password" style="position:absolute;left:70px;top:230px;width:350px;">
                <n-input v-model:value="user.password" size="large" round type = "password" placeholder="密码"/> 
            </n-form-item>
        </n-form>
        <n-checkbox v-model:checked="user.rember" label="记住密码" style="position:absolute;left:70px;top:330px;"/>
        <div @click="submit" class="button3">
            <div style="left: auto;right: auto;text-align: center;">登录</div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {ref,reactive,inject} from 'vue'
import {UserStore} from '../store/userStore'
import { useRouter, useRoute} from 'vue-router';
import { AxiosStatic } from 'axios';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

const router = useRouter()
const route = useRoute()

const axios = inject("axios") as AxiosStatic
const message = inject("message") as MessageApiInjection
const userStore = UserStore()

const formRef = ref(null)
const user = reactive({
    id: localStorage.getItem("id") || route.query.id || "",
    email: localStorage.getItem("email") || route.query.email || "",
    password: localStorage.getItem("password") || route.query.password || "",
    rember: localStorage.getItem("rember") == "1" || false
})

let rules = {
    email: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { min: 3, max: 11, message: "手机号为 11 位", trigger: "blur"},
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 3, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur"},    
    ]
}

function submit() {
    let t = formRef.value as any;
    t.validate((errors) => {
        if(errors) {
            message.error("注册失败");
        } else {
            login();
        }
    })
}

const login = async() => {
    let res = await axios.post("/login",{
        email: user.email,
        password: user.password
    })

    console.log(res)
    if(res.data.code == 200){
        userStore.token = res.data.data.token
        if (user.rember) {
            localStorage.setItem("email", user.email as string)
            localStorage.setItem("password", user.password as string)
            localStorage.setItem("rember", user.rember? "1":"0")
            localStorage.setItem("token", res.data.data.token)
        } else {
            localStorage.removeItem("email")
            localStorage.removeItem("password")
            localStorage.setItem("rember", user.rember ? "1":"0")
            localStorage.removeItem("token")
        }

        message.success(res.data.msg)
        router.push("/home")
    } else {
        message.error(res.data.msg)
    }
}

const toRegister = () => {
    router.push("/register")
}

</script>

<style lang="scss" scoped>
.background {
    .rectangle1 {
        position: absolute;
        left: -160px;
        top: -320px;
        z-index:-1;
    }
    .rectangle2 {
        position: absolute;
        left: 650px;
        top: 0px;
        z-index:-1;
    }
    .rectangle3 {
        position: absolute;
        left: 800px;
        top: -100px;
        z-index:-1;
    }
    .rectangle4 {
        position: absolute;
        left: 1100px;
        top: 450px;
        z-index:-1;
    }
    .person {
        position: absolute;
        left: 80px;
        top: 70px;
        z-index:-1;
    }
}
.board {
    position: absolute;
    top: 95px;
    right: 235px;
    width: 500px;
    height: 550px;
    border-radius: 20px;
    box-shadow: 0px 20px 50px #D3D4D8;
    background-color: white;
    z-index: 0;
    .button1 {
        position: absolute;
        top: 75px;
        left: 70px;
        width: 80px;
        height: 40px;
        border-radius: 20px;
        background-color: #7B3DE0;
        line-height: 40px;
        font-size: 16px;
        color: white;  
        cursor: default;      
    }
    .button2 {
        position: absolute;
        top: 75px;
        left: 70px;
        width: 160px;
        height: 40px;
        border-radius: 20px;
        background-color: #F1EBFB;  
        line-height: 40px;
        font-size: 16px;
        color: black;
        cursor: pointer;
    }
    .button3 {
        position: absolute;
        top: 400px;
        left: 70px;
        width: 350px;
        height: 50px;
        border-radius: 20px;
        background-color: #7B3DE0;  
        line-height: 50px;
        font-size: 16px;
        color: white;
        cursor: pointer;
    }
}

</style>
