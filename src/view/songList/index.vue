<template>
  <el-scrollbar>
    <div>
      <songListPage :albumSongList="albumSongList" :songListInfo="songListInfo"></songListPage>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { getAlbumContent } from '../../api/album';
import { getSongListDetail } from '@/api/songList';

const route = useRoute()
let songlistId = ref('')

let songListInfo = reactive([])
const albumSongList = ref([])
watch(route, async (val) => {
  if (!val.query.songListInfoId) return
  songListInfo.length = 0
  songlistId.value = val.query.songListInfoId
  albumSongList.value = [];
  if (val.query.album) {
    const { data: albumInfo } = await getAlbumContent({
      id: songlistId.value
    })

    albumSongList.value = albumInfo.songs
    songListInfo.push(albumInfo.album)
  } else {
    try {
      const { data } = await getSongListDetail({
        id: songlistId.value
      })
      songListInfo.push(data.playlist)
    } catch (error) {
      console.log(error.message);
    }
  }
}, {
  deep: true,
  immediate: true
})
</script>