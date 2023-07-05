<template>
    <div class="singleSongContainer">

        <!-- 歌曲列表 -->
        
        <!-- 表头标题 -->
        <div class="singleSongTitle">
            <div class="option">操作</div>
            <div class="songName">音乐标题</div>
            <div class="artistName">歌手</div>
            <div class="ablumName">专辑</div>
            <div class="timeLength">时长</div>
            <div class="hotLength">热度</div>
        </div>

        <!-- 歌曲列表内容 -->
        <div class="songList">
            <ul>
                <li v-for="(item,index) in result" :key="item.id" @dblclick="dblclickSong(item)">
                    <div class="option">
                        <div  v-if="item.id===songState.currentPlayingSong.id" class="playingIcon iconfont">&#xe62e;</div>
                        <div v-else class="index">{{ (index+1)<10?'0'+(index+1):(index+1) }}</div>
                        <div @click="likeIt(item.id,false)" v-if="isLiked(item.id,userlikeIds)" class="iconfont">&#xe8c3;</div>
                        <div @click="likeIt(item.id,true)" v-else class="iconfont">&#xe8ab;</div>
                    </div>
                    <div class="songName">
                        {{ item.name }}
                    </div>
                    <div class="artistName">
                        <div class="showName">
                            {{ mulArShow(item.ar) }}
                        </div>
                    </div>
                    <div class="ablumName">{{ item.al.name }}</div>
                    <div class="timeLength">{{ formatTime(item.dt) }}</div>
                    <div class="hotLength">
                        <el-progress :percentage="item.pop" :show-text="false" color="#a8a8a8" style="width:80%" />
                    </div>
                </li>
            </ul>
        </div>
        <!-- 歌曲列表内容 -->

        <!-- 列表分页导航 -->
        <div v-if="songTotal" class="page">
            <el-pagination
                :page-size="100"
                :pager-count="11"
                :current-page="currentPages+1"
                layout="prev, pager, next"
                :total="songTotal"
                @current-change="currentChange"
            />
        </div>
        <!-- 列表分页导航 -->

        </div>
</template>

<script setup>
// 引入红心判定工具
import isLiked from '@/utils/isLiked.js'
import { toLikeSong, getMyFavourite } from '@/api/myFavourite.js'

// 引入用户信息
import { user } from '@/store/user.js'
//  引入element消息提示及loading状态
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-message.css';

import '@/assets/icon/iconfont/iconfont.css'
import { search, getSongUrl, checkSong } from '@/api/search'

import formatTime from '@/utils/formatTime.js'

// 分割多歌手工具
import mulArShows from '@/utils/mulArShow.js'

// 引入歌曲播放函数
import dblclickSong from '@/utils/playSong.js'

// 引入底部播放栏状态信息
import { song } from '@/store/song.js'
import { storeToRefs } from 'pinia'
const songStore = song()
let { songInfo } = storeToRefs(songStore)

// 用户相关信息
const userStore = user()
const { userInfo } = storeToRefs(userStore)

// 分割多歌手工具
const mulArShow = mulArShows

let songState = reactive({})

watch(()=>songInfo.value,(val)=>{
    songState= songInfo.value
},{
    deep:true,
    immediate:true
})

if(songInfo.value.currentPlayingSong){
    songState = songInfo.value
} else {
    if(localStorage.getItem('PLAYING_STATE')){
            songInfo.value = JSON.parse(localStorage.getItem('PLAYING_STATE'))
    }
    songState = songInfo.value
}

const route = useRoute()
const router = useRouter()

// 当前页码
const currentPage = ref(0)

// 接收父组件数据
let props = defineProps(['result','songTotal','currentPages'])
const emit = defineEmits(['updatePage'])

let results = computed(()=>{ return result })
// 页码改变
const currentChange = (page)=>{
    currentPage.value = page
    emit('updatePage',currentPage)
}

// 用户喜欢歌曲id列表
let userlikeIds = reactive([])

// 获取用户喜欢列表
const getLikeIds =async () => {
    const {data} = await getMyFavourite({
        uid:userInfo.value.id
    })
    if(data.ids){
        data.ids.map(item=>{
            userlikeIds.push(item)
        })
    }
}
// 用户点击喜欢
const likeIt = async(id,like) => {
    const res = await toLikeSong({
        id,like
    })
    getLikeIds()
    router.go(0)
}
onMounted(async()=>{
    getLikeIds()
})
</script>

<style lang="less" scoped>
.singleSongContainer{
    width: 100%;
    height: 100%;
    min-width: 962px;
    .singleSongTitle{
        display: flex;
        justify-content: flex-start;
        width: 100%;
        font-size: 14px;
        color: #888888;
        .option{
            box-sizing: border-box;
            padding-left: 70px;
            width: 10.2%;
        }
        .songName{
            box-sizing: border-box;
            padding-left: 40px;
            width: 30%;
        }
        .artistName{
            width: 20%;
        }
        .ablumName{
            width: 20%;
        }
        .timeLength{
            width: 10%;
        }
        .hotLength{
            width: 10%;
        }
    }
    .songList{
        font-size: 14px;
        li{
            // position: relative;
            width: 100%;
            height: 40px;
            background-color: #FAFAFA;
            display: flex;
            line-height: 40px;
            box-sizing: border-box;
            cursor: pointer;
            .option{
                box-sizing: border-box;
                padding-left: 70px;
                width: 10.2%;
                display: flex;
                justify-content: flex-start;
                .playingIcon{
                    margin-left: -40px !important;
                }
                .index{
                    margin-left: -40px;
                }
                .iconfont{
                    margin-left:28px;
                    color: red;
                    cursor: pointer;
                }
            }
            .songName{
                box-sizing: border-box;
                padding-left: 40px;
                width: 30%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                box-sizing: border-box;
                padding-right: 10px;
            }
            .artistName{
                width: 20%;
                box-sizing: border-box;
                padding-right: 10px;
                .showName{
                    width: 200px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .ablumName{
                width: 20%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                box-sizing: border-box;
                padding-right: 10px;
            }
            .timeLength{
                width: 10%;
            }
            .hotLength{
                width: 10%;
                display: flex;
            }
        }
        li:nth-child(2n){
            background-color: #fff;
        }
        li:hover{
            background-color: #f2f2f3;
        }
    }
    .page{
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>