import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import naive, { createDiscreteApi } from "naive-ui" 
import { createPinia } from "pinia"; 
import { router } from "./common/router"; 
import axios from "axios"; 
import { UserStore } from "./store/UserStore" 

axios.defaults.baseURL="http://localhost:8080";
const {message,notification,dialog}=createDiscreteApi(["message","notification","dialog"]);

const app = createApp(App);

app.provide("axios",axios);
app.provide("message",message);
app.provide("notification",notification);
app.provide("dialog",dialog);
app.provide("serverUrl",axios.defaults.baseURL);

app.use(naive);
app.use(createPinia());

const userStore = UserStore()
axios.interceptors.request.use((config)=>{
    let t = config?.headers
    if (t) {
        t.authorization = `Bearer ${userStore.token}`
    }
    return config
})

app.use(router);
app.mount("#app");
