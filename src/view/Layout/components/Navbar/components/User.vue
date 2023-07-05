<template>
    <div class="user">
        <div class="user_container">

            <!-- 用户头像 -->
            <div class="user_avatar unselectable" >
                <!-- 登录后 -->
                <img v-if="userInfos.avatarUrl" @click="down_menu_show=!down_menu_show" :src="userInfos.avatarUrl" alt="">
                <!-- 未登录 -->
                <img v-else @click="login" src="@/assets/img/default_avatar.png" alt="">
            </div>
            <!-- 用户头像 -->

            <!-- 用户昵称 -->
            <!-- 已登录 -->
            <div v-if="userInfos.nickname" class="user_name unselectable" @click="down_menu_show=!down_menu_show">{{ userInfos.nickname }}</div>
            <!-- 未登录 -->
            <div v-else @click="login" class="user_name unselectable"> 请登录 </div>
            <!-- 用户昵称 -->

            <!-- 下拉图标 -->
            <el-icon v-if="userInfos.nickname" :size="15" style="cursor: pointer;" @click="down_menu_show=!down_menu_show"><ArrowDown /></el-icon>
            <!-- 下拉图标 -->

            <!-- 下拉菜单 -->
            <div v-if="down_menu_show" class="bg_border" @click="down_menu_show=false">
                <div v-if="down_menu_show" class="down_menu">
                    <ul>
                        <li @click="about">
                            关于
                        </li>
                        <li @click="Logout">
                            退出登录
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 下拉菜单 -->
        </div>

        <!-- 登录窗口 -->

        <Login v-if="showLoginBox" v-model:showLoginBox="showLoginBox" ></Login>

        <!-- 登录窗口 -->

        <!-- about窗口 -->
        <div v-if="showAbout" class="about">
        <!-- <div class="about"> -->
            <About></About>
            <div @click="close" class="close iconfont">&#xe903;</div>
        </div>
        <!-- about窗口 -->


    </div>
</template>

<script setup>
import About from './About.vue'
import Login from './Login.vue'
import { logout } from '../../../../../api/user';
import { ElMessage } from 'element-plus'
import { onMounted, reactive } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
let userInfos = reactive({
    nickname:'',
    avatarUrl:''
})


const router = useRouter()
onMounted(()=>{
    if(localStorage.getItem('userInfo')){
        userInfos.nickname = JSON.parse(localStorage.getItem('userInfo'))?.nickname
        userInfos.avatarUrl = JSON.parse(localStorage.getItem('userInfo'))?.avatarUrl
    }
})

let down_menu_show = ref(false)
let showLoginBox = ref(false)
let showAbout = ref(false)
const login = () => {
    showLoginBox.value = true
}
const about = () => {
    showAbout.value = true
}
const Logout =async () => {
    const {data} = await logout()
    if(data.code === 200){
        localStorage.removeItem('userInfo')
        localStorage.removeItem('CLOUD_MUSIC')
        userInfos.nickname = ''
        userInfos.avatarUrl = ''
        userInfos.id = ''
        router.push('/findSong')
        ElMessage({
            message: '登出成功',
            type: 'success',
        })
    }
}
const close = () => {
    showAbout.value = false
}
</script>

<style lang="less" scoped>
.user{
    position: relative;
    display: flex;
    float: right;
    margin-right: 40px;
    height: 60px;
    .user_container{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        .user_avatar{
            cursor: pointer;
            img{
                width: 45px;
                height: 45px;
                border-radius: 50%;
            }
        }
        .user_name{
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            padding: 0 10px;
            box-sizing: border-box;
            width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .down_menu{
        z-index: 999;
        position: absolute;
        top: 60px;
        right: 40px;
        width: 150px;
        max-height: 80vh;
        border-radius: 10px;
        overflow: hidden;
        box-shadow:3px 0 5px -5px #000;
        background-color: #fff;
        li{
            padding-left: 20px;
            box-sizing: border-box;
            width: 100%;
            height: 30px;
            line-height: 30px;
        }
        li:hover{
            background-color: #ffebeb;
        }
    }
    .bg_border{
        z-index: 9;
        position: fixed;
        top: 0;
        left: 0;
        width:100vw;
        height: 100vh;
    }
    .about{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 300px;
        height: 600px;
        background-color: #fff;
        border-radius: 10px;
        .close{
            z-index: 999;
            float: right;
            margin: 5px;
        }
    }
}
</style>