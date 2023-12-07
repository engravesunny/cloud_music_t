<template>
    <div class="login_box">
        <div class="login_container">
            <!-- 关闭按钮 -->
            <div class="closeBtn iconfont" @click="closeLoginBox">&#xe903;</div>
            <!-- 关闭按钮 -->

            <!-- 登录logo -->
            <div class="login_logo">
                <img v-if="userInfos.user_avatar" :src="userInfos.user_avatar" alt="">
                <img v-else src="@/assets/img/logo.png" alt="">
            </div>
            <!-- 登录logo -->

            <!-- 登录标题 -->
            <div class="login_title">
                <h3>欢迎回来{{ userInfos.user_name ? '，' + userInfos.user_name : "" }}</h3>
            </div>
            <!-- 登录标题 -->

            <!-- 登录二维码 -->

            <!-- 二维码图片 -->
            <div class="qrImg">
                <img :src="qrurl" alt="">
            </div>
            <!-- 二维码图片 -->

            <!-- 登录二维码状态 -->
            <div class="qrStatus">{{ qrStatus }}</div>
            <!-- 登录二维码状态 -->

            <!-- 登录二维码 -->

            <div class="bottom" @click="handleVisitorLogin">游客登录</div>

        </div>
    </div>
</template>

<script setup>
//  引入element消息提示及loading状态
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-message.css';

//  二维码转图片库
import { eventBus } from '../../../../../utils/eventBus';
import { visitorLogin, qrKey, qrCreate, qrCheck, getUserInfoDetail } from '@/api/user.js'
import { onBeforeMount, reactive } from 'vue'
import QRCode from 'qrcode'
import { ElMessage } from 'element-plus'
import { user } from '@/store/user'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const userStore = user()
let { userInfo, getUserInfo } = storeToRefs(userStore)
// 接收父组件传来的值
const props = defineProps({
    showLoginBox: {
        type: Boolean,
        default: true
    }
})

// 子向父传值
const emit = defineEmits(['update:showLoginBox'])
const updateStatus = status => {
    emit('update:showLoginBox', status)
}

// 生成二维码图片base64
const generateQR = async text => {
    try {
        return await QRCode.toDataURL(text)
    } catch (err) {
        console.error(err)
    }
}

// 用户信息
let userInfos = reactive({
    user_name: '',
    user_avatar: ''
})

// 二维码图片url
let qrurl = ref('')
// 二维码状态信息
let qrStatus = ref('')


let qrTimer = null;
const qrLoginInit = async (flag = true) => {
    const { data } = await qrKey()
    let key = data.data.unikey;
    const res = await qrCreate({ key })
    qrurl.value = await generateQR(res.data.data.qrurl)
    // 循环调用二维码监测接口，直到登录成功
    qrTimer = setInterval(async () => {
        const { data } = await qrCheck({ key })
        if (data.code === 800) {
            qrStatus.value = '二维码已过期'
        } else if (data.code === 801) {
            qrStatus.value = '等待扫码'
        } else if (data.code === 802) {
            if (document.cookie) {
                document.cookie = "url=MUSIC_A; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "url=NMTID; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
            qrStatus.value = '待确认'
            userInfos.user_avatar = data.avatarUrl
            userInfos.user_name = data.nickname
            // 添加localStorage
        } else if (data.code === 803) {
            document.cookie = data.cookie
            qrStatus.value = '登陆成功'
            ElMessage({
                message: '登陆成功',
                type: 'success'
            })
            // 获取用户信息
            const res = await getUserInfoDetail()
            // 添加cookie到token,存入用户信息
            localStorage.setItem('CLOUD_MUSIC', data.cookie)
            userInfo.value.nickname = userInfos.user_name
            userInfo.value.avatarUrl = userInfos.user_avatar
            userInfo.value.cookie = data.cookie
            userInfo.value.id = res.data.account.id
            localStorage.setItem('userInfo', JSON.stringify({
                avatarUrl: userInfo.value.avatarUrl,
                nickname: userInfo.value.nickname,
                id: userInfo.value.id
            }))
            router.go(0)  // 刷新页面
            clearInterval(qrTimer)
            const timer = setTimeout(() => {
                // 更新状态
                updateStatus(false)
            }, 1000)
        }
    }, 2000);
}

const closeLoginBox = () => {
    clearInterval(qrTimer)
    qrTimer = null;
    updateStatus(false)
}

const handleVisitorLogin = async () => {
    const { data } = await visitorLogin();
    document.cookie = data.cookie
    ElMessage({
        message: '登陆成功',
        type: 'success'
    })
    // 停止二维码轮训
    clearInterval(qrTimer);
    qrTimer = null;
    // 获取用户信息
    const res = await getUserInfoDetail()
    // // 添加cookie到token,存入用户信息
    localStorage.setItem('CLOUD_MUSIC', data.cookie)
    userInfo.value.nickname = '游客'
    userInfo.value.avatarUrl = "https://www.kecat.top/other/logo.png"
    userInfo.value.cookie = data.cookie
    userInfo.value.id = res.data.account.id
    localStorage.setItem('userInfo', JSON.stringify({
        avatarUrl: userInfo.value.avatarUrl,
        nickname: userInfo.value.nickname,
        id: userInfo.value.id
    }))
    router.go(0)  // 刷新页面
    clearInterval(qrTimer)
    const timer = setTimeout(() => {
        // 更新状态
        updateStatus(false)
    }, 1000)
}

// 登录
onMounted(async () => {
    qrLoginInit();
})

</script>

<style lang="less" scoped>
.login_box {
    border-radius: 10px;
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 550px;
    display: flex;
    justify-content: center;
    background-color: var(--inner-body-color);
    box-shadow: 0 0 5px 2px rgba(37, 128, 255, 0.1);

    .login_container {
        position: relative;
        width: 400px;
        height: 550px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .closeBtn {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 20px;
            cursor: pointer;
        }

        .login_logo {

            img {
                border-radius: 50%;
                width: 150px;
                height: 150px;
            }
        }

        .login_title {
            margin: 40px 0;

            h3 {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .qrImg {
            img {
                width: 150px;
                height: 150px;
            }
        }

        .bottom {
            margin: 20px 0;
            color: var(--font-color-light);

            &:hover {
                cursor: pointer;
                color: var(--font-color-global);
            }

            &:active {
                color: var(--font-color-light);
            }
        }
    }
}
</style>