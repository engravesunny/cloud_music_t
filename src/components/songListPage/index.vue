<template>
    <div class="songListPage_container unselectable">
        <!-- 歌单信息 -->
        <div v-loading="loading || !songList_info[0] || !songList_info[0].coverImgUrl" v-if="songList_info[0]"
            class="songList_Info">
            <!-- 歌单封面（左边） -->
            <div v-if="songList_info[0]" class="list_cover">
                <img :src="songList_info[0].coverImgUrl" alt="">
            </div>
            <!-- 歌单封面（左边） -->

            <!-- 其他信息（右边） -->
            <div v-loading="!songList_info[0]" class="other_info">
                <!-- 歌单标题 -->
                <div v-if="songList_info[0]" class="list_title">
                    <span>{{ songList_info[0].name }}</span>
                </div>
                <!-- 歌单标题 -->

                <!-- 创建信息 -->
                <div v-if="songList_info[0].creator" class="found_info">
                    <!-- 创建者昵称 -->
                    <div class="createAvatar">
                        <img :src="songList_info[0].creator.avatarUrl" alt="">
                    </div>
                    <div class="found_name">{{ songList_info[0].creator.nickname }}</div>
                    <!-- 创建者昵称 -->

                    <!-- 创建日期 -->
                    <div class="found_date">{{ formatDate(songList_info[0].createTime) + '创建' }}</div>
                    <!-- 创建日期 -->
                </div>
                <!-- 创建信息 -->

                <!-- 其他信息 -->
                <div class="rest_info">

                    <!-- 歌曲总数 -->
                    <div class="songs_total iconfont">&#xea86; {{ songList_info[0].trackCount }}</div>
                    <!-- 歌曲总数 -->

                    <!-- 播放量 -->
                    <div class="songs_playtotal iconfont">&#xe600; {{ songList_info[0].playCount }}</div>
                    <!-- 播放量 -->
                </div>
                <!-- 其他信息 -->

                <!-- 播放全部按钮 -->
                <div class="playall_btn">
                    <el-button @click="playAllFn" class="iconfont btn" type="primary"
                        style="background:var(--click-enable-color)">&#xe87c;</el-button>
                    <div class="addList iconfont" @click="addAllList">&#xe86a;</div>
                </div>
                <!-- 播放全部按钮 -->
            </div>
            <!-- 其他信息（右边） -->

        </div>
        <!-- 歌单信息 -->

        <!-- 歌曲列表 -->
        <singleSong v-if="songList.length" v-loading="!songList.length" :songTotal="0" :current-pages="0"
            :result="songList"></singleSong>
        <!-- 歌曲列表 -->
        <!-- 加载状态 -->
        <p class="loading" v-if="isloading">Loading...</p>
        <p class="loading" v-if="finished">已经没有了哦</p>
        <div ref="observerDom"></div>
    </div>
</template>

<script setup>
import playAll from '@/utils/playAll.js'
import { addList } from '../../utils/playAll';
import formatDate from '@/utils/formatDate.js';
import singleSong from '../singleSong/index.vue'
import { getSongListAllSong } from '@/api/songList.js'
import { onMounted } from 'vue';
const props = defineProps(['songListInfo'])
let timer = null
let loading = ref(true)
let songList = reactive([])
let offset = ref(0)
let isMounted = ref(false)
let isloading = ref(true)
let finished = ref(false)
const observerDom = ref(null);

let playAllFn = async () => {
    ElMessage('正在加载全部歌曲')
    const res = await getSongListAllSong({
        id: props.songListInfo[0]?.id
    })
    ElMessage({
        type: 'success',
        message: '加载成功'
    })
    playAll(res.data?.songs)
}
const addAllList = async () => {
    ElMessage('正在加载全部歌曲')
    const res = await getSongListAllSong({
        id: props.songListInfo[0]?.id
    })
    ElMessage({
        type: 'success',
        message: '添加成功'
    })
    addList(res.data?.songs)
}
const load = async () => {
    if (finished.value) return
    if (!isMounted.value) return
    isloading.value = true
    offset.value = offset.value + 1
    const res = await getSongListAllSong({
        id: props.songListInfo[0]?.id,
        limit: 50,
        offset: offset.value * 50
    })
    if (res.data?.songs?.length === 0 && isMounted.value) {
        finished.value = true
        isloading.value = false
        return
    }
    res.data?.songs?.map(item => {
        songList.push(item)
    })
    isloading.value = false
}

const obserserListen = () => {
    const dom = observerDom.value;
    const observer = new IntersectionObserver((entrys) => {
        entrys.forEach((entry) => {
            if (entry.isIntersecting) {
                load();
            }
        })
    })
    observer.observe(dom);
}


let songList_info = reactive([])

onMounted(() => {
    obserserListen();
})


watch(props, async (val) => {
    offset.value = 0
    isMounted.value = false
    loading.value = true
    songList.length = 0;
    const res = await getSongListAllSong({
        id: val?.songListInfo[0]?.id,
        limit: 50,
        offset: offset.value * 100
    })
    songList_info.pop()
    songList_info.push(val.songListInfo[0])
    res.data?.songs?.map(item => {
        songList.push(item)
    })
    loading.value = false
    isMounted.value = true
}, {
    deep: true,
    immediate: false
})

</script>

<style lang="less" scoped>
.songListPage_container {
    width: 100%;
    min-height: calc(100vh - 230px);
    display: flex;
    flex-direction: column;
    padding-bottom: 75px;
    color: var(--font-color-global);

    .songList_Info {
        width: 100%;
        height: 300px;

        .list_cover {
            float: left;
            margin: 50px 20px 50px 50px;
            width: 200px;
            height: 200px;
            border-radius: 25px;
            overflow: hidden;

            img {
                width: 200px;
                height: 200px;
            }
        }

        .other_info {
            float: left;
            margin: 50px 0;
            width: 500px;
            height: 200px;
            display: flex;
            flex-direction: column;

            .list_title {
                margin: 8px;
                font-weight: 700;
                font-size: 30px;
            }

            .found_info {
                padding-left: 10px;
                display: flex;
                font-size: 14px;
                align-items: center;

                .createAvatar {
                    width: 25px;

                    img {
                        border-radius: 50%;
                        width: 25px;
                    }
                }

                .found_name {
                    margin: 8px;
                    font-weight: 700;
                }

                .found_date {
                    margin: 8px;
                    font-weight: 100;
                    color: gray;
                }
            }

            .playall_btn {
                margin: 8px;
                display: flex;
                width: 140px;
                height: 70px;
                justify-content: space-between;
                align-items: center;

                .btn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 60px;
                    height: 60px;
                    border-radius: 100%;
                    font-size: 30px;
                    transition: all .3s;
                }

                .btn:hover {
                    transform: scale(1.1);
                }

                .addList {
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    color: var(--click-enable-color);
                    cursor: pointer;
                    border-radius: 50%;
                }

                .addList:hover {
                    background-color: var(--siderbar-active-color);
                }
            }

            .rest_info {
                font-size: 14px;
                display: flex;

                .songs_total {
                    margin: 8px;
                    font-weight: 700;
                }

                .songs_playtotal {
                    margin: 8px;
                    font-weight: 700;
                }
            }
        }
    }

    .loading {
        width: 100%;
        height: 75px;
        line-height: 75px;
        text-align: center;
        color: gray;
    }
}
</style>