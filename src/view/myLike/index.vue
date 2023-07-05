<template>
  <el-scrollbar>
    <div>
      <songListPage :songListInfo="songListInfo" ></songListPage>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { getSongListDetail } from '@/api/songList';
import songListPage from '../../components/songListPage/index.vue'
import { getUserSongList } from '@/api/myFavourite'
import { getUserInfoDetail } from '@/api/user.js'
import { user } from '@/store/user.js'
import { storeToRefs } from 'pinia';
const userStore = user()
const {userInfo} = storeToRefs(userStore)

const songListInfo = reactive([])

onMounted(async()=>{
  if(!userInfo.value.id){
    if(localStorage.getItem('userInfo')){
      const local = JSON.parse(localStorage.getItem('userInfo'))
      userInfo.value.nickname = local.nickname
      userInfo.value.avatarUrl = local.avatarUrl
      userInfo.value.id = local.id
    } else {
      const {data} = await getUserInfoDetail()
      userInfo.value.nickname = data.profile.nickname
      userInfo.value.avatarUrl = data.profile.avatarUrl
      userInfo.value.id = data.account.id
    }
  }
  try {
    const {data} = await getUserSongList({
      uid:userInfo.value.id
    })
    const res = await getSongListDetail({
      id:data.playlist[0].id
    })
    console.log(res);
    songListInfo.push(res.data.playlist)
  } catch (error) {
    Promise.reject(error)
  }
})

</script>

<style>

</style>