// 创建audio标签，赋值src，并播放
import { song } from '@/store/song'
import { storeToRefs } from 'pinia'
import { ElMessage } from "element-plus"

const songStore = song()

const { songInfo } = storeToRefs(songStore)

// songUrl:歌曲url
const createAudio = (songUrl) => {
    // 如果已有audio标签，就删除它
    const audios = document.querySelectorAll('audio')
    if (audios) {
        for (let i = 0; i < audios.length; i++) {
            audios[i].remove()
        }
    }
    const audio = document.createElement('audio')
    audio.src = songUrl
    audio.volume = songInfo.value.volume / 100
    audio.style = 'display:none;'
    document.body.appendChild(audio)
    // 音乐就绪
    audio.playing = () => {
        ElMessage('当前网络较差，请稍后重试')
    }
    let timer = null
    timer = setTimeout(() => {
        if (songUrl) {
            if (songUrl === "http://m701.music.126.net/20230909151728/23bc2d69fb4eb09fbb5018caa356151a/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/28558899459/8ccf/a559/9a19/cac1201dbda66368389cce7573ad82a6.flac") return;
            ElMessage('正在缓冲，请耐心等待')
        }
    }, 3000);
    audio.oncanplaythrough = () => {
        try {
            audio.play().then(() => {
                audio.autoplay = true;
            }).catch(() => {
                audio.autoplay = false;
            });
            clearTimeout(timer)
            timer = null
            audio.oncanplaythrough = null
        } catch (error) {
            // console.log(error);
        }
    }
}

export default createAudio;