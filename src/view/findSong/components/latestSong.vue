<template>
    <div class="cateList">
        <div class="left">
            <div class="left-item" @click="changeCate(item)" :class="{ active: areaActive === item }"
                v-for="item in AreaArr" :key="item">
                {{ item }}
            </div>
        </div>
        <div class="right">
            <div class="playAll" @click="playAll(newSongsList)">播放全部</div>
        </div>
    </div>
    <div class="main">
        <div class="song-list">
            <virtual-list :cols="1" :data-source="newSongsList" :item-height="100" :top-height="240">
                <template #item="{ item, col }">
                    <div class="song-list-item" @dblclick="handlePlayClick(col.content)">
                        <div class="left">
                            <div class="index"
                                v-if="col.content.id !== (songStore.songInfo.value.currentPlayingSong as any).id">{{
                                    col.id + 1 }}</div>
                            <div class="index iconfont" v-else>&#xe62e;</div>
                            <div class="img">
                                <el-image :src="col.content.album.picUrl + '?params=60y60'" class="opacity"
                                    @load="handleLoad" />
                                <div class="playBtn iconfont" @click="handlePlayClick(col.content)">&#xe87c;</div>
                            </div>
                            <div class="name">{{ col.content.name }}</div>
                        </div>
                        <div class="right">
                            <div class="art">
                                {{ col.content.artists[0].name }}
                            </div>
                            <div class="album">
                                {{ col.content.name }}
                            </div>
                            <div class="timeLen">
                                {{ formatTime(col.content.duration) }}
                            </div>
                        </div>
                    </div>
                </template>
            </virtual-list>

        </div>
    </div>
</template>

<script setup lang="ts">
import virtualList from '../../../components/virtualListNews/index.vue'
import { getNewSongs } from '../../../api/songList.js'
import formatTime from '../../../utils/formatTime.js'
import { addList } from '../../../utils/playAll';
import playSong from '../../../utils/playSong';
import { song } from '../../../store/song';
import { storeToRefs } from 'pinia';
import playAll from '../../../utils/playAll';
const songStore = storeToRefs(song());
// 新歌速递
// type: 地区类型 id,对应以下:  

// 全部:0

// 华语:7

// 欧美:96

// 日本:8

// 韩国:16
const AreaArr = ['全部',
    '华语',
    '日本',
    '韩国',
    '欧美']
enum Area {
    '全部',
    '华语' = 7,
    '日本' = 8,
    '韩国' = 16,
    '欧美' = 96,
}

const areaActive = ref('全部')
const areaType = ref<number | string>(0)
const handleLoad = (e: any) => {
    e.target.parentNode.style.opacity = 1
}
const changeCate = (cate: any) => {
    areaActive.value = cate;
    areaType.value = Area[cate];
    newSongsList.length = 0;
    getSongs();
}
const newSongsList = reactive<any[]>([])

interface SongsParams {
    type?: string | number
}
const getSongs = async () => {
    try {
        const params: SongsParams = {
            type: areaType.value
        };
        const { data: news } = await getNewSongs(params)
        const songs = news?.data as any[];
        songs.forEach(item => {
            newSongsList.push(item);
        });
    } catch (error: any) {
        ElMessage.error(error)
    }
}
const init = () => {
    getSongs();
}

const handlePlayClick = async (item: any) => {
    addList(newSongsList)
    playSong(item);
}

onMounted(() => {
    init();
})




</script>

<style lang="less" scoped>
.opacity {
    opacity: 0;
}

.cateList {
    margin: 0 auto;
    box-sizing: border-box;
    padding: 20px;
    width: 90%;
    display: flex;
    justify-content: space-between;

    .left,
    .right {
        display: flex;
        gap: 10px;

        .left-item {
            font-size: 14px;
            cursor: pointer;
        }

        .playAll {
            font-size: 14px;
            cursor: pointer;
        }

        .active {
            font-weight: 700;
        }
    }
}

.main {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;

    .song-list {
        margin: 10px auto;
        width: 90%;
        min-height: 500px;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 20px;

        .song-list-item {
            width: 100%;
            height: 80px;
            background-color: var(--song-li-color);
            display: flex;
            justify-content: space-between;
            border-radius: 15px;
            box-sizing: border-box;
            padding: 10px;
            padding-left: 50px;
            cursor: pointer;

            .left {
                display: flex;
                height: 100%;
                width: 45%;
                align-items: center;

                .img {
                    position: relative;
                    height: 110%;
                    aspect-ratio: 1;
                    border-radius: 10px;
                    overflow: hidden;
                    background: linear-gradient(-45deg, #F1F2F3 25%, #fff 45%, #F1F2F3 65%);
                    background-size: 400% 100%;
                    animation: skeleton-loading 1.2s ease-in-out infinite;

                    &:hover {
                        .playBtn {
                            opacity: 1;
                        }
                    }

                    .playBtn {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 30px;
                        height: 30px;
                        aspect-ratio: 1;
                        color: var(--inner-body-color);
                        background: var(--click-enable-color);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 50%;
                        opacity: 0;
                        transition: all .1s;

                        &:active {
                            transform: scale(.9) translate(-50%, -50%);
                        }
                    }
                }

                .index {
                    font-size: 14px;
                    padding-top: 5px;
                    box-sizing: border-box;
                    height: 100%;
                    width: 30px;
                    color: var(--font-color-light);
                }

                .name {
                    flex: 1;
                    padding-top: 5px;
                    box-sizing: border-box;
                    height: 100%;
                    margin-left: 10px;
                    overflow: hidden;
                    white-space: nowrap;
                    -webkit-line-clamp: 2;
                    text-overflow: ellipsis;
                }
            }

            .right {
                flex: 1;
                display: flex;
                justify-content: flex-start;
                color: var(--font-color-light);
                font-size: 14px;

                .art {
                    width: 30%;
                }

                .album {
                    flex: 1;
                }

                .timeLen {
                    width: 50px;
                }
            }

            &:hover {
                background-color: var(--siderbar-active-color);
            }
        }
    }
}
</style>