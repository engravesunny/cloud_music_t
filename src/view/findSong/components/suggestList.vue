<template>
    <div>
        <h2>
            {{title}}
        </h2>
        <div v-loading="!suggestLists.length" class="playlist_container">
            <ul>
                <li @click="toSongList(item.id)" v-for="item in suggestLists" :key="item.id">
                    <el-image loading="lazy" fit="cover" style="width: 100%;border-radius:10px;" :src="suggestLists.length<=20?item.picUrl:item.coverImgUrl" lazy />
                    <div class="name">{{item.name}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const router = useRouter()
let props = defineProps(['suggestLists','title'])
let toSongList = (id) => {
    router.push({
        path:'/songlist',
        query:{
            songListInfoId:id
        }
    })
}

</script>

<style lang="less" scoped> 
.playlist_container{
    width: 100%;
    ul{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        width: 100%;
        li{
            margin: 10px;
            width: 17%;
            height: 20%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            cursor: pointer;
            transition: all 0.5s;
            .name{
                width: 100%;
                height: 40px;
                padding: 3px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;  //增加允许在单词内换行
            }
        }
        li:hover{
            width: 20%;
        }
    }
}
</style>