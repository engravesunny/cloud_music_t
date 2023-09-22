<template>
    <el-scrollbar ref="scrollRef">
        <div class="findSongContainer unselectable">

            <!-- 顶部导航 -->
            <page-nav @changeNav="changeNav"></page-nav>
            <!-- 顶部导航 -->

            <!-- 动态路由 -->
            <component :is="activeComponent" />
            <!-- 动态路由 -->

        </div>
    </el-scrollbar>
</template>

<script setup>
import PersonalRec from './components/PersonalRec.vue';
import singerList from './components/singerList.vue';
import latestSong from './components/latestSong.vue';
import playList from './components/playList.vue';
import rankList from './components/rankList.vue';
import CustMized from './components/custMized.vue';
import pageNav from './components/pageNav.vue'
import swiper from './components/swiper.vue';
import { getHotBanner } from '@/api/songList'
import { onBeforeMount, provide } from 'vue';

const PersonalRec1 = () => import('./components/PersonalRec.vue')

const scrollRef = ref();
provide('scrollbar', scrollRef)

const tabs = {
    PersonalRec,
    singerList,
    latestSong,
    playList,
    rankList,
    CustMized
}
const activeComponent = shallowRef(tabs['PersonalRec'])

const changeNav = (component) => {
    activeComponent.value = tabs[component]
}
let bannerList = reactive([])

onBeforeMount(async () => {
    // 获取轮播图
    const { data } = await getHotBanner({
        type: 0
    })
    data.banners.forEach(item => {
        bannerList.push(item)
    });
})
</script>

<style lang="less" scoped>
.findSongContainer {
    margin-bottom: 30px;
}
</style>