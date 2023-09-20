<template>
    <div class="song-text" ref="songContainer">
        <div v-if="songText.length" class="song-text-item" :class="{ active: curIndex === ind + 1 }"
            v-for="(item, ind) in songTextInfo[index]" :key="item.songText + item.time">
            {{ item.songText }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { songTextItem } from './type'
import { cutSongText } from '../../../utils/cutSongText'

const props = defineProps<{
    songText: any[],
    index: number,
    audio: HTMLAudioElement
}>()
const songContainer = ref<HTMLDivElement>();
const songTextInfo = reactive<songTextItem[][]>([])
const curTime = ref(0)
const scrolling = ref(false)
const positionY = computed(() => {
    return (curIndex.value * 40 - 120) < 0 ? 0 : (curIndex.value * 40 - 120);
})
const curIndex = computed(() => {
    return songTextInfo[props.index]?.filter(item => {
        return curTime.value > item.time
    }).length;
})
const handleScroll = () => {
    let timer: any = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        scrolling.value = true;
        timer = setTimeout(() => {
            scrolling.value = false;
            updatePosition()();
            clearTimeout(timer);
            timer = null;
        }, 2000);
    }
}
// 节流函数
const throttle = function (fn: Function, delay: number) {
    let timer: any = null;
    return function (...args: any[]) {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply({}, args);
            timer = null;
        }, delay)
    }
}
const updateCurTime = () => {
    curTime.value = props.audio.currentTime;
}
// 处理歌词
const handleText = (text: string) => {
    let res: songTextItem[] = [];
    const texts = text.split("\n");
    texts.forEach(item => {
        const items = cutSongText(item) as songTextItem[]
        res.push(...items);
    })
    return res.sort((a: songTextItem, b: songTextItem) => {
        return a.time - b.time;
    })
}

onMounted(() => {
    const songTextDom = songContainer.value as HTMLDivElement;
    songTextDom.onscroll = throttle(handleScroll(), 100);
})
watch(() => props.index, () => {
    curTime.value = 0;
})
watch(() => props.songText, (val: any[]) => {
    songTextInfo.length = 0;
    val.forEach(item => {
        songTextInfo.push(handleText(item))
    })
}, {
    deep: true,
})
watch(() => props.audio, () => {
    props.audio.addEventListener('timeupdate', updateCurTime);
}, {
    deep: true,
})
const updatePosition = () => {
    let updating: boolean;
    return function () {
        if (updating) return;
        if (!scrolling.value) {
            const songTextDom = songContainer.value as HTMLDivElement;
            songTextDom.onscroll = null;
            const songContainerDom = songContainer.value as HTMLDivElement;
            const curPosition = songContainerDom.scrollTop;
            const move = positionY.value - curPosition;
            let timer: any = setInterval(() => {
                songTextDom.onscroll = null;
                updating = true;
                if (Math.abs(songContainerDom.scrollTop - positionY.value) > 10) {
                    songContainerDom.scrollTop += move / 10;
                } else {
                    updating = false;
                    songTextDom.onscroll = throttle(handleScroll(), 100);
                    clearInterval(timer)
                    timer = null;
                }
            }, 10)
        }
    }
}
watch(curIndex, () => {
    updatePosition()();
})
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}

.active {
    font-weight: 700;
    font-size: 20px !important;
    color: var(--font-color-global);
}

.song-text {
    width: 400px;
    height: 300px;
    text-align: center;
    color: gray;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;

    &-item {
        flex-shrink: 0;
        box-sizing: border-box;
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        font-size: 14px;
    }
}
</style>