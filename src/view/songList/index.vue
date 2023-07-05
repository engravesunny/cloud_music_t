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

onMounted(async()=>{
    songlistId.value = route.query.songListInfoId
    const {data} = await getSongListDetail({
        id:songlistId.value
    })
    console.log(data);
    songListInfo.push(data.playlist)
})

watch(route,async(val)=>{
      if(!val.query.songListInfoId)return
      songlistId.value = val.query.songListInfoId
      const {data} = await getSongListDetail({
          id:songlistId.value
      })
      songListInfo.pop()
      songListInfo.push(data.playlist)
},{
      deep:true
})
</script>