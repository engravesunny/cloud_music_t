<template>
    <el-scrollbar >
        <div class="findSongContainer unselectable">
            <swiper :items="bannerList"></swiper>

            <!-- 每日推荐 -->
            <div v-if="dailyList.length" class="suggest_playlist">
                <suggestList :suggestLists="dailyList" :title="dailyListTitle"></suggestList>
            </div>
            <!-- 每日推荐 -->

            <!-- 推荐歌单 -->
            <div v-if="suggestLists.length" class="suggest_playlist">
                <suggestList :suggestLists="suggestLists" :title="suggestListsTitle"></suggestList>
            </div>
            <!-- 推荐歌单 -->

            <!-- 精品歌单 -->
            <div v-if="highPlayList.length" class="suggest_playlist">
                <suggestList :suggestLists="highPlayList" :title="highPlayListTitle"></suggestList>
            </div>
            <!-- 精品歌单 -->
        </div>
    </el-scrollbar>
    
</template>

<script setup>
import suggestList from './components/suggestList.vue'
import swiper from './components/swiper.vue';
import { getHotBanner, getHighPlayList, getDailyList,getDailySongs } from '@/api/songList'

let bannerList = reactive([])

let highPlayList = reactive([])
let highPlayListTitle = '精品歌单'
let suggestLists = reactive([])
let suggestListsTitle = '推荐歌单'
let dailyList = reactive([])
let dailyListTitle = '每日推荐'
onMounted(async()=>{
    // 获取轮播图
    const { data } = await getHotBanner({
        type:0
    })
    data.banners.forEach(item => {
        bannerList.push(item)
    });

    // 获取每日推荐歌单
    const res3 = await getDailySongs()
    res3?.data?.recommend?.forEach((item,index)=>{
        if(index <= 9){
            dailyList.push(item)
        }
    })


    // 获取推荐歌单
    const res2 = await getDailyList({
        limit:10
    })
    res2?.data?.result?.forEach((item,index)=>{
        suggestLists.push(item)
    })

    // 获取精品歌单
    const res1 = await getHighPlayList({
        limit:50,
        cat:'ACG'
    })
    res1?.data?.playlists?.forEach((item,index)=>{
        highPlayList.push(item)
    })
})

const userInfo =async () => {
    const res = await getUserInfoDetail()
}



</script>

<style lang="less" scoped>
.findSongContainer{
    margin-bottom: 75px;
    .suggest_playlist{
        padding: 20px;
    }
}
</style>