<template>
    <div class="virtual-list-container" v-loading="!dataSource.length">
        <div :style="{
            height: `${(mockData.length - startIndex) * props.itemHeight}px`,
            transform: `translateY(${startIndex * props.itemHeight}px)`,
        }" class="virtual-list-list">
            <div class="virtual-list-rows" v-for="item in renderList" :key="item.id">
                <div class="virtual-list-cols" v-for="col in item.cols" :key="col.id">
                    <slot name="item" :item="item" :col="col"></slot>
                </div>
            </div>
        </div>
    </div>
    <div ref="contentRef" class="virtual-list-content"></div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus';

const emits = defineEmits(['getMoreData'])
const props = defineProps<{
    // 距离顶部距离
    topHeight: number,
    // 单个li高度
    itemHeight: number,
    // 渲染数据
    dataSource: any[],
    cols: number
}>();

const contentRef = ref<HTMLElement>()
const scrollbar = inject('scrollbar') as any;

const startIndex = ref(0);

interface Item {
    id: number,
    content: any
}
interface Rows {
    id: number | string,
    cols: Item[]
}

let mockData = computed((): Rows[] => {
    const data = props.dataSource
    const len = data.length;
    const res: Rows[] = [];
    let tempList: Item[] = [];
    for (let i = 0; i < len; i++) {
        if (i % props.cols === 0 && i !== 0) {
            res.push({
                id: i / props.cols,
                cols: tempList
            })
            tempList = [];
        }
        tempList.push({
            id: i,
            content: data[i]
        })
    }
    res.push({
        id: Math.ceil(len / props.cols),
        cols: tempList
    })
    return res;
})

const endIndex = computed(() => {
    const viewHeight = contentRef.value?.offsetHeight ? contentRef.value.offsetHeight : 0;
    return Math.min(mockData.value.length, startIndex.value + Math.ceil((viewHeight / props.itemHeight)) + 1);
})
const renderList = computed(() => {
    return mockData.value.slice(startIndex.value, endIndex.value)
})
const throttled = (fn: Function, delay: number) => {
    let timer: any = null;
    return function (...args: any) {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply({}, args)
            timer = null;
        }, delay);
    }
}

// 滚动处理
const handleScroll = (e: Event) => {
    const scrollbar = e.target as HTMLElement;
    let scrollTop = scrollbar.scrollTop - props.topHeight;
    scrollTop = scrollTop < 0 ? 0 : scrollTop
    const index = Math.floor(scrollTop / props.itemHeight) - 1;
    startIndex.value = index >= 0 ? index : 0;
    if (endIndex.value === mockData.value.length) {
        emits('getMoreData')
    }
}

// 监听滚动
const listenScroll = () => {
    const el = scrollbar.value.wrapRef as HTMLElement
    el.addEventListener('scroll', throttled(handleScroll, 100))
}

// 初始化
onMounted(() => {
    listenScroll();
})
onActivated(() => {
    scrollbar.value.handleScroll();
})

onBeforeUnmount(() => {
    const el = scrollbar.value.wrapRef as HTMLElement
    el.removeEventListener('scroll', throttled(handleScroll, 100))
})


</script>

<style lang="less" scoped>
.virtual-list {
    &-container {
        width: 100%;
        height: 100%;
        min-height: 300px;
    }

    &-content {
        position: fixed;
        z-index: -99;
        width: 100%;
        height: calc(100vh - 135px);
        display: flex;
        align-items: center;
    }

    &-list {
        width: 100%;
        box-sizing: border-box;
        height: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &-rows {
        width: 100%;
        margin-bottom: 10px;
        max-width: 1260px;
        height: 250px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        column-gap: 5%;
    }

    &-cols {
        justify-self: stretch;
        box-sizing: border-box;
    }
}
</style>