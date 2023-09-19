<template>
    <li @click="toSongList(item.id)">
        <div class="img">
            <el-image lazy fit="cover" class="opacity0" style="width: 100%;height: 100%;"
                :src="item.picUrl || item.coverImgUrl || item.img1v1Url" @load="handleLoad" />
        </div>
        <div v-if="!closeIcon" class="playBtn iconfont" @click.stop="handlePlayClick(item)">&#xe87c;</div>
        <div class="name">{{ item.name }}</div>
    </li>
</template>

<script setup lang="ts">
import { getSongListAllSong } from '../../../api/songList.js';
import playAll from '../../../utils/playAll.js';
const router = useRouter()

const props = defineProps<{
    item: any,
    closeIcon: boolean | number,
    isSingerList: boolean | number
}>()
let toSongList = (id: any) => {
    if (!props.isSingerList) {
        router.push({
            path: '/songlist',
            query: {
                songListInfoId: id
            }
        })
    } else {
    }
}
const handleLoad = (e: any) => {
    e.target.parentNode.style.opacity = 1
}
const handlePlayClick = async (item: any) => {
    const id = item.id;
    const { data: songList } = await getSongListAllSong({
        id
    })
    playAll(songList.songs)
}


</script>

<style lang="less" scoped>
.opacity0 {
    opacity: 0;
}

.img {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 15px;
    overflow: hidden;
    background: linear-gradient(-45deg, #F1F2F3 25%, #fff 45%, #F1F2F3 65%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.2s ease-in-out infinite;
}

li {
    width: 100%;
    position: relative;
    justify-self: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
        .playBtn {
            opacity: 1;
        }
    }


}

.playBtn {
    opacity: 0;
    position: absolute;
    right: 7px;
    bottom: 50px;
    width: 20%;
    aspect-ratio: 1;
    color: var(--inner-body-color);
    background: var(--click-enable-color);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    transition: all .3s;

    &:hover {
        transform: scale(1.1);
    }

    &:active {
        transform: scale(1.0);
    }
}

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
</style>