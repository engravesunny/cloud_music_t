<template>
    <li @click="toSongList(item.id)">
        <div ref="imgDom" class="img">
        </div>
        <div v-if="!closeIcon" class="playBtn iconfont" @click.stop="handlePlayClick(item)">&#xe87c;</div>
        <div class="name">{{ item.name }}</div>
    </li>
</template>

<script setup lang="ts">
import { getSongListAllSong } from '../../../api/songList.js';
import playAll from '../../../utils/playAll.js';
import { getCurrentInstance, handleError } from 'vue';
import { PromiseControl } from '../../../plugin/promise'
const { proxy } = getCurrentInstance() as any;
import { AxiosResponse } from 'axios';
import axios from 'axios'
import { ITEM_RENDER_EVT } from 'element-plus/es/components/virtual-list/src/defaults';

const imgDom = ref();

// 并发控制
const promiseControl = proxy.$promiseControl as PromiseControl
const request = axios.create({
    baseURL: '',
    responseType: 'blob'
})

const sendRequest = (url: string) => () => request({ url });

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

let finished = false;
let task: () => Promise<AxiosResponse<any, any>>;
const handleLoad = (flag: boolean) => {
    if (flag) {
        promiseControl.addTask(task, (res: any) => {
            finished = true;
            let url = URL.createObjectURL(res.data);
            const img = document.createElement('img');
            img.src = url;
            img.style.height = '100%'
            img.style.width = '100%'
            img.style.objectFit = 'cover'
            img.classList.add('animate_show')
            imgDom.value.appendChild(img)
        }, (reason: any) => {
            console.log(reason);
        })
    }
    return { toDelete: () => promiseControl.deleteTask(task) };
}

const xhr = new XMLHttpRequest();

const handlePlayClick = async (item: any) => {
    const id = item.id;
    const { data: songList } = await getSongListAllSong({
        id
    })
    playAll(songList.songs)
}

const listenImgDom = () => {
    const el = imgDom.value as HTMLDivElement
    const insertObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                handleLoad(true);
                insertObserver.unobserve(el);
            }
        })
    })
    insertObserver.observe(el);
}

onBeforeUnmount(() => {
    const { toDelete } = handleLoad(false);
    if (!finished) {
        toDelete();
    } else {
        return;
    }
})

onMounted(() => {
    let url = props.item.picUrl || props.item.coverImgUrl || props.item.img1v1Url
    url = url + "?param=300y300"
    task = sendRequest(url);
    listenImgDom();
})

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