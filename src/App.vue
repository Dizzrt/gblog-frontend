<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserStore } from './store/userStore';

const userStore = UserStore()
const router = useRouter()
const route = useRoute()

onMounted(() => {
    var token = localStorage.getItem("token")
    if (token) {
      userStore.token = token
      router.push("/home")
    } else {
      router.push("/login")
    }
})
</script>

<style scoped>

</style>

