<template>
    <div class="top50">
        <div class="right">
            <div class="topBtn">
                <div class="title">热门50首 </div>
                <div @click="playAll(songList)" class="playAll iconfont">&#xe600;</div>
                <div @click="addList(songList)" class="addAll iconfont">&#xe86a;</div>
            </div>
            <div class="bottomList">
                <div class="list-item unselectable" @dblclick="dbClickSong(item)" v-for="(item, index) in songFinalList"
                    :key="item.id">
                    <div class="option">
                        <div v-if="item.id === songInfo.currentPlayingSong.id" class="playingIcon iconfont">&#xe62e;</div>
                        <div v-else class="index">{{ (index + 1) < 10 ? '0' + (index + 1) : (index + 1) }}</div>
                                <div @click="likeIt(item.id, false)" v-if="isLiked(item.id, userlikeIds)" class="iconfont">
                                    &#xe8c3;
                                </div>
                                <div @click="likeIt(item.id, true)" v-else class="iconfont">&#xe8ab;</div>
                        </div>
                        <div class="songName">{{ item.name }}</div>
                        <div class="songTime">{{ formatTime(item.dt) }}</div>
                    </div>
                    <div v-if="showSize === 10" class="extendRest" @click="showSize = 50">查看全部50首</div>
                </div>
            </div>
        </div>

        <!-- 专辑列表 -->
        <div class="albumList">
            <div class="title">热门专辑</div>
            <album-list :hotAlbums="hotAlbums" :top-height="topHeight"></album-list>
        </div>
        <!-- 专辑列表 -->
</template>

<script setup lang="ts">
import playAll from '../../../utils/playAll';
import { addList } from '../../../utils/playAll'
import dbClickSong from '../../../utils/playSong'
import albumList from './albumList.vue';
import { user } from '../../../store/user';
import { toLikeSong, getMyFavourite } from '../../../api/myFavourite';
import isLiked from '../../../utils/isLiked';
import formatTime from '../../../utils/formatTime';
import { song } from '../../../store/song';
import { storeToRefs } from 'pinia';
const songStore = storeToRefs(song())
const { userInfo } = storeToRefs(user())
const songInfo = songStore.songInfo;
const router = useRouter()
const props = defineProps<{
    songList: any[],
    hotAlbums: any[],
    id?: string
}>()
const userlikeIds = reactive<any[]>([])
// 获取用户喜欢列表
const getLikeIds = async () => {
    const { data } = await getMyFavourite({
        uid: userInfo.value.id
    })
    if (data.ids) {
        (data.ids as any[]).map(item => {
            userlikeIds.push(item)
        })
    }
}

const likeIt = async (id: any, like: any) => {
    const res = await toLikeSong({
        id, like
    })
    getLikeIds()
    router.go(0)
}

const topHeight = computed(() => {
    return showSize.value === 10 ? 843 : 2404;
})
const showSize = ref(10)
const songFinalList = computed(() => {
    return props.songList.slice(0, showSize.value)
})
watch(() => props.id, () => {
    showSize.value = 10
})
</script>

<style lang="less" scoped>
.top50 {
    width: 100%;
    display: flex;
    gap: 50px;

    .left {
        width: 150px;
        height: 150px;
        background-color: pink;
    }

    .right {
        flex: 1;
        display: flex;
        flex-direction: column;

        .topBtn {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-weight: 700;
            gap: 10px;
            padding: 10px 20px;

            .title {
                margin-right: 10px;
            }

            .playAll {
                cursor: pointer;
            }

            .addAll {
                cursor: pointer;
            }

            .iconfont {
                font-weight: 500;
                font-size: 20px;
                color: var(--font-color-light);
            }

            .iconfont+.iconfont {
                position: relative;

                &::before {
                    position: absolute;
                    top: 50%;
                    left: -5px;
                    transform: translateY(-50%) scale(0.5);
                    content: "";
                    width: 1px;
                    height: 20px;
                    background-color: var(--font-color-light);
                }
            }
        }

        .bottomList {
            width: 100%;
            padding: 20px 0;
            background-color: var(--song-li-color);
            border-radius: 20px 0 0 20px;
            box-shadow: 0 0 5px 2px rgba(37, 128, 255, 0.1);

            .extendRest {
                box-sizing: border-box;
                width: 100%;
                text-align: right;
                font-size: 14px;
                color: var(--font-color-light);
                padding: 10px 20px;
            }

            .list-item {
                width: 100%;
                height: 40px;
                background-color: var(--song-li-color);
                display: flex;
                line-height: 40px;
                box-sizing: border-box;
                cursor: pointer;
                font-size: 14px;



                .option {
                    box-sizing: border-box;
                    padding-left: 70px;
                    width: 10.2%;
                    display: flex;
                    justify-content: flex-start;

                    .playingIcon {
                        margin-left: -40px !important;
                    }

                    .index {
                        margin-left: -40px;
                    }

                    .iconfont {
                        margin-left: 28px;
                        color: red;
                        cursor: pointer;
                    }
                }

                .songName {
                    box-sizing: border-box;
                    padding-left: 40px;
                    flex: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    box-sizing: border-box;
                    padding-right: 10px;
                }

                .songTime {
                    width: 10%;
                }

                &:hover {
                    background-color: var(--song-hover-color);
                }
            }
        }
    }
}

.albumList {
    padding: 20px 0;

    .title {
        font-size: 20px;
        font-weight: 700;
    }
}
</style>