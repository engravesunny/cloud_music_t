<template>
    <div class="song" :style="{ transform: `translateY(${show ? 0 : 100}%)` }">
        <el-scrollbar ref="scrollbar">
            <div v-if="song" class="pricateFM_container unselectable">
                <!-- 顶部歌曲内容 -->
                <div class="top">
                    <!-- 左侧歌曲封面和操作按钮 -->
                    <div class="options_left">
                        <div class="img">
                            <el-image @load="opacity = 1" style="border-radius:10px;height: 100%;width: 100%;"
                                :style="{ opacity }" fit="cover" :src="song.picUrl + '?params=100y100'"
                                alt="歌曲封面"></el-image>
                            <div class="playbtn"></div>
                        </div>
                        <div class="btn">
                            <button @click="likeIt(false)" v-if="isLiking" class="iconfont">
                                <span>&#xe8c3;</span>
                            </button>
                            <button @click="likeIt(true)" v-else class="iconfont">
                                <span>&#xe8ab;</span>
                            </button>
                            <button @click="play" class="iconfont">
                                <span>&#xe87c;</span>
                            </button>
                            <button @click="next" class="iconfont">
                                <span>&#xe63e;</span>
                            </button>
                        </div>
                    </div>
                    <!-- 左侧歌曲封面和操作按钮 -->
                    <!-- 右侧歌曲信息和歌词 -->
                    <div class="songInfo_right">
                        <div class="songInfo">
                            <div class="name">
                                <h2>{{ song.name }}</h2>
                            </div>
                            <div class="other">
                                <div class="ablum shenglue" :title="song.album">专辑: {{ song.album }}</div>
                                <div class="singer shenglue" :title="mulArShow(song.ar)">歌手: {{ mulArShow(song.ar) }}</div>
                            </div>
                        </div>
                        <song-text v-if="songTextInfo" :index="0" :audio="audioDom" :song-text="songTextInfo" />
                    </div>
                    <!-- 右侧歌曲信息和歌词 -->
                </div>
                <!-- 顶部歌曲内容 -->

                <!-- 底部评论内容 -->
                <div class="bottom" ref="commentArea">
                    <!-- 发送评论 -->
                    <div class="sendCommit_Box" v-if="showComment">
                        <div class="title">评论<span class="ds">（已有{{ total }}条评论）</span></div>
                        <div class="input_box">
                            <div class="commentBtn" v-if="commentText" @click="handleSendComment">发送</div>
                            <textarea v-model="commentText" placeholder="发一条评论吧" class="commentText" name="评论区"
                                id="comment"></textarea>
                        </div>
                    </div>
                    <!-- 发送评论 -->

                    <!-- 歌曲评论 -->
                    <normal-commit ref="commentComponent" v-if="showComment" @update-total="updateTotal"></normal-commit>
                    <!-- 歌曲评论 -->
                </div>
                <!-- 底部评论内容 -->
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { toLikeSong } from '../../api/myFavourite'
import myLikeIds from '../../utils/myLikeIds.js'
import mulArShow from '../../utils/mulArShow'
import normalCommit from '../privateFM/components/normalCommit.vue'
import songText from '../privateFM/components/songText.vue'
import { getSongText } from '../../api/song'
import { song as songs } from '../../store/song'
import { storeToRefs } from 'pinia'
import { sendComment } from '../../api/songList'
import { eventBus } from '../../utils/eventBus'
const { songInfo, currentPlayingSong } = storeToRefs(songs());
// 滚动条
const scrollbar = ref();
provide('scrollbar', scrollbar);

// 歌曲信息
const props = defineProps<{
    playIt: Function,
    nextSong: Function,
    audioDom: HTMLAudioElement,
    show: boolean
}>()

// 播放，下一首
const play = () => {
    props.playIt();
}
const next = () => {
    props.nextSong();
}

// 播放器元素
// let audioDom = ref();
// 歌词信息
const songTextInfo = reactive<any[]>([])
const getSongTextInfo = async () => {
    const { data: textInfo } = await getSongText({
        id: songInfo.value.currentPlayingSong.id
    })
    songTextInfo.length = 0;
    songTextInfo[0] = textInfo?.lrc?.lyric || "";
}
// 歌曲封面透明度
const opacity = ref(0);
// 更新喜欢的音乐的id
let likeIds = ref<string[]>([])
let isLiking = computed(() => {
    return likeIds.value.includes(songInfo.value.currentPlayingSong.id);
})
const updateLikeIds = async () => {
    const ids = await myLikeIds()
    likeIds.value = ids;
}
// 点击喜欢红心
const likeIt = async (like: boolean) => {
    try {
        const res = await toLikeSong({
            id: songInfo.value.currentPlayingSong.id,
            like
        })
        updateLikeIds()
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

// 评论
const commentComponent = ref();
const total = ref(0)
const commentText = ref('')
const commentArea = ref<HTMLDivElement>()
const showComment = ref(false)
const handleSendComment = async () => {
    try {
        // 请求发送接口
        const { data } = await sendComment({
            id: currentPlayingSong.value.id,
            type: 0,
            t: 1,
            content: commentText.value
        })
        // 判断发送状态
        if (data.code === 200) {
            ElMessage.success('发送成功')
            // 评论内容置空
            commentText.value = ''
            total.value++;
        } else {
            ElMessage.error('发送失败')
        }
        // 刷新评论列表
        eventBus.$emit('updateComments')
    } catch (error) {
        ElMessage.error('内部错误')
    }
}
const updateTotal = (ttl: number) => {
    total.value = ttl
}
const observerForComment = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                showComment.value = true
                observer.unobserve(commentArea.value as HTMLDivElement)
            }
        })
    })
    observer.observe(commentArea.value as HTMLDivElement)
}

