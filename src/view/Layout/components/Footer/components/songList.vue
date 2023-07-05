<template>
    <div class="songListContainer unselectable">
        <div class="listTitle unselectable">
            <h3>当前播放 {{ ' '+songList.songList.length+ ' ' }}首</h3>
            <div class="clear" @click.stop="deleteAllSongs">清除全部</div>
        </div>
        <el-scrollbar height="400px">
            <ul v-if="songList.songList.length">
                <li v-for="(item,index) in songList.songList" :key="index" @click.stop="changePlayingSong(item)">
                    <div v-if="item.id===songList.currentPlayingSong.id" class="icon iconfont">&#xe62e;</div>
                    <div class="name shenglue">{{ item.name }}</div>
                    <div class="singer shenglue">{{ mulArShow(item.ar||item.artists) }}</div>
                    <div class="time">{{ formatTime(item.dt||item.duration) }}</div>
                    <div class="delete iconfont" @click.stop="deleteSongInList(item)">&#xe604;</div>
                </li>
            </ul>
        </el-scrollbar>
    </div>
</template>

<script setup>
// 引入各种工具
import formatTime from '../../../../../utils/formatTime';
import mulArShow from '../../../../../utils/mulArShow';
import playSong from '../../../../../utils/playSong'
import nextSong from '../../../../../utils/nextSong'
// 引入底部播放栏状态信息
import { song } from '@/store/song.js'
import { storeToRefs } from 'pinia'
const songStore = song()

let { songInfo } = storeToRefs(songStore)
let songList = reactive({})
const songInfoLocal = JSON.parse(localStorage.getItem('PLAYING_STATE'))
if(songInfoLocal){
    songList = reactive(songInfoLocal.songList)
}

// 初始化
onBeforeMount(()=>{
    songList = songInfo.value
})

// 监听歌曲状态
watch(()=>songInfo.value.songList,(val)=>{
    songList = songInfo.value
},{
    immediate:true,
    deep:true
})

// 切换歌曲
const changePlayingSong = (song) =>{
    playSong(song)
}

// 删除歌曲
const deleteSongInList = (song) => {
    const index = songInfo.value.songList.indexOf(song)
    if(songInfo.value.songList[index].id === songInfo.value.currentPlayingSong.id){
        if(!songInfo.value.songList.length){
            songInfo.value.name = ''
            songInfo.value.picUrl = ''
            songInfo.value.ar = []
            songInfo.value.playDuration = 0
            songInfo.value.currentPlayingSong = {}
            nextSong(true)
        } else {
            nextSong(true)
        }
    }
    if(index!==0){
        songInfo.value.songList.splice(index,index)
    } else {
        songInfo.value.songList.shift()
    }
    localStorage.setItem('PLAYING_STATE',JSON.stringify(songInfo.value))
}

// 删除全部
const deleteAllSongs = () => {
    console.log(songInfo.value.songList.length);
    songInfo.value.songList.splice(0,songInfo.value.songList.length)
    songInfo.value.name = ''
    songInfo.value.picUrl = ''
    songInfo.value.ar = []
    songInfo.value.playDuration = 0
    songInfo.value.currentPlayingSong = {}
    nextSong(true)
    localStorage.setItem('PLAYING_STATE',JSON.stringify(songInfo.value))
}

</script>

<style lang="less" scoped>
.close{
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    // background-color: black;
}
.songListContainer{
    box-sizing: border-box;
    padding: 25px 0 0px 15px;
    width: 450px;
    height: 500px;
    background: rgba(223, 183, 207, 0.8);
    position: fixed;
    bottom: 75px;
    right: 0;
    border-radius: 25px 0 0 25px;
    display: flex;
    flex-direction: column;
    .listTitle{
        width: 90%;
        padding-left: 10px;
        padding-bottom: 20px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .clear{
            color: rgb(71, 77, 77);
            cursor: pointer;
        }
        .clear:hover{
            color: aqua;
        }
    }
    ul{
        li{
            box-sizing: border-box;
            padding-left: 10px;
            height: 40px;
            background: rgba(255, 255, 255, 0.7);
            margin: 10px;
            border-radius: 20px;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;
            .name{
                width: 100px;
                height: 40px;
                line-height: 40px;
                margin: 0 10px;
            }
            .singer{
                flex: 1;
                height: 40px;
                line-height: 40px;
                margin: 0 10px;
            }
            .time{
                width: 60px;
                height: 100%;
                display: flex;
                justify-content: center;
                margin: 0 10px;
                align-items: center;
            }
            .delete{
                width: 30px;
                font-size: 20px;
                display: flex;
                cursor: pointer;
            }
        }
        li:nth-child(2n){
            background-color: #fff;
        }
        li:hover{
            background-color: #f2f2f3;
        }
    }
    
}
</style>