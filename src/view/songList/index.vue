<template>
  <el-scrollbar>
    <div>
      <songListPage :songListInfo="songListInfo"></songListPage>
    </div>
  </el-scrollbar>
</template>

<script setup>

import { getSongListDetail } from '@/api/songList';

const route = useRoute()
const router = useRouter()
let songlistId = ref('')

let songListInfo = reactive([])

watch(route, async (val) => {
  if (!val.query.songListInfoId) return
  songlistId.value = val.query.songListInfoId
  songListInfo.pop()
  const { data } = await getSongListDetail({
    id: songlistId.value
  })
  songListInfo.push(data.playlist)
}, {
  deep: true,
  immediate: true
})
</script>