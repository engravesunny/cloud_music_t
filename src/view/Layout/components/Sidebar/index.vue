<template>
    <!-- 侧边栏 -->
    <div class="hidden">
        <div class="container">
            <div class="sidebar unselectable">

                <!-- 使用v-for渲染左边栏按钮 -->
                <div class="side_top">
                    <div 
                        :class="{side_cell:true,active:(item.active&&route.meta.component===item.path)||route.meta.component===item.path}" 
                        v-for="item in sideCellList" 
                        :key="item.name"
                        @click="toCell(item)"
                    >
                        {{ item.name }}
                    </div>
                </div>
                <!-- 使用v-for渲染左边栏按钮 -->

                <div class="side_bottom">
                    <el-collapse>
                        <el-collapse-item class="song_list" style="font-size: 18px;" title="创建的歌单">
                            <div @click="toSongList(item.id)" class="songList_cell shenglue" v-for="item in createSongList" :key="item.id">
                                {{ item.name }}
                            </div>
                        </el-collapse-item>
                        <el-collapse-item class="song_list" title="收藏的歌单">
                            <div @click="toSongList(item.id)" class="songList_cell shenglue" v-for="item in collectSonglist" :key="item.id">
                                {{ item.name }}
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
        </div>
    </div>
    <!-- 侧边栏 -->
</template>

<script setup>
import { getUserSongList } from '@/api/myFavourite.js'
import {user} from '@/store/user'
import { storeToRefs } from 'pinia';
const userStore  = user()
const { userInfo } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()
// 左侧栏上部分按钮
let sideCellList = reactive([
    {
        name:'发现音乐',
        active:true, //默认展示发现音乐
        path:'findSong' 
    },
    {
        name:'我的收藏',
        active:false, 
        path:'myLike'
    },
    {
        name:'每日推荐',
        active:false,
        path:'suggestSong' 
    },
    {
        name:'私人FM',
        active:false,
        path:'privateFM' 
    }
])

// 左侧栏上部分点击事件函数
const toCell = (item) => {
    sideCellList.forEach(item => {
        item.active = false
    });
    item.active = true
    router.push(item.path)
}

// 左侧栏下部分
let createSongList = reactive([])

let collectSonglist = reactive([])

// 跳转到歌单页

let toSongList = (id) => {
    router.push({
        path:'/songlist',
        query:{
            songListInfoId:id
        }
    })
}

onMounted(async ()=>{
    if(!userInfo.value.nickname){
        if(localStorage.getItem('userInfo')){
            userInfo.value = JSON.parse(localStorage.getItem('userInfo'))
        }
    }
    const {data} = await getUserSongList({
        uid:userInfo.value.id
    })
    data?.playlist?.map(item=>{
        if(item.creator.nickname === userInfo.value.nickname){
            createSongList.push(item)
        } else {
            collectSonglist.push(item)
        }
    })
})

</script>



<style lang="less" scoped>
.hidden{
    width: 200px;
    height: 100%;
    overflow: hidden;
    padding-bottom: 75px;
    box-sizing: border-box;
    border-right: 1px solid rgba(0,0,0,0.1);
    border-top: 1px solid rgba(0,0,0,0.1);
    z-index: 1;
}
.container{
    width: 220px;
    height: 100%;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
}
.sidebar{
    display: flex;
    flex-wrap: wrap;
    flex-direction:column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 200px;
    min-width: 200px;
    .side_top{
        padding-left: 5px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        flex-direction: column;
        flex-wrap: wrap;
        width: 100%;
        height: 200px;
        .side_cell{
            width: 97%;
            box-sizing: border-box;
            padding: 10px 10px;
            font-size: 18px;
            font-weight: 100;
            border-radius: 5px;
            transition: all 0.1s;
            cursor: pointer;
        }
        .side_cell:hover{
            background-color: rgb(240, 231, 232);
        }
        .active{
            font-size: 20px;
            font-weight: 500;
            background-color: rgb(240, 231, 232);
        }
    }  
    .side_bottom{
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 20px 0;
        box-sizing: border-box;
        .song_list{
            padding:0 10px;
            width: 180px;
            border: 0;
            font-size: 18px;
            .songList_cell{
                width: 97%;
                box-sizing: border-box;
                padding: 10px 10px;
                font-size: 14px;
                font-weight: 100;
                border-radius: 5px;
                transition: all 0.1s;
                cursor: pointer;
            }
            .songList_cell:hover{
                background-color: #f4dcdc;
            }
        }
        .el-collapse{
            border: 0;
            padding-right: 10px;
        }
        .el-collapse-item__header{
            border: 0;
        }
    }
}
</style>