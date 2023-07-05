// 创建audio标签，赋值src，并播放
import {song} from '@/store/song'
import { storeToRefs } from 'pinia'
import { ElMessage } from "element-plus"

const songStore = song()

const { songInfo } = storeToRefs(songStore)

// songUrl:歌曲url
const createAudio = (songUrl) => {
    // 如果已有audio标签，就删除它
    const audios = document.querySelectorAll('audio')
    if(audios){
        for(let i=0;i<audios.length;i++){
            audios[i].remove()
        }
    }
    const audio = document.createElement('audio')
    audio.src = songUrl
    audio.volume = songInfo.value.volume/100
    audio.style = 'display:none;'
    document.body.appendChild(audio)
    // 音乐就绪
    audio.playing = () => {
        ElMessage('当前网络较差，请稍后重试')
    }
    let timer = null
    timer = setTimeout(() => {
        ElMessage('正在缓冲，请耐心等待')
    }, 3000);
    audio.oncanplaythrough = ()=>{
        audio.play();
        clearTimeout(timer)
        timer = null
        audio.oncanplaythrough = null
    }    
}

export default createAudio;