import { defineStore } from 'pinia'

export const song = defineStore('song',{
    state: () => {
        return {
            // 底部播放栏状态信息
            songInfo:{
                picUrl:'',
                name:'',
                ar:[],
                songList:[],
                playDuration:0,
                playMode:0,
                volume:50,
                randomSongList:[],
                currentPlayingSong:{},
                songUrl:'',
                FMMode:false,   // 私人FM模式
                FMList:[]
            },
        }
    },
    getters:{
        getSongInfo(){
            return this.songInfo
        }
    },
    actions:{}
})