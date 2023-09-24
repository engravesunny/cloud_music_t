<template>
    <el-scrollbar ref="scrollbar">
        <div class="singer-page" v-loading="!singeInfo.avatar">
            <!-- 歌手页上部信息区域 -->
            <singer-page-top :singer="singeInfo"></singer-page-top>
            <!-- 歌手页上部信息区域 -->
            <!-- 歌手页导航区域 -->
            <div class="singer-page-nav">
                <div class="singer-page-nav-item" @click="curNav = index" :class="{ active: index === curNav }"
                    v-for="(item, index) in navs" :key="item.name">{{ item.name }}</div>
            </div>
            <!-- 歌手页导航区域 -->
            <!-- 歌手页下部主题数据展示区域 -->
            <div v-loading="!singeInfo.avatar" style="min-height: 500px;">
                <component :is="navs[curNav].component" :id="singerId" :hot-albums="hotAlbums" :song-list="hotSongs">
                </component>
            </div>
            <!-- 歌手页下部主题数据展示区域 -->
        </div>
    </el-scrollbar>
</template>

<script setup lang="ts">
import singerAlbum from './components/singerAlbums.vue'
import singerDes from './components/singerDes.vue'
import simiSinger from './components/simiSinger.vue'
import singerPageTop from './components/singerPageTop.vue'
import { singerInfo } from './types'

import { computed, onMounted, ref, reactive, onBeforeMount } from 'vue';
import { getSingerAlbum, getSingerDes, getSingerDetail, getSingerSim, getSingerSongs } from '../../api/singerDetail'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const scrollbar = ref();
provide('scrollbar', scrollbar)

const route = useRoute();
const router = useRouter();

const curNav = ref(0)
// 导航信息
const navs = [
    {
        name: '专辑',
        component: singerAlbum
    },
    {
        name: '歌手详情',
        component: singerDes
    },
    {
        name: '相似歌手',
        component: simiSinger
    }
]
// 头部歌手信息展示
const initData = {
    name: '',
    nickname: [],
    avatar: '',
    dataCount: {
        songsCount: 0,
        albumsCount: 0,
        MVCount: 0
    }
}
const singeInfo = ref<singerInfo>(initData)
// top50歌曲
const hotSongs = ref([])
const initSingerInfo = async () => {
    try {
        if (route.path === '/singer') {
            if (!route.query.id) {
                router.push('/findSong')
                ElMessage.error('需要从歌手列表页进入')
                return
            }
        }
        const { data: Info } = await getSingerSongs({
            id: route.query.id
        })

        // 歌手信息
        const {
            albumSize: albumsCount,
            alias: nickname,
            img1v1Url: avatar,
            musicSize: songsCount,
            mvSize: MVCount,
            name
        } = Info.artist;
        singeInfo.value = {
            name,
            nickname,
            avatar,
            dataCount: {
                songsCount,
                MVCount,
                albumsCount
            }
        }

        // top50歌曲
        hotSongs.value = Info.hotSongs ?? []
    } catch (error: any) {
        ElMessage.error(error)
    }
}

// 热门专辑
const hotAlbums = ref([])
const initAlbums = async () => {
    try {
        const { data } = await getSingerAlbum({
            id: singerId.value
        })
        hotAlbums.value = data.hotAlbums ?? [];
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const singerId = computed(() => {
    return route.query.id as string;
})

onBeforeMount(() => {
    initSingerInfo();
    initAlbums();
})

watch(() => route, (val: any) => {
    if (val.path === '/singer') {
        scrollbar.value.setScrollTop(0)
        singeInfo.value = initData;
        hotSongs.value = [];
        hotAlbums.value = []
        curNav.value = 0;
        initSingerInfo();
        initAlbums();
    }
}, {
    deep: true
})

</script>

<style lang="less" scoped>
.singer-page {
    padding: 30px 0 0 30px;

    .singer-page-nav {
        width: 250px;
        margin: 30px 0;
        display: flex;
        justify-content: space-between;
        border-radius: 50px;
        background-color: var(--drag-box-color);
        overflow: hidden;

        &-item {
            border-radius: 50px;
            display: flex;
            justify-content: center;
            padding: 7px 15px;
            font-size: 16px;
            cursor: pointer;

            &.active {
                background-color: var(--siderbar-active-color);
                font-weight: 700;
            }
        }

        &-item:hover {
            background-color: var(--siderbar-active-color);
        }

    }
}
</style>