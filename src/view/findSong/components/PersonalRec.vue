<template>
    <div class="container">
        <div class="section">
            <h2 class="title">{{ title }}</h2>
            <div class="section-main">
                <div class="main-box" v-for="item in section1List" @click="handleClick(item.listId)" :key="item.name">
                    <div v-if="item.name === '每日歌曲推荐'" class="date iconfont">
                        &#xe685;
                        <span class="day">{{ day }}</span>
                    </div>

                    <div class="left-img" fit="cover">
                        <img class="opacity0" @load="handleLoad" :src="item.coverSrc + '?params=150y150'" />
                    </div>
                    <div class="right-info">
                        <h4>{{ item.name }}</h4>
                        <div class="des">{{ item.des }}</div>
                    </div>
                    <div class="playBtn iconfont" @click.stop="handlePlayClick(item)">&#xe87c;</div>
                </div>
            </div>
        </div>
    </div>
    <!-- 每日推荐 -->
    <div class="suggest_playlist">
        <suggestList :suggestLists="dailyList" :title="dailyListTitle"></suggestList>
    </div>
    <!-- 每日推荐 -->

    <!-- 推荐歌单 -->
    <div class="suggest_playlist">
        <suggestList :suggestLists="suggestLists" :title="suggestListsTitle"></suggestList>
    </div>
    <!-- 推荐歌单 -->
    <!-- 精品歌单 -->
    <div class="suggest_playlist">
        <suggestList :suggestLists="highPlayList" :title="highPlayListTitle"></suggestList>
    </div>
    <!-- 精品歌单 -->
</template>

<script setup>
import { eventBus } from "../../../utils/eventBus";
import { getHighPlayList } from "@/api/songList";
import { getDailySongs as getPrivate, getSongListAllSong, getDailyList } from '@/api/songList';
import { getDailySongs as getDaily } from '@/api/myFavourite'
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import playAll from '../../../utils/playAll';
import suggestList from './suggestList.vue';

const router = useRouter();
let suggestLists = reactive([])
let suggestListsTitle = '推荐歌单'
let dailyList = reactive([])
let dailyListTitle = '每日推荐'
let highPlayList = reactive([])
let highPlayListTitle = '精品歌单'

const day = ref(new Date().getDate())
const title = computed(() => {
    const time = new Date().getHours();
    if (time < 4) {
        return "睡会吧"
    } else if (time < 8) {
        return "早上好"
    } else if (time < 12) {
        return "上午好"
    } else if (time < 18) {
        return "下午好"
    } else {
        return "晚上好"
    }
})
const section1List = reactive([
    {
        name: '每日歌曲推荐',
        coverSrc: '',
        des: '',
        listId: '',
        songList: []
    },
    {
        name: '私人雷达',
        coverSrc: '',
        des: '',
        listId: '',
        songList: []
    },
    {
        name: '私人订制',
        coverSrc: '',
        des: '',
        listId: '',
        songList: []
    }
])
// 初始化部分信息
const getCover = async () => {
    try {
        const { data: data1 } = await getPrivate()
        const { data: data2 } = await getDaily()
        if (data1.code === 200 && data2.code === 200) {
            // 设置封面
            section1List[0].coverSrc = data2.data.dailySongs[0].al.picUrl;
            section1List[1].coverSrc = data1.recommend[0].picUrl;
            section1List[2].coverSrc = data1.recommend[4].picUrl;
            // 每日推荐
            data1.recommend?.forEach((item, index) => {
                if (index <= 9) {
                    dailyList.push(item)
                }
            })
            // 绑定歌单id
            section1List[1].listId = data1.recommend[0].id;
            section1List[2].listId = data1.recommend[4].id;

            // 获取歌单第一首歌
            const { data: songs1 } = await getSongListAllSong({
                id: section1List[1].listId
            })
            const { data: songs2 } = await getSongListAllSong({
                id: section1List[2].listId
            })

            // 设置描述
            section1List[1].des = songs1.songs[0].name + '-' + songs1.songs[0].ar[0].name;
            section1List[2].des = songs2.songs[0].name + '-' + songs2.songs[0].ar[0].name;
            // 设置歌曲列表
            section1List[1].songList = songs1.songs;
            section1List[2].songList = songs2.songs;
            section1List[0].songList = data2.data.dailySongs;
            // 获取推荐歌单
            const res2 = await getDailyList({
                limit: 10
            })
            res2?.data?.result?.forEach((item, index) => {
                suggestLists.push(item)
            })

            // 获取精品歌单
            const { data: highList } = await getHighPlayList({
                limit: 50,
                cat: 'ACG'
            })
            highList.playlists?.forEach((item, index) => {
                highPlayList.push(item)
            })
        }
    } catch (error) {
        console.log(error);
        if (error.response?.status === 301) {
            ElMessage.error('登录过期，请重新登录')
            eventBus.$emit('logout')
        }
    }

}
// 跳转到歌单详情页面
let toSongList = (id) => {
    router.push({
        path: '/songlist',
        query: {
            songListInfoId: id
        }
    })
}
// 跳转到歌单详情页面
const handleClick = (listId) => {
    if (listId) {
        toSongList(listId)
    } else {
        router.push("/suggestSong")
    }
}
// 播放歌单全部音乐
const handlePlayClick = (item) => {
    if (item.songList.length) {
        playAll(item.songList);
    }
}
const handleLoad = (e) => {
    e.target.style.opacity = 1;
}

