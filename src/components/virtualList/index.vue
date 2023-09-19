<template>
    <div class="virtuallist-container" v-loading="loading">
        <div class="virtuallist-content" ref="contentRef">
            <div class="virtuallist-list" ref="listRef">
                <div class="virtuallist-list-item" v-for="item in renderList" :key="item.id" :id="String(item.id)">
                    <slot name="item" :item="item"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends {id:number}">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { VirtualListProps, PosInfo } from './type'
const props = defineProps<VirtualListProps<T>>();
const emits = defineEmits<{
    getMoreData: [];
}>();

defineSlots<{
    item(props: { item: T }): any
}>();


const positions = ref<PosInfo[]>([]);

const state = reactive({
    viewHeight: 0,
    listHeight: 0,
    startIndex: 0,
    maxCount: 0,
    preLen: 0
})

const contentRef = ref<HTMLDivElement>();
const listRef = ref<HTMLDivElement>();

const endIndex = computed(() => Math.min(props.dataSource.length, state.startIndex + state.maxCount))
const renderList = computed(() => props.dataSource.slice(state.startIndex, endIndex.value));

watch([() => listRef.value, () => props.dataSource.length], () => {
    props.dataSource.length && initPosition();
    nextTick(() => {
        props.dataSource.length && setPosition();
    })
})

watch(() => state.startIndex, () => {
    setPosition();
})

const initPosition = () => {
    const pos: PosInfo[] = []
    for (let i = 0; i < props.dataSource.length; i++) {
        pos.push({
            index: i,
            height: props.itemHeight,
            top: i * props.itemHeight,
            bottom: (i + 1) * props.itemHeight,
            dHeight: 0
        })
        positions.value = [...positions.value, ...pos]
    }
}

// 数据渲染完，更新数据item的真实高度
const setPosition = () => {
    const nodes = listRef.value?.children;
    if (!nodes || !nodes.length) return;
    [...nodes].forEach(node => {
        const rect = node.getBoundingClientRect();
        const item = positions.value[+node.id];
        const dHeight = item.height - rect.height;
        if (dHeight) {
            item.height = rect.height;
            item.bottom = item.bottom - dHeight;
            item.dHeight = dHeight;
        }
    });

    const startId = +nodes[0].id;
    const len = positions.value.length;
    let startHeight = positions.value[startId].dHeight;
    positions.value[startId].dHeight = 0;
    for (let i = startId + 1; i < len; i++) {
        const item = positions.value[i];
        item.top = positions.value[i - 1].bottom;
        item.bottom = item.bottom - startHeight;
        if (item.dHeight !== 0) {
            startHeight += item.dHeight;
            item.dHeight = 0;
        }
    }
    state.listHeight = positions.value[len - 1].bottom;
}

const init = () => {
    state.viewHeight = contentRef.value ? contentRef.value.offsetHeight : 0;
    state.maxCount = Math.ceil(state.viewHeight / props.itemHeight) + 1;
    contentRef.value && contentRef.value.addEventListener('scroll', handleScroll)
}

const destory = () => {
    contentRef.value && contentRef.value?.removeEventListener('scroll', handleScroll);
}

const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = contentRef.value as HTMLDivElement;
    state.startIndex = binarySearch(positions.value, scrollTop);
    const bottom = scrollHeight - clientHeight - scrollTop;
    if (bottom <= 20) {
        !props.loading && emits('getMoreData')
    }
}

const binarySearch = (list: PosInfo[], value: number): number => {
    let left = 0;
    let right = list.length - 1;
    let tempIndex = -1;
    while (left < right) {
        const midIndex = Math.floor((left + right) / 2);
        const midValue = list[midIndex].bottom;
        if (midValue === value) return midIndex;
        else if (midValue < value) left = midIndex + 1;
        else if (midValue > value) {
            if (tempIndex === -1 || tempIndex > midIndex) tempIndex = midIndex;
            right = midIndex;
        }
    }
    return tempIndex;
}

onMounted(() => {
    init();
})

onUnmounted(() => {
    destory();
})

</script>

<style lang="less" scoped>
.virtuallist {
    &-container {
        width: 100%;
        min-height: 500px;
    }

    &-list {
        width: 100%;
    }

    &-list-item {
        width: 100%;
    }
}
</style>