<template>
    <el-scrollbar>
        <div class="suggestSong_container unselectable">
            <div class="top">
                <div class="suggest_img">
                    <div class="img iconfont">&#xe685;</div>
                    <div class="date">{{ date }}</div>
                </div>
                <div class="suggest_title">
                    <h1>每日歌曲推荐</h1>
                    <p>根据你的口味生成，每天6:00更新</p>
                </div>
            </div>
            <div class="bottom">
                <el-button @click="playAll(songList)" style="background:#F774C0" type="primary" round class="iconfont">&#xe87c; 播放全部</el-button>
            </div>
        </div>
        &nbsp;
        <!-- 歌曲列表 -->
        <singleSong v-loading="!songList.length" :songTotal="0" :current-pages="0" :result="songList"></singleSong>
        <!-- 歌曲列表 -->
    </el-scrollbar>
</template>

<script setup>
import playAll from '@/utils/playAll';
import { getDailySongs } from '@/api/myFavourite'

const dateStr = new Date()
const date = dateStr.getDate().toString().padStart(2, '0');
let songList = reactive([])
onMounted(async()=>{
    const {data} = await getDailySongs()
    data.data.dailySongs.forEach(item => {
        songList.push(item)
    });
})

</script>

<style lang="less" scoped>
.suggestSong_container{
    width: 100%;
    height: 300px;
    // background-color: pink;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .top{
        display: flex;
        height: 200px;
        justify-content: flex-start;
        align-items: center;
        .suggest_img{
            padding: 50px 20px 50px 50px;
            width: 100px;
            height: 100px;
            position: relative;
            .img{
                font-size: 100px;
                color: #F774C0;
            }
            .date{
                position: absolute;
                top: 87px;
                left: 76px;
                font-size: 40px;
                color: #F774C0;
            }
        }
        .suggest_title{
            p{
                margin-top: 5px;
                font-size: 14px;
                font-weight: 100;
            }
        }
    }
    .bottom{
        margin-left: 55px;
    }
}


</style>