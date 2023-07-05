<template>
    <div class="home_container unselectable">
        <span>首页</span>
        
    </div>
</template>

<script setup>
import { onMounted } from '@vue/runtime-core'
import { user } from '../../store/user'
import { storeToRefs } from 'pinia'

import Swiper from 'swiper'

var mySwiper = new Swiper('.swiper-container', {
	autoplay: 5000,//可选选项，自动滑动
})

const userStore = user()
let { userInfo, getUserInfo } = storeToRefs(userStore)
const changeNum = () => {
}

onMounted(()=>{
    
})

const login =async ()=>{
    const res = await sendCode({
        phone: '18852182238'
    })
}
</script>
