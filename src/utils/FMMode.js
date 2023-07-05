// 引入底部控制播放信息，开启FMMode
import {song } from '@/store/song'
import { storeToRefs } from 'pinia'

const songStore = song()

let { songInfo } = storeToRefs(songStore)

const startFM = (isFM) => {
    songInfo.value.FMMode = isFM;
    songInfo.value.FMList = reactive([])
    songInfo.value.songList = [];
    localStorage.setItem('PLAYING_STATE',JSON.stringify(songInfo.value))
    if(!isFM){
        songInfo.value.songList.push(songInfo.value.currentPlayingSong)
    }
}
export default startFM