// 歌曲信息
const song = ref<any>(null)

// 初始化
const init = async () => {
    // 歌曲信息
    song.value = songInfo.value;
    // 獲取歌詞信息
    await getSongTextInfo();
    // 获取当前喜欢歌曲id列表
    await updateLikeIds();
    // 监听是否打开
    observerForComment();
}

onBeforeMount(() => {
    init();
})

watch(() => songInfo.value.currentPlayingSong, () => {
    getSongTextInfo();
    commentComponent.value.setComments();
}, {
    deep: true
})

watch(() => props.show, () => {
    if (!props.show) {
        showComment.value = false;
        observerForComment();
    }
}, {
    deep: true
})


</script>

<style lang="less" scoped>
@keyframes upOut {
    0% {
        transform: translate(0, 100%);
    }

    100% {
        transform: translate(0, 0);
    }
}

@keyframes downIn {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(0, 100%);
    }
}

.song {
    width: 100vw;
    height: calc(100vh - 75px);
    position: fixed;
    top: 0;
    left: 0;
    background-color: var(--inner-body-color);
    z-index: 999;
    transition: transform .5s ease-in-out;
    will-change: transform;
}

.pricateFM_container {
    width: 100%;
    min-width: 871px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 75px;

    .top {
        width: 100%;
        height: 600px;
        display: flex;
        justify-content: center;
        align-items: center;

        .options_left {
            width: 400px;
            height: 500px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .img {
                margin: 20px;
                width: 300px;
                height: 300px;
                border-radius: 10px;
                overflow: hidden;
                background: linear-gradient(-45deg, #F1F2F3 25%, #fff 45%, #F1F2F3 65%);
                background-size: 400% 100%;
                animation: skeleton-loading 1.2s ease-in-out infinite;

                img {
                    width: 300px;
                    height: 300px;
                    border-radius: 10px;
                }
            }

            .btn {
                width: 300px;
                height: 100px;
                display: flex;
                justify-content: space-around;
                align-items: center;

                button {
                    padding-left: 2px;
                    color: var(--click-enable-color);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    line-height: 60px;
                    font-size: 30px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 2px solid var(--click-enable-color);
                    cursor: pointer;
                    background-color: var(--suggest-bg-color);
                }
            }
        }

        .songInfo_right {
            width: 400px;
            height: 500px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;

            .songInfo {
                margin: 20px;
                width: 300px;
                height: 100px;
                display: flex;
                flex-direction: column;

                .name {
                    padding: 5px;
                }

                .other {
                    display: flex;
                    padding: 5px;
                    font-size: 14px;
                    justify-content: flex-start;

                    .ablum {
                        margin: 5px;
                        width: 150px;
                    }

                    .singer {
                        width: 150px;
                        margin: 5px;
                    }
                }
            }
        }
    }

    .bottom {
        width: 80%;
        margin: 0 auto;

        .sendCommit_Box {
            border-radius: 10px;
            width: 100%;
            height: 200px;
            padding-bottom: 20px;
            box-sizing: border-box;
            margin-bottom: 20px;
            overflow: hidden;


            .title {
                font-size: 20px;
                font-weight: 700;
                padding: 10px 0;

                .ds {
                    font-size: 14px;
                    font-weight: 500;
                    color: rgb(123, 122, 122);
                }
            }

            .input_box {
                width: 100%;
                height: 100%;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
                background-color: var(--bg-color-global);



                .commentBtn {
                    border-radius: 5px;
                    position: absolute;
                    bottom: 40px;
                    right: 20px;
                    padding: 5px 10px;
                    background-color: var(--click-enable-color);
                    color: var(--inner-body-color);
                    transition: all .3s;
                    cursor: pointer;

                    &:active {
                        background-color: var(--siderbar-active-color);
                    }
                }

                .commentText {
                    box-sizing: border-box;
                    width: 100%;
                    border: none;
                    outline: none;
                    font-size: 16px;
                    font-family: inherit;
                    padding: 10px 20px;
                    background-color: var(--bg-color-global);
                    color: var(--font-color-global);
                }

                textarea {
                    width: 100%;
                    height: 100%;
                }
            }
        }


    }
}
</style>