<template>
    <el-scrollbar>
        <div v-if="FMInfo.length" class="pricateFM_container unselectable">
            <!-- 顶部歌曲内容 -->
            <div v-if="FMInfo.length" class="top">
                <!-- 左侧歌曲封面和操作按钮 -->
                <div class="options_left">
                    <div class="img">
                        <el-image style="border-radius:10px" :src="FMInfo[index].album.picUrl" alt="" ></el-image>
                        <div class="playbtn"></div>
                    </div>
                    <div class="btn">
                        <button @click="likeIt(false)" v-if="isLiking" class="iconfont">
                            <span>&#xe8c3;</span>
                        </button>
                        <button @click="likeIt(true)" v-else class="iconfont">
                            <span>&#xe8ab;</span>
                        </button>
                        <button @click="playIt" class="iconfont">
                            <span>&#xe87c;</span>
                        </button>
                        <button @click="nextFM" class="iconfont">
                            <span>&#xe63e;</span>
                        </button>
                    </div>
                </div>
                <!-- 左侧歌曲封面和操作按钮 -->
                <!-- 右侧歌曲信息和歌词 -->
                <div class="songInfo_right">
                    <div class="songInfo">
                        <div class="name">
                            <h2>{{ FMInfo[index].name }}</h2>
                        </div>
                        <div class="other">
                            <div class="ablum shenglue">专辑: {{ FMInfo[index].album.name }}</div>
                            <div class="singer shenglue">歌手: {{ mulArShow(FMInfo[index].artists) }}</div>
                        </div>
                    </div>
                    <div class="songText">
                        歌词内容未开发
                    </div>
                </div>
                <!-- 右侧歌曲信息和歌词 -->
            </div>
            <!-- 顶部歌曲内容 -->
            <!-- 底部评论内容 -->
            <div class="bottom">
                <!-- 发送评论 -->
                <div class="sendCommit_Box">
                    <div class="title">评论<span class="ds">（已有{{ total }}条评论）</span></div>
                    <div class="input_box">
                        <el-input type="textarea" rows="6" placeholder="发布评论"></el-input>
                    </div>
                </div>
                <!-- 发送评论 -->

                <!-- 歌曲评论 -->
                <div class="high_commit_Box">
                    <h3><div class="title">精彩评论</div></h3>
                    <commitCell
                     v-for="item in highCommits"
                     :key="item.commentId"
                     :comment="item"
                    ></commitCell>
                </div>
                <div class="normal_commit_box">
                    <h3><div class="title">最新评论</div></h3>
                    <commitCell
                     v-for="item in normalCommits"
                     :key="item.commentId"
                     :comment="item"
                     ></commitCell>
                </div>
                <!-- 歌曲评论 -->
            </div>
            <!-- 底部评论内容 -->
        </div>
    </el-scrollbar>
</template>

<script setup>

import { toLikeSong } from '@/api/myFavourite.js'
import isLiked from '@/utils/isLiked.js'
import myLikeIds from '@/utils/myLikeIds.js'
import FMMode from '@/utils/FMMode.js'
import playSong from '@/utils/playSong.js'
import commitCell from './components/commitCell.vue'
import { privateFM } from '@/api/myFavourite'
import { getSongCommits } from '@/api/songList.js'
import mulArShow from '../../utils/mulArShow';


const router = useRouter()

let isLiking = ref(false)
let FMInfo = reactive([])
let index = ref(0) 
let highCommits = reactive([])
let total = ref(0)
let normalCommits = reactive([])

const route= useRoute()
let isFMMode = ref(false)
// 获取歌曲
const getFMSongs = async() => {
    FMInfo = reactive([])
    const {data} = await privateFM()
    data.data.map(item=>{
        FMInfo.push(item)
    })
    getCommits()
}
// 播放歌曲
const playIt = async() => {
    isFMMode.value = true
    await FMMode(true)
    await playSong(FMInfo[index.value])
    let audio = document.querySelector('audio')
    audio.onended = () => {
        nextFM()
        audio.onended = null
    }
}
// 下一首FM
const nextFM = async() => {
    index.value = index.value + 1
    if(FMInfo[index.value]){
        playIt()
        getCommits()
    } else {
        index.value = 0
        await getFMSongs()
        playIt()
    }
}
// 获取歌曲评论
const getCommits = async() => {
    normalCommits = reactive([])
    highCommits = reactive([])
    const {data} = await getSongCommits({
        id:FMInfo[index.value].id
    })
    data.comments.map(item=>{
        normalCommits.push(item)
    })
    data.hotComments.map(item=>{
        highCommits.push(item)
    })
    total.value = data.total
}

// 点击喜欢红心
const likeIt = async(like) => {
    const res = await toLikeSong({
        id:FMInfo[index.value].id,
        like
    })
    isLiking.value = like
    updateLikeIds()
}

let likeIds = reactive([])

const updateLikeIds = async() => {
    const ids = await myLikeIds()
    likeIds = reactive([...ids])
}
onMounted(async()=>{
    await getFMSongs()
    await updateLikeIds()
    isLiking.value = isLiked(FMInfo[index.value].id,likeIds)
})

watch(route,(val)=>{
    if(val.path!=='/privateFM'&&isFMMode.value){
        FMMode(false)
    }
},{
    deep:true,
    immediate:true
})


</script>

<style lang="less" scoped>
.pricateFM_container{
    width: 100%;
    min-width: 871px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 75px;
    .top{
        width: 100%;
        height: 600px;
        // background-color: pink;
        display: flex;
        justify-content: center;
        align-items: center;
        .options_left{
            width: 400px;
            height: 500px;
            // background-color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            .img{
                margin: 20px;
                width: 300px;
                height: 300px;
                // background-color: pink;
                img{
                    width: 300px;
                    height: 300px;
                    border-radius: 10px;
                }
            }
            .btn{
                width: 300px;
                height: 100px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                button{
                    padding-left: 2px;
                    color: rgba(247, 116, 192,1);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    line-height: 60px;
                    font-size: 30px;
                    width:60px;
                    height:60px;
                    border-radius:50%;
                    border: 1px solid rgba(247, 116, 192,1);
                    cursor: pointer;
                }
                button:hover{
                    background: rgba(255, 255, 255, 0.5);
                }
            }
        }
        .songInfo_right{
            width: 400px;
            height: 500px;
            // background-color: skyblue;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            .songInfo{
                margin: 20px;
                width: 300px;
                height: 100px;
                // background-color: #fff;
                display: flex;
                flex-direction: column;
                .name{
                    padding: 5px;
                }
                .other{
                    display: flex;
                    padding: 5px;
                    font-size: 14px;
                    justify-content: flex-start;
                    .ablum{
                        margin: 5px;
                        width: 150px;
                    }
                    .singer{
                        width: 150px;
                        margin: 5px;
                    }
                }
            }
            .songText{
                width: 300px;
                height: 300px;
                text-align: center;
                color: gray;
                // background-color: gray;
            }
        }
    }
    .bottom{
        width: 100%;
        height: 900px;
        // background-color: pink;
        display: flex;
        flex-direction: column;
        align-items: center;
        .sendCommit_Box{
            width: 80%;
            height: 200px;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            padding-bottom: 20px;
            .title{
                font-size: 20px;
                font-weight: 700;
                .ds{
                    font-size: 14px;
                    font-weight: 500;
                    color: rgb(123, 122, 122);
                }
            }
            .input_box{
                
            }
        }
        .normal_commit_box,.high_commit_Box{
            width: 80%;
            padding-bottom: 75px;
        }
    }
}
    
</style>