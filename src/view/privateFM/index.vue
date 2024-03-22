<template>
  <el-scrollbar ref="scrollbar">
    <div
      v-if="FMInfo.length"
      class="pricateFM_container unselectable"
    >
      <!-- 顶部歌曲内容 -->
      <div class="top">
        <!-- 左侧歌曲封面和操作按钮 -->
        <div class="options_left">
          <div class="img">
            <el-image
              style="border-radius:10px;height: 100%;width: 100%;"
              :style="{ opacity }"
              fit="cover"
              :src="FMInfo[index].album.picUrl + '?params=100y100'"
              alt="img"
              @load="opacity = 1"
            />
            <div class="playbtn" />
          </div>
          <div class="btn">
            <button
              v-if="isLiking"
              class="iconfont"
              @click="likeIt(false)"
            >
              <span>&#xe8c3;</span>
            </button>
            <button
              v-else
              class="iconfont"
              @click="likeIt(true)"
            >
              <span>&#xe8ab;</span>
            </button>
            <button
              class="iconfont"
              @click="playIt"
            >
              <span>&#xe87c;</span>
            </button>
            <button
              class="iconfont"
              @click="nextFM"
            >
              <span>&#xe63e;</span>
            </button>
          </div>
        </div>
        <!-- 左侧歌曲封面和操作按钮 -->
        <!-- 右侧歌曲信息和歌词 -->
        <div class="songInfo_right">
          <div class="songInfo">
            <div class="name">
              <h2>{{ FMInfo[index].name }}</h2>
            </div>
            <div class="other">
              <div
                class="ablum shenglue"
                :title="FMInfo[index].album.name"
              >
                专辑: {{ FMInfo[index].album.name }}
              </div>
              <div
                class="singer shenglue"
                :title="mulArShow(FMInfo[index].artists)"
              >
                歌手: {{
                  mulArShow(FMInfo[index].artists) }}
              </div>
            </div>
          </div>
          <song-text
            :audio="audioDom"
            :index="index"
            :song-text="songTextInfo"
          />
        </div>
        <!-- 右侧歌曲信息和歌词 -->
      </div>
      <!-- 顶部歌曲内容 -->

      <!-- 底部评论内容 -->
      <div class="bottom">
        <!-- 发送评论 -->
        <div class="sendCommit_Box">
          <div class="title">
            评论<span class="ds">（已有{{ total }}条评论）</span>
          </div>
          <div class="input_box">
            <div
              v-if="commentText"
              class="commentBtn"
              @click="handleSendComment"
            >
              发送
            </div>
            <textarea
              id="comment"
              v-model="commentText"
              placeholder="发一条评论吧"
              class="commentText"
              name="评论区"
            />
          </div>
        </div>
        <!-- 发送评论 -->

        <!-- 歌曲评论 -->
        <normal-commit
          :update-flag="updateFlag"
          :FMInfo="FMInfo"
          :index="index"
          @update-total="updateTotal"
        />
        <!-- 歌曲评论 -->
      </div>
      <!-- 底部评论内容 -->
    </div>
  </el-scrollbar>
</template>

<script setup>
import normalCommit from './components/normalCommit.vue'
import { getSongText } from '@/api/song.ts'
import songText from './components/songText.vue'
import { toLikeSong } from '@/api/myFavourite.js'
import isLiked from '@/utils/isLiked.js'
import myLikeIds from '@/utils/myLikeIds.js'
import FMMode from '@/utils/FMMode.js'
import playSong from '@/utils/playSong.js'
import { privateFM } from '@/api/myFavourite'
import mulArShow from '../../utils/mulArShow';
import { sendComment } from '@/api/songList.js'
import { eventBus } from '../../utils/eventBus'

const updateFlag = ref(0)
const opacity = ref(0)
const scrollbar = ref()
provide('scrollbar', scrollbar);

const commentText = ref('')
const handleSendComment = async () => {
    try {
        // 请求发送接口
        const { data } = await sendComment({
            id: FMInfo[index.value].id,
            type: 0,
            t: 1,
            content: commentText.value
        })
        // 判断发送状态
        if (data.code === 200) {
            ElMessage.success('发送成功')
            // 评论内容置空
            commentText.value = ''
        } else {
            ElMessage.error('发送失败')
        }
        // 刷新评论列表
        eventBus.$emit('updateComments')
    } catch (error) {
        ElMessage.error('内部错误')
    }
}

const router = useRouter()
const route = useRoute()
const audioDom = ref();

// 歌词信息
const songTextInfo = reactive([])

// 是否为喜欢歌曲
let isLiking = ref(false)
let FMInfo = reactive([])
let index = ref(0)
let isFMMode = ref(false)

// 评论数
const total = ref(0)
const updateTotal = (ttl) => {
    total.value = ttl;
}
// 获取歌词
const handleGetSongText = async (id) => {
    if (songTextInfo.length) {
        songTextInfo.length = 0;
    }
    const promises = FMInfo.map(item => getSongText({ id: item.id }))
    const data = await Promise.all(promises);

    data.forEach(({ data }) => {
        const text = data?.lrc?.lyric
        songTextInfo.push(text);
    });
}
// 获取歌曲
const getFMSongs = async () => {
    FMInfo = reactive([])
    const { data } = await privateFM()
    data.data.map(item => {
        FMInfo.push(item)
    })
    // 获取歌词
    await handleGetSongText();
}
// 播放歌曲
const playIt = async () => {
    isFMMode.value = true
    await FMMode(true)
    await playSong(FMInfo[index.value])
    let audio = document.querySelector('audio')
    audioDom.value = audio;
    audio.onended = () => {
        nextFM()
        audio.onended = null
        audio.ontimeupdate = null
    }
}
// 下一首FM
const nextFM = async () => {
    opacity.value = 0;
    index.value = index.value + 1
    if (FMInfo[index.value]) {
        isLiking.value = isLiked(FMInfo[index.value].id, likeIds)
        playIt()
    } else {
        const audio = document.querySelector('audio')
        audio.pause();
        index.value = 0
        await getFMSongs()
        isLiking.value = isLiked(FMInfo[index.value].id, likeIds)
        playIt()
    }
}

// 点击喜欢红心
const likeIt = async (like) => {
    try {
        await toLikeSong({
            id: FMInfo[index.value].id,
            like
        })
        isLiking.value = like
        updateLikeIds()
    } catch (error) {
        ElMessage.error(error);
    }
}

// 喜欢的歌曲ids
let likeIds = reactive([])
const updateLikeIds = async () => {
    const ids = await myLikeIds()
    likeIds = likeIds.concat(ids);
}

// 初始化
const init = async () => {
    await getFMSongs()
    await updateLikeIds()
    isLiking.value = isLiked(FMInfo[index.value].id, likeIds)
}

onMounted(() => {
    init();
})
onBeforeUnmount(() => {
    FMMode(false)
})

// 进入非FM页面时关闭FM模式
watch(route, (val) => {
    if (val.path !== '/privateFM' && isFMMode.value) {
        FMMode(false)
    }
}, {
    deep: true,
    immediate: true
})


</script>

<style lang="less" scoped>
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