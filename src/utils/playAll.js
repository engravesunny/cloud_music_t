import play from './playSong'
import { song } from '@/store/song.js'
import { storeToRefs } from 'pinia'
import playSong from './playSong'

const songStore = song()

let { songInfo } = storeToRefs(songStore)

const playAll = (arr) => {
    songInfo.value.songList = [...arr];
    playSong(songInfo.value.songList[0])
}

export default playAll