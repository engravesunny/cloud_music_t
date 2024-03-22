import { song } from "@/store/song.js";
import { storeToRefs } from "pinia";
import { checkSong } from "@/api/search";

const songStore = song();

let { songInfo } = storeToRefs(songStore);

import playSong from "./playSong";

const nextSong = async (isOK) => {
  if (!songInfo.value.FMMode) {
    // 非FFMode模式
    if (
      songInfo.value.songList.length &&
      songInfo.value.songList.length === 1
    ) {
      playSong(songInfo.value.songList[0], true);
    }
    let next = 0;
    if (isOK) {
      // 下一首
      if (songInfo.value.songList.length) {
        songInfo.value.songList.forEach((item, index) => {
          if (item.id === songInfo.value.currentPlayingSong.id) {
            next = index + 1;
          }
        });
        if (next - 1 === songInfo.value.songList.length - 1) {
          next = 0;
        }
      } else {
        let audio = document.querySelector("audio");
        audio.remove();
      }
    } else {
      // 上一首
      if (songInfo.value.songList.length) {
        songInfo.value.songList.forEach((item, index) => {
          if (item.id === songInfo.value.currentPlayingSong.id) {
            next = index - 1;
          }
        });
        if (next === -1) {
          next = songInfo.value.songList.length - 1;
        }
      } else {
        return;
      }
    }
    let song = songInfo.value.songList[next];
    const isAvailable = await checkSong({
      id: song.id,
    });
    let hasAuth = 0;
    if (!isAvailable.data.success) {
      hasAuth += 1;
      ElMessage("暂无版权，已跳过喵");
    }
    next = (isOK && next + hasAuth) || next - hasAuth;
    playSong(songInfo.value.songList[next]);
  } else {
    // FFMode模式
    if (songInfo.value.FMList.length && songInfo.value.FMList.length === 1) {
      playSong(songInfo.value.FMList[0], true);
    }
    if (isOK) {
      // 下一首
      if (songInfo.value.FMList.length) {
        let next = 0;
        songInfo.value.FMList.forEach((item, index) => {
          if (item.id === songInfo.value.currentPlayingSong.id) {
            next = index + 1;
          }
        });
        if (next - 1 === songInfo.value.FMList.length - 1) {
          next = 0;
        }
        playSong(songInfo.value.FMList[next], true);
      } else {
        return;
      }
    } else {
      // 上一首
      if (songInfo.value.FMList.length) {
        let next = 0;
        songInfo.value.FMList.forEach((item, index) => {
          if (item.id === songInfo.value.currentPlayingSong.id) {
            next = index - 1;
          }
        });
        if (next === -1) {
          next = songInfo.value.FMList.length - 1;
        }
        playSong(songInfo.value.FMList[next], true);
      } else {
        return;
      }
    }
  }
};

export default nextSong;
