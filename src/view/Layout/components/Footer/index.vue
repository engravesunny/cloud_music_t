<template>
    <div class="footer unselectable">

        <!-- 歌曲封面 -->
        <div v-if="songState.picUrl" class="songImg" @click="handleShowSongDisplay">
            <img :src="songState.picUrl + '?params=80y80'" alt="">
        </div>
        <!-- 歌曲封面 -->

        <!-- 歌曲名称 -->
        <div v-if="songState.name" class="songInfo">
            <div class="songName shenglue" :title="songState.name">{{ songState.name }}</div>
            <div class="songAr shenglue" :title="mulArShow(songState.ar)">{{ mulArShow(songState.ar) }}</div>
        </div>
        <!-- 歌曲名称 -->

        <!-- 上一曲、暂停、下一曲 -->
        <div class="songOption">
            <div v-if="!isFM" class="beforeSong iconfont" @click="beforeSong">
                <p>&#xe63c;</p>
            </div>
            <div class="pause iconfont" @click="changePlayingState">
                <span v-if="isPlaying">&#xe87a;</span>
                <span v-else>&#xe87c;</span>
            </div>
            <div v-if="!isFM" class="nextSong iconfont" @click="SongEnd">
                <p>&#xe63e;</p>
            </div>
        </div>
        <!-- 上一曲、暂停、下一曲 -->

        <!-- 进度条、时间 -->
        <div class="timeProgress">
            <div class="played">{{ playedTime }}</div>
            <div class="progress">
                <el-slider v-model="playedProgress" :show-tooltip="false" @change="changePlayedTimeLast"
                    @input="changePlayedTime" />
            </div>
            <div class="duration">{{ formatTime(songState.playDuration) }}</div>
        </div>
        <!-- 进度条、时间 -->

        <!-- 播放模式 -->
        <div v-if="!isFM" class="playMode" @click="changePlayMode">
            <div v-if="songState.playMode === 0" class="seqPlay iconfont">&#xea6f;</div>
            <div v-if="songState.playMode === 1" class="loopPlay iconfont">&#xe66c;</div>
            <div v-if="songState.playMode === 2" class="singlePlay iconfont">&#xe66d;</div>
            <div v-if="songState.playMode === 3" class="randomPlay iconfont">&#xe66b;</div>
        </div>
        <!-- 播放模式 -->

        <!-- 音量 -->
        <volum class="volumeOption" v-if="isChangingVolume"></volum>
        <div class="volume iconfont"><span class="icon">&#xe605;</span></div>
        <!-- 音量 -->

        <!-- 播放列表 -->
        <div v-if="showSongList && !songState.FMMode" class="close" @click="showSongList = false">
            <songList v-if="showSongList"></songList>
        </div>
        <div v-if="!isFM" class="playList iconfont" @click="playListShow"><span class="icon">&#xe62d;</span></div>
        <div v-else class="playList iconfont" @click="playListShow"><span class="icon"></span></div>
        <!-- 播放列表 -->
    </div>
    <song-display :next-song="SongEnd" :play-it="changePlayingState" :audio-dom="audioDom"
        :show="showSongDisplay"></song-display>
</template>

<script setup>
// 歌曲展示
import songDisplay from '../../../song/index.vue';
// 歌曲列表组件
import songList from './components/songList.vue'
// 音量组件
import volum from './components/volum.vue';
// 引入时间转换工具
import formatTime from '../../../../utils/formatTime';
// 播放url工具
import createAudio from '../../../../utils/createAudio';
// 上一首、下一首函数
import nextSong from '../../../../utils/nextSong'
// 歌曲结束判定工具
import songEndFn from '../../../../utils/songEndFn'
// 歌曲url判定
import { checkSong } from '../../../../api/search';
import { getSongUrl } from '../../../../api/search';
// 引入图标
import '@/assets/icon/iconfont/iconfont.css'
// 引入多歌手分割工具
import mulArShow from '../../../../utils/mulArShow';
// 引入底部播放栏状态信息
import { song } from '@/store/song.js'
import { storeToRefs } from 'pinia'
const songStore = song()
let { songInfo } = storeToRefs(songStore)
const route = useRoute();
let audioDom = ref();
console.log(route.path);
// 当前是否为FM模式
const isFM = computed(() => {
    return songInfo.value.FMList.length && route.path === '/privateFM'
})

