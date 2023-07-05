<template>
    <div class="footer unselectable">

            <!-- 歌曲封面 -->
            <div v-if="songState.picUrl" class="songImg">
                <img :src="songState.picUrl" alt="">
            </div>
            <!-- 歌曲封面 -->

            <!-- 歌曲名称 -->
            <div v-if="songState.name" class="songInfo">
                <div class="songName shenglue">{{ songState.name }}</div>
                <div class="songAr shenglue">{{ mulArShow(songState.ar) }}</div>
            </div>
            <!-- 歌曲名称 -->

            <!-- 上一曲、暂停、下一曲 -->
            <div class="songOption">
                <div v-if="!songState.FMList.length" class="beforeSong iconfont" @click="beforeSong"><p>&#xe63c;</p></div>
                <div class="pause iconfont" @click="changePlayingState">
                    <span v-if="isPlaying">&#xe87a;</span>
                    <span v-else>&#xe87c;</span>
                </div>
                <div v-if="!songState.FMList.length" class="nextSong iconfont" @click="SongEnd"><p>&#xe63e;</p></div>
            </div>
            <!-- 上一曲、暂停、下一曲 -->

            <!-- 进度条、时间 -->
            <div class="timeProgress">
                <div class="played">{{ playedTime }}</div>
                <div class="progress">
                    <el-slider v-model="playedProgress" :show-tooltip="false" @change="changePlayedTimeLast" @input="changePlayedTime" />
                </div>
                <div class="duration">{{ formatTime(songState.playDuration) }}</div>
            </div>
            <!-- 进度条、时间 -->

            <!-- 播放模式 -->
            <div v-if="!songState.FMList.length" class="playMode" @click="changePlayMode">
                <div v-if="songState.playMode===0" class="seqPlay iconfont">&#xea6f;</div>
                <div v-if="songState.playMode===1" class="loopPlay iconfont">&#xe66c;</div>
                <div v-if="songState.playMode===2" class="singlePlay iconfont">&#xe66d;</div>
                <div v-if="songState.playMode===3" class="randomPlay iconfont">&#xe66b;</div>
            </div>
            <!-- 播放模式 -->

            <!-- 音量 -->
            <volum class="volumeOption" v-if="isChangingVolume"></volum>
            <div class="volume iconfont"><span class="icon">&#xe605;</span></div>
            <!-- 音量 -->

            <!-- 播放列表 -->
            <div v-if="showSongList&&!songState.FMMode" class="close" @click="showSongList = false">
                <songList v-if="showSongList"></songList>
            </div>
            <div v-if="!songState.FMList.length" class="playList iconfont" @click="playListShow"><span class="icon">&#xe62d;</span></div>
            <div v-else class="playList iconfont" @click="playListShow"><span class="icon"></span></div>
            <!-- 播放列表 -->
    </div>
</template>

<script setup>
// 歌曲列表组件
import songList from './components/songList.vue'
// 音量组件
import volum from './components/volum.vue';
// 引入时间转换工具
import formatTime from '../../../../utils/formatTime';
// 播放url工具
import createAudio from '../../../../utils/createAudio';
// 上一首、下一首函数
import nextSong from '../../../../utils/nextSong'
// 歌曲结束判定工具
import songEndFn from '../../../../utils/songEndFn'


// 引入api
import { getSongUrl } from '@/api/search'
// 引入图标
import '@/assets/icon/iconfont/iconfont.css'
// 引入多歌手分割工具
import mulArShow from '../../../../utils/mulArShow';
// 引入底部播放栏状态信息
import { song } from '@/store/song.js'
import { storeToRefs } from 'pinia'
const songStore = song()
let { songInfo } = storeToRefs(songStore)

// 播放状态 暂停/播放
let isPlaying = ref(false)

// 暂停/播放函数
const changePlayingState = () => {
    isPlaying.value = !isPlaying.value
    let audio = document.querySelector('audio')
    if(audio.paused){
        audio.play()
    } else {
        audio.pause()
    }
}

// 播放状态暂存
let songState = reactive({})
if(songInfo.value.name){
    songState = reactive(JSON.parse(localStorage.getItem('PLAYING_STATE')))
} else {
    songState = songInfo.value
}

// 初始化
onBeforeMount(() => {
    if(songInfo.value.name){
        let songState = songInfo.value
    } else {
        if(localStorage.getItem('PLAYING_STATE')){
            songInfo.value = JSON.parse(localStorage.getItem('PLAYING_STATE'))
        }
        songState = songInfo.value
        songInfo.value.FMList =reactive([])
        songInfo.value.FMMode =false
    }
})
onMounted(()=>{
    changeVolume()
})

// 已播放时长
let playedTime = ref('00:00')
// 已播放进度条
let playedProgress = ref(0)

// 拉进度条
const changePlayedTime = (val) => {
    let audio = document.querySelector('audio')
    audio.removeEventListener('timeupdate',changeTimeFn)
    playedTime.value = formatTime(audio.duration*val*10)
}
// 松开进度条
const changePlayedTimeLast = (val) => {
    let audio = document.querySelector('audio')
    audio.currentTime = (audio.duration*val)/100
    audio.addEventListener('timeupdate',changeTimeFn)
    audio.play()
}

