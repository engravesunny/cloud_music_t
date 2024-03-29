import { defineStore } from "pinia";

export const song = defineStore("song", {
  state: () => {
    return {
      // 底部播放栏状态信息

      songInfo: JSON.parse(localStorage.getItem("PLAYING_STATE")) || {
        picUrl: "",
        name: "",
        ar: [],
        songList: [],
        playDuration: 0,
        playMode: 0,
        volume: 50,
        randomSongList: [],
        currentPlayingSong: {},
        songUrl: "",
        FMMode: false, // 私人FM模式
        FMList: [],
        album: "",
      },
    };
  },
  getters: {
    getSongInfo() {
      return this.songInfo;
    },
    currentPlayingSong() {
      return this.songInfo.currentPlayingSong;
    },
  },
  actions: {
    setSongInfo(newInfo) {
      this.songInfo = newInfo;
      console.log("set", this.songInfo);
    },
  },
});