// 是否展示歌曲展示
const showSongDisplay = ref(false)
const handleShowSongDisplay = () => {
    console.log(showSongDisplay.value);
    showSongDisplay.value = !showSongDisplay.value
}

// 播放状态 暂停/播放
let isPlaying = ref(false)

// 暂停/播放函数
const changePlayingState = () => {
    isPlaying.value = !isPlaying.value
    let audio = document.querySelector('audio')
    if (audio?.paused) {
        audio.play()
    } else {
        audio.pause()
    }
}

// 播放状态暂存
let songState = songInfo.value

// 等用户再次来到页面时，读取本地缓存，有缓存就使用缓存，创建audio标签
let initAudio = async () => {
    try {
        if (songInfo.value.songUrl) {
            // 如果已有audio标签，就删除它
            const audios = document.querySelectorAll('audio')
            if (audios) {
                for (let i = 0; i < audios.length; i++) {
                    audios[i].remove()
                }
            }
            // 创建audio
            const createAudio = () => {
                const audio = document.createElement('audio')
                audio.autoplay = false
                audio.src = songInfo.value.songUrl
                audio.volume = songInfo.value.volume / 100
                audio.style = 'display:none;'
                document.body.appendChild(audio)
                audio.addEventListener('play', () => {
                    isPlaying.value = true
                })
                audio.addEventListener('pause', () => {
                    isPlaying.value = false
                })
                audio.addEventListener('timeupdate', changeTimeFn)
                // 歌曲结束是的判定函数
                audio.onended = () => {
                    songEndFn()
                    audio.onended = null
                }
                audioDom.value = audio;
            }

            // 判定歌曲url是否可用
            const { data } = await checkSong({
                url: songInfo.value.songUrl
            })
            if (data.success) {
                createAudio();
            } else {
                const { data: urlData } = await getSongUrl({
                    id: songInfo?.value?.currentPlayingSong?.id
                })
                if (urlData.code === 200) {
                    songInfo.value.currentPlayingSong = urlData.data[0]
                    songInfo.value.songUrl = urlData.data[0].url
                    createAudio();
                }
            }
            audioDom.value.pause();
        }
    } catch (error) {
        // console.log(error);
    }
}

// 初始化
onMounted(() => {
    changeVolume()
    initAudio();
})

// 已播放时长
let playedTime = ref('00:00')
// 已播放进度条
let playedProgress = ref(0)

// 拉进度条
const changePlayedTime = (val) => {
    let audio = document.querySelector('audio')
    audio.removeEventListener('timeupdate', changeTimeFn)
    playedTime.value = formatTime(audio.duration * val * 10)
}
// 松开进度条
const changePlayedTimeLast = (val) => {
    let audio = document.querySelector('audio')
    audio.currentTime = (audio.duration * val) / 100
    audio.addEventListener('timeupdate', changeTimeFn)
    audio.play()
}

// 音量控制
let isChangingVolume = ref(false)
let changeVolume = () => {
    let volume = document.querySelector('.volume')
    volume.addEventListener('mouseover', (e) => {
        isChangingVolume.value = true
        let x = e.clientX
        let y = e.clientY
        let Lx = 0
        let Ly = 0
        document.onmousemove = (e_e) => {
            Lx = Math.abs(e_e.clientX - x)
            Ly = Math.abs(e_e.clientY - y)
            if (Lx > 40 || Ly > 200) {
                isChangingVolume.value = false
                document.onmousemove = null
            }
        }
    })
}

// 展示播放列表
let showSongList = ref(false)
const playListShow = () => {
    if (isChangingVolume) isChangingVolume.value = false
    showSongList.value = !showSongList.value
}

// 改变播放模式
const changePlayMode = () => {
    if (isChangingVolume) isChangingVolume.value = false
    songInfo.value.playMode++;
    if (songInfo.value.playMode === 4) {
        songInfo.value.playMode = 0
    }
}

