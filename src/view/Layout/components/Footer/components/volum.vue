<template>
    <div class="volumContainer">
        <el-slider v-model="volume" vertical @change="changeVolum" @input="inputVolum"/>
    </div>
</template>

<script setup>

// 引入底部播放栏状态信息
import { song } from '@/store/song.js'
import { storeToRefs } from 'pinia'
const songStore = song()

let { songInfo } = storeToRefs(songStore)

let volume = ref(0)

onBeforeMount(()=>{
    volume.value = songInfo.value.volume
})

const changeVolum = (val) => {
    let audio = document.querySelector('audio')
    volume.value = val
    audio.volume = val/100
    songInfo.value.volume = val
    localStorage.setItem('PLAYING_STATE',JSON.stringify(songInfo.value))
}

const inputVolum = (val) => {
    let audio = document.querySelector('audio')
    volume.value = val
    audio.volume = val/100
}
</script>

<style lang="less" scoped>
.volumContainer{
    width: 50px;
    height: 150px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: pink;
    position: fixed;
    bottom: 45px;
    right: 35px;
    display: flex;
    justify-content: center;
    border-radius: 10px;
    background: rgba(108, 105, 105, 0.3);
    z-index: 999;
}
    
</style>