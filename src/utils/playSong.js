import { checkSong, getSongUrl } from "@/api/search";
import { song } from "@/store/song.js";
import { storeToRefs } from "pinia";

const songStore = song();
/**
 * @type { import('vue').Ref } songInfo
 */
let songInfo = storeToRefs(songStore).songInfo;

const playSong = async (song, hasChecked = false) => {
  if (!hasChecked) {
    const isAvailable = await checkSong({
      id: song.id,
    });
    if (!isAvailable.data.success) {
      return ElMessage("暂无版权喵");
    }
  }
  let newSongInfo = { ...songInfo.value };
  // 信息赋值到状态
  newSongInfo.name = song.name;
  newSongInfo.picUrl = song?.al?.picUrl || song?.album?.picUrl;
  newSongInfo.ar = song.ar || song.artists;
  newSongInfo.playDuration = song?.dt || song.duration;
  newSongInfo.album = song?.al?.name;
  // 搜索歌曲插入播放列表,id相同歌曲删除
  if (!newSongInfo.FMMode) {
    // 不是FM模式
    newSongInfo.FMList = reactive([]);
    if (newSongInfo.songList.length) {
      if (!newSongInfo.songList.some((item) => item.id === song.id)) {
        newSongInfo.songList.push(song);
      }
    } else {
      newSongInfo.songList.push(song);
    }
  } else {
    // FM模式
    if (newSongInfo.FMList?.length) {
      if (!newSongInfo.FMList.some((item) => item.id === song.id)) {
        newSongInfo.FMList.push(song);
      }
    } else {
      newSongInfo.FMList.push(song);
    }
  }
  // 切换当前播放歌曲
  newSongInfo.currentPlayingSong = song;

  // 获取歌曲url
  const { data } = await getSongUrl({
    id: song.id,
  });
  newSongInfo.songUrl = data.data[0].url;
  // 更新状态
  songStore.setSongInfo(newSongInfo);
  songInfo.value = newSongInfo;
  // console.log(songStore.currentPlayingSong);
  // 当前底部播放栏状态存入本地存储 使其持久化
  localStorage.setItem("PLAYING_STATE", JSON.stringify(newSongInfo));
};

export default playSong;
export { songInfo };