// 监听调用函数
const changeTimeFn = () => {
    const audio = document.querySelector('audio')
    playedTime.value = formatTime(audio.currentTime * 1000)
    playedProgress.value = (audio.currentTime / audio.duration) * 100
}

// 节流
let timer = null

// 下一曲
const SongEnd = () => {
    if (timer) {
        clearTimeout(timer)
        ElMessage('请不要繁忙点击')
        timer = null
    }
    timer = setTimeout(() => {
        songEndFn()
        clearTimeout(timer)
        timer = null
    }, 200)
    // 解决多音频
    const audios = document.querySelectorAll('audio')
    if (audios.length > 1) {
        for (let i = 0; i < audios.length - 1; i++) {
            audios[i].remove()
        }
    }
}

// 上一首
const beforeSong = () => {
    if (timer) {
        clearTimeout(timer)
        ElMessage('请不要繁忙点击')
        timer = null
    }
    timer = setTimeout(() => {
        nextSong(false)
        clearTimeout(timer)
        timer = null
    }, 200)
    // 解决多音频
    const audios = document.querySelectorAll('audio')
    if (audios.length > 1) {
        for (let i = 0; i < audios.length - 1; i++) {
            audios[i].remove()
        }
    }
}

const updateAudio = (newval) => {
    songState = songInfo.value
    playedTime.value = '00:00'
    playedProgress.value = 0
    audioDom.value = createAudio(newval);
    const audio = document.querySelector('audio')
    audio.addEventListener('play', () => {
        isPlaying.value = true
    })
    audio.addEventListener('pause', () => {
        isPlaying.value = false
    })
    audio.addEventListener('timeupdate', changeTimeFn)
    // 歌曲结束是的判定函数
    audio.onended = () => {
        songEndFn()
        audio.onended = null
    }
}

// 监听当前播放歌曲url
watch(() => songInfo.value.songUrl, async (newval) => {
    updateAudio(newval);
}, {
    deep: true,
    immediate: false
})

watch(() => songInfo.value, () => {
    localStorage.setItem('PLAYING_STATE', songInfo.value)
})
</script>


<style lang="less" scoped>
.close {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -999;
}

.footer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    border-top: 3px solid var(--click-enable-color);
    background-color: var(--bg-color-global);
    min-width: 900px;
    height: 75px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999999;

    .songImg {
        width: 90px;
        box-sizing: border-box;
        cursor: pointer;

        img {
            border-radius: 10px;
            margin-left: 20px;
            width: 50px;
        }
    }

    .songInfo {
        display: flex;
        flex-direction: column;
        width: 100px;

        .songName {
            font-size: 16px;
        }

        .songAr {
            font-size: 12px;
        }
    }

    .songOption {
        width: 180px;
        height: 75px;
        line-height: 75px;
        display: flex;
        justify-content: space-around;
        color: var(--click-enable-color);

        .beforeSong {
            font-size: 18px;
            cursor: pointer;
        }

        .pause {
            padding-bottom: 2px;
            font-size: 20px;
            cursor: pointer;
        }

        .nextSong {
            font-size: 18px;
            cursor: pointer;
        }

        .beforeSong:hover,
        .pause:hover,
        .nextSong :hover {
            color: #716f6f;
        }
    }

    .timeProgress {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        box-sizing: border-box;
        padding: 0 40px;

        .played {
            width: 50px;
        }

        .progress {
            padding: 0 10px;
            flex: 1;
        }

        .duration {
            width: 50px;
        }
    }

    .playMode {
        width: 40px;
        box-sizing: border-box;
        padding: 10px;
        color: var(--click-enable-color);

        .iconfont {
            cursor: pointer;
            font-size: 20px;
            font-weight: 700;
        }
    }

    .volume {
        width: 40px;
        box-sizing: border-box;
        padding: 10px;
        color: var(--click-enable-color);

        .icon {
            font-size: 22px;
            cursor: pointer;
        }
    }

    .playList {
        width: 40px;
        box-sizing: border-box;
        padding: 10px;
        color: var(--click-enable-color);

        .icon {
            font-size: 27px;
            cursor: pointer;
        }
    }

    .icon:hover,
    .iconfont:hover {
        color: #716f6f;
    }
}
</style>