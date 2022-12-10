<template>
    <div>
       <div style="position: fixed; left: 0px; top:0; height:50px; width:100%; z-index:999;"><TopBar></TopBar></div>

       <div class="card">
            <div style="position: absolute; left:40px; bottom:20px;">
                <n-avatar round :size="120" :src=user.avatarUrl :bordered=true />
            </div>

            <div style="position: absolute; top:25px; left:200px; font-size:20px;">{{user.name}}</div>
            <div style="position: absolute; top:70px; left:200px;">
                <text style="font-weight: bold; font-size:20px;">{{user.articleNumber}}</text>
                <text style="margin-left: 5px; font-size: 14px;">文章</text>
            </div>

            <n-dropdown trigger="hover" :options="options" @select="handleSelect">
                <n-button style="position: absolute; right: 40px; top: 25px;" round ghost color="#7B3DE0">修改资料</n-button>
            </n-dropdown>
       </div>

       <n-modal v-model:show="showAvatarModal">
            <div style="width: 600px; height:320px; background: white;">
                <n-card title="修改头像" :borderd="false">
                    <n-upload multiple directory-dnd :max="1" @before-upload="beforeUpload" :custom-request="CustomRequest">
                        <n-upload-dragger>
                            <div style="margin-bottom:12px;">
                                <n-icon size="48" :depth="3"><archive-icon /></n-icon>
                            </div>
                            <n-text style="font-size: 16px;">点击或拖动图片到此处</n-text>
                        </n-upload-dragger>
                    </n-upload>
                </n-card>
                <div style="position: absolute; right: 90px; bottom: 20px;">
                    <n-button type="default" @click="closeAvatarModal">
                        取消
                    </n-button>
                </div>
                <div style="position: absolute; right: 20px; bottom: 20px;">
                    <n-button v-if="newAvatar" @click="modifyAvatar" type="primary">
                        确认
                    </n-button>
                    <n-button v-else type="primary" disabled>
                        确认
                    </n-button>
                </div>
            </div>
       </n-modal>

       <n-modal v-model:show="showNameModal">
            <div style="width: 440px; height: 185px; background: white;">
                <n-card title="修改用户名" :bordered="false">
                    <div style="width:350px;">
                        <n-input v-model:value="newName" size="large" round type="text" placeholder="请输入用户名" />
                    </div>
                </n-card>
                <div style="position: absolute; right: 90px; bottom: 20px;">
                    <n-button type="default" @click="closeNameModal">
                        取消
                    </n-button>
                </div>
                <div style="position: absolute; right: 20px; bottom: 20px;">
                    <n-button type="primary" @click="modifyName">
                        确认
                    </n-button>
                </div>                
            </div>
        </n-modal>

        <div class="tabs">
            <n-card>
                <n-tabs type="line" >
                <n-tab-pane  name="articles" tab="我的文章">
                    <div v-for="(article,index) in articles" style="margin-bottom:15px">
                        <n-card v-if="article.head_image" @click="toDetail(article)" style="cursor: pointer;" hoverable >
                            <n-image height="135" width="200" :src=serverUrl+article.head_image style="float: left" />
                            <div style="position: absolute; left: 240px; width: 690px;">
                                <text  style="font-weight:bold; font-size: 20px;">{{article.title}}</text>
                                <p >{{article.content+"..."}}</p>
                                <div style="position: absolute; margin-top: 10px;">发布时间：{{article.created_at}}</div>
                            </div>
                        </n-card>
                        <n-card v-else @click="toDetail(article)" style="cursor: pointer;" hoverable >
                            <div style="height: 140px; ">
                                <text style="font-weight:bold; font-size: 20px;">{{article.title}}</text>
                                <p >{{article.content+"..."}}</p>
                                <div style="position: absolute; margin-top: 10px;">发布时间：{{article.created_at}}</div>                           
                            </div>
                        </n-card>
                    </div>
                </n-tab-pane>
                </n-tabs>
            </n-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopBar from '../components/TopBar.vue'
import { ArchiveOutline as ArchiveIcon} from "@vicons/ionicons5"

import { AxiosStatic } from 'axios';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import {ref,reactive,inject,onMounted} from 'vue'


import { useRouter,useRoute } from 'vue-router';
import { UserStore } from '../store/userStore';
import { text } from 'stream/consumers';
const router = useRouter()
const route = useRoute()

const serverUrl = inject("serverUrl") as string
const axios = inject("axios") as AxiosStatic
const message = inject("message") as MessageApiInjection
const userStore = UserStore()

const newName = ref("")
const newUrl = ref("")
const newAvatar = ref(false)
const showAvatarModal = ref(false)
const showNameModal = ref(false)
const options = reactive([
    {label:"修改头像",key:"avatar"},
    {label:"修改用户名",key:"name"},
])
const user = reactive({
    avatarUrl:"",
    name:"",
    articleNumber:0,
    id:""
})

const articles = ref([] as any)

onMounted(() => {
    loadArticleList()
})

const loadArticleList = async() => {
    let res = await axios.get("user/articles")
    if (res.data.code == 200){
        user.id = res.data.data.id
        user.name = res.data.data.name
        user.avatarUrl =  serverUrl + res.data.data.avatar
        articles.value = res.data.data.articles
    }
}

const handleSelect = (key) => {
    if(String(key) == "avatar"){
        showAvatarModal.value = true
    } else if (String(key) == "name") {
        showAvatarModal.value = false
    }
}

const beforeUpload =async (data) => {
    if(data.file.file?.type !== "image/png"){
        message.error("只能上传png格式");
        return false;
    }
    return true;
}

const CustomRequest = async({file}) =>{
    const formData = new FormData()
    formData.append('file',file.file)
    let res = await axios.post("/upload/avatar",formData)
    newUrl.value = res.data.data.filePath
    newAvatar.value = true
}

const closeAvatarModal = () => {
    showAvatarModal.value = false  
}

const modifyAvatar = async() => {
    let res = await axios.put("user/avatar",{
        avatar: newUrl.value,
    })

    if(res.data.code == 200) {
        message.success(res.data.msg)
        showAvatarModal.value=false
        loadArticleList()
    } else {
        message.error(res.data.msg)
    }
}

const closeNameModal = () => {
    showNameModal.value = false  
}

const modifyName = async() => {
    let res = await axios.put("user/name",
    {
        userName: newName.value,
    })     
    console.log(res) 
    if (res.data.code == 200) {
        message.success(res.data.msg)    
        showNameModal.value = false  
        loadArticleList()
    }  else {
        message.error(res.data.msg)  
    }
}

const toDetail = (article) => {
    router.push({
        path: "/detail",
        query: {
            id: article.id
        }
    }) 
}


</script>


<style lang="scss" scoped>
.card {
    padding-left: 0;
    padding-right: 0;
    position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    margin: auto;
    width: 1000px;
    height: 130px;
    background: white;  
    box-shadow: 0px 1px 3px #D3D4D8; 
    border-radius: 5px;
}
.tabs {
    position: absolute;
    top: 325px;
    left: 0;
    right: 0;
    margin: auto;
    width: 1000px;
    height: auto;
    background: white;  
    box-shadow: 0px 1px 3px #D3D4D8; 
    border-radius: 5px; 
}
.cardInfo {
    float: right;
    width: 80%;
}
</style>
