<template>
    <div>
        <h2>
            {{ title }}
        </h2>
        <div v-loading="!suggestLists.length" class="playlist_container">
            <ul>
                <li @click="toSongList(item.id)" v-for="item in suggestLists" :key="item.id">
                    <el-image fit="cover" style="width: 100%;border-radius:10px;"
                        :src="suggestLists.length <= 20 ? item.picUrl : item.coverImgUrl" />
                    <div class="name">{{ item.name }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const router = useRouter()
let props = defineProps(['suggestLists', 'title'])
let toSongList = (id) => {
    router.push({
        path: '/songlist',
        query: {
            songListInfoId: id
        }
    })
}

</script>

<style lang="less" scoped> .playlist_container {
     width: 100%;

     ul {
         padding: 20px 20px 0 20px;
         box-sizing: border-box;
         display: grid;
         grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
         grid-template-rows: auto;
         column-gap: 40px;
         row-gap: 20px;
         width: 100%;
         justify-items: stretch;

         li {
             justify-self: center;
             display: flex;
             justify-content: center;
             flex-direction: column;
             cursor: pointer;
             transition: all 0.5s;

             .name {
                 height: 40px;
                 padding: 3px;
                 overflow: hidden;
                 text-overflow: ellipsis;
                 display: -webkit-box;
                 -webkit-line-clamp: 2;
                 -webkit-box-orient: vertical;
                 word-break: break-all; //增加允许在单词内换行
             }
         }
     }
 }
</style>