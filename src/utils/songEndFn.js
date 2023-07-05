import { song } from '@/store/song.js'
import { storeToRefs } from 'pinia'

const songStore = song()

let { songInfo } = storeToRefs(songStore)

import playSong from './playSong'
import nextSong from './nextSong'

// 歌曲结束时的判定函数
const songEndFn = () => {
    if(!songInfo.value.FMMode){
        if(!songInfo.value.songList.length)return;
        let audio = document.querySelector('audio')
        if(songInfo.value.playMode === 0){
            // 不循环顺序播放
            if(songInfo.value.currentPlayingSong.id === songInfo.value.songList[songInfo.value.songList.length - 1].id){
                // 到达最后一首停止播放
                return 
            } else {
                // 未到最后一首，播放下一首
                nextSong(true)
            }
        } else if(songInfo.value.playMode === 1){
            // 循环顺序播放，直接播放下一首
            nextSong(true)
        } else if(songInfo.value.playMode === 2){
            // 单曲循环
            console.log('单曲循环');
            playSong(songInfo.value.currentPlayingSong)
        } else {
            // 随机播放
            console.log('随机播放');
            const len = songInfo.value.songList.length
            if(len === 1){
                playSong(songInfo.value.currentPlayingSong)
            } else {
                let randomNum = 0
                while(1){
                    randomNum = Math.floor(Math.random()*len)
                    if(songInfo.value.songList[randomNum].id !== songInfo.value.currentPlayingSong.id){
                        break
                    }
                }
                playSong(songInfo.value.songList[randomNum])
            }
            
        }
    } else {
        // 另外一套逻辑
        // 在FM页面出发，方便更新页面
    }

}

export default songEndFn