// 音量控制
let isChangingVolume = ref(false)
let changeVolume = () => {
    let volume = document.querySelector('.volume')
    volume.addEventListener('mouseover',(e)=>{
        isChangingVolume.value = true
        let x = e.clientX
        let y = e.clientY
        let Lx = 0
        let Ly = 0
        document.onmousemove = (e_e)=>{
            Lx = Math.abs(e_e.clientX-x)
            Ly = Math.abs(e_e.clientY-y)
            if(Lx>40||Ly>200){
                isChangingVolume.value = false
                document.onmousemove = null
            }
        }
    })
}

// 展示播放列表
let showSongList = ref(false)
const playListShow = () => {
    if(isChangingVolume)isChangingVolume.value = false
    showSongList.value = !showSongList.value
}

// 改变播放模式
const changePlayMode = () => {
    if(isChangingVolume)isChangingVolume.value = false
    songInfo.value.playMode++;
    if(songInfo.value.playMode===4){
        songInfo.value.playMode = 0
    }
}

// 监听调用函数
const changeTimeFn = ()=> {
    const audio = document.querySelector('audio')
    playedTime.value = formatTime(audio.currentTime*1000)
    playedProgress.value = (audio.currentTime/audio.duration)*100
}

// 节流
let timer = null

// 下一曲
const SongEnd = () => {
    if(timer){
        clearTimeout(timer)
        ElMessage('请不要繁忙点击')
        timer = null
    }
    timer = setTimeout(()=>{
        songEndFn()
        clearTimeout(timer)
        timer = null
    },200)
    // 解决多音频
    const audios = document.querySelectorAll('audio')
    if(audios.length>1){
        for(let i = 0;i < audios.length-1;i++){
            audios[i].remove()
        }
    }
}

// 上一首
const beforeSong = () => {
    if(timer){
        clearTimeout(timer)
        ElMessage('请不要繁忙点击')
        timer = null
    }
    timer = setTimeout(()=>{
        nextSong(false)
        clearTimeout(timer)
        timer = null
    },200)
    // 解决多音频
    const audios = document.querySelectorAll('audio')
    if(audios.length>1){
        for(let i = 0;i < audios.length-1;i++){
            audios[i].remove()
        }
    }
}


// 监听当前播放歌曲url
watch(()=>songInfo.value.songUrl,async (newval)=>{
    songState = songInfo.value
    playedTime.value='00:00'
    playedProgress.value=0
    createAudio(newval)
    const audio = document.querySelector('audio')
    audio.addEventListener('play',()=>{
        isPlaying.value = true
    })
    audio.addEventListener('pause',()=>{
        isPlaying.value = false
    })
    audio.addEventListener('timeupdate',changeTimeFn)
    // 歌曲结束是的判定函数
    audio.onended = ()=>{
        songEndFn()
        audio.onended = null
    }

    
},{
    deep:true,
    immediate:false
})
</script>


<style lang="less" scoped>
.close{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -999;
}
.footer{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    border-top: 1px solid rgba(0,0,0,0.1);
    background-color: #fff;
    min-width: 900px;
    height: 75px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    .songImg{
        width: 90px;
        box-sizing: border-box;
        img{
            border-radius: 10px;
            margin-left: 20px;
            width: 50px;
        }
    }
    .songInfo{
        display: flex;
        flex-direction: column;
        width: 100px;
        .songName{
            font-size: 16px;
        }
        .songAr{
            font-size: 12px;
        }
    }
    .songOption{
        width: 180px;
        height: 75px;
        line-height: 75px;
        display: flex;
        justify-content: space-around;
        background-color: #fff;
        .beforeSong{
            font-size: 18px;
            cursor: pointer;
        }
        .pause{
            padding-bottom: 2px;
            font-size: 20px;
            cursor: pointer;
        }
        .nextSong{
            font-size: 18px;
            cursor: pointer;
        }
        .beforeSong:hover, .pause:hover, .nextSong :hover{
            color: #716f6f;
        }
    }
    .timeProgress{
        flex: 1;
        display: flex;
        justify-content:flex-start;
        align-items: center;
        box-sizing: border-box;
        padding: 0 40px;
        .played{
            width: 50px;
        }
        .progress{
            padding: 0 10px;
            flex: 1;
        }
        .duration{
            width: 50px;
        }
    }
    .playMode{
        width: 40px;
        box-sizing: border-box;
        padding: 10px;
        .iconfont{
            cursor: pointer;
            font-size: 20px;
            font-weight: 700;
            color: #000000;
        }
    }
    .volume{
        width: 40px;
        box-sizing: border-box;
        padding: 10px;
        .icon{
            font-size: 22px;
            cursor: pointer;
            color: #000000;
        }
    }
    .playList{
        width: 40px;
        box-sizing: border-box;
        padding: 10px;
        .icon{
            font-size: 27px;
            cursor: pointer;
            color: #000000;
        }
    }
    
    .icon:hover,.iconfont:hover{
        color: #716f6f;
    }
}   
</style>