// 初始化
onBeforeMount(() => {
    getCover()
})


</script>

<style lang="less" scoped>
.opacity0 {
    opacity: 0;
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.left-img {
    overflow: hidden;
    background: linear-gradient(-45deg, #F1F2F3 25%, #fff 45%, #F1F2F3 65%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.2s ease-in-out infinite;
}

.container {
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    min-height: 300px;

    .title {
        font-size: 35px;
    }

    .section {
        width: 100%;

        .section-main {
            width: 100%;
            padding: 20px 0;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            gap: 25px;

            @media screen and (max-width: 1300px) {
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
            }

            .main-box {
                position: relative;
                width: 100%;
                height: 150px;
                background-color: var(--siderbar-active-color);
                border-radius: 25px;
                overflow: hidden;
                transition: all .3s;

                &:hover {
                    background-color: var(--hover-darken);
                    border-radius: 10px;
                    cursor: pointer;

                    .playBtn {
                        opacity: 1;
                    }
                }

                &:nth-child(1) {
                    overflow: hidden;
                    display: flex;
                    align-items: center;

                    .left-img {
                        height: 110%;
                        transform: translate(-10px);
                        filter: blur(3px);
                        z-index: 0;
                    }
                }
            }

            .date {
                position: absolute;
                top: 0;
                left: 0;
                line-height: 150px;
                text-align: center;
                height: 100%;
                aspect-ratio: 1;
                color: #fff;
                z-index: 2;
                background-color: rgba(0, 0, 0, 0.1);
                font-size: 100px;

                .day {
                    text-align: center;
                    line-height: 150px;
                    position: absolute;
                    top: 15px;
                    left: 0;
                    height: 100%;
                    aspect-ratio: 1;
                    z-index: 3;
                    color: #fff;
                    font-size: 40px;
                    font-weight: 700;
                }
            }

            .left-img {
                float: left;
                height: 100%;
                aspect-ratio: 1;
                overflow: hidden;
            }

            .right-info {
                padding: 10px 20px;
                box-sizing: border-box;
                height: 100%;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: flex-start;
                font-size: 20px;

                .des {
                    width: 100%;
                    margin-top: 5px;
                    font-size: 13px;
                    color: var(--font-color-light);
                }
            }

            .playBtn {
                opacity: 0;
                color: var(--inner-body-color);
                padding-left: 12px;
                box-sizing: border-box;
                line-height: 45px;
                font-size: 25px;
                border-radius: 50%;
                width: 45px;
                aspect-ratio: 1;
                background: var(--click-enable-color);
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translate(0, -50%);
                transition: all .3s;

                &:hover {
                    transform: translate(0, -50%) scale(1.1);
                }

                &:active {
                    transform: translate(0, -50%);
                }
            }
        }
    }
}
</style>