<template>
    <div class="login_box">
        <el-card>
            <div class="login_container">

                <!-- 登录logo -->
                <div class="login_logo">
                    <img v-if="userInfos.user_avatar" :src="userInfos.user_avatar" alt="">
                    <img v-else src="@/assets/img/logo.png" alt="">
                </div>
                <!-- 登录logo -->

                <!-- 登录标题 -->
                <div class="login_title">
                    <h3>欢迎回来{{ userInfos.user_name?'，' + userInfos.user_name:"" }}</h3>
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

            </div>
        </el-card>
    </div>
</template>

<script setup>
//  引入element消息提示及loading状态
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-message.css';

//  二维码转图片库
import { qrKey, qrCreate, qrCheck, getUserInfoDetail } from '@/api/user.js'
import { reactive } from '@vue/reactivity'
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
  showLoginBox:{
    type:Boolean,
    default:true
  }
})

// 子向父传值
const emit = defineEmits(['update:showLoginBox'])
const updateStatus = status=>{
  emit('update:showLoginBox',status)
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
    user_name:'',
    user_avatar:''
})

// 二维码图片url
let qrurl = ref('')
// 二维码状态信息
let qrStatus = ref('')

// 登录
onMounted(async ()=>{
    const { data } = await qrKey()
    let key = data.data.unikey;
    const res = await qrCreate({key})
    qrurl.value = await generateQR(res.data.data.qrurl)
    // 循环调用二维码监测接口，直到登录成功
    let qrTimer = setInterval(async () => {
        const {data} = await qrCheck({key})
        if(data.code === 800){
            qrStatus.value = '二维码已过期'
        } else if(data.code === 801){
            qrStatus.value = '等待扫码'
        } else if(data.code === 802){
            qrStatus.value = '待确认'
            // avatarUrl: "https://p1.music.126.net/GVPebtLTETjwl1ntIuZr4w==/109951165279100956.jpg"
            // code: 802
            // cookie: ""
            // message: "授权中"
            // nickname: "若知是梦何须醒_aWab"
            userInfos.user_avatar = data.avatarUrl
            userInfos.user_name = data.nickname
            // 添加localStorage
        } else if(data.code === 803){
            console.log(data.cookie);
            document.cookie = data.cookie
            qrStatus.value = '登陆成功'
            ElMessage({
                message:'登陆成功',
                type:'success'
            })
            // 获取用户信息
            const res = await getUserInfoDetail()
            // 添加cookie到token,存入用户信息
            localStorage.setItem('CLOUD_MUSIC',data.cookie)
            userInfo.value.nickname = userInfos.user_name
            userInfo.value.avatarUrl = userInfos.user_avatar
            userInfo.value.cookie = data.cookie
            userInfo.value.id = res.data.account.id
            localStorage.setItem('userInfo',JSON.stringify({
                avatarUrl:userInfo.value.avatarUrl,
                nickname:userInfo.value.nickname,
                id:userInfo.value.id
            }))
            console.log('成功');
            router.go(0)  // 刷新页面
            clearInterval(qrTimer)
            const timer = setTimeout(()=>{
                // 更新状态
                updateStatus(false)
            },1000)
        }
    }, 2000);
})

</script>

<style lang="less" scoped>
.login_box{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    height: 500px;
    .login_container{
        width: 400px;
        height: 500px;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: flex-startx;
        align-items: center;
        .login_logo{
            margin-left: -30px;
            img{
                border-radius: 50%;
                width: 150px;
                height: 150px;
            }
        }
        .login_title{
            margin: 40px 0 40px -30px;
            h3{
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .qrImg{
            margin-left: -30px;
            img{
                width: 150px;
                height: 150px;
            }
        }
        .qrStatus{
            margin-left: -30px;
        }
    }
}
</style>