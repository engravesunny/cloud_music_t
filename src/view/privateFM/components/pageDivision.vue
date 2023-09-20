<template>
    <div class="pageTable">
        <div v-if="curPage > 0" class="left iconfont" @click="toPage(curPage - 1)">&#xe779;</div>
        <div class="cube" @click="toPage(item === '...' ? item : item - 1)" :class="{ active: item === curPage + 1 }"
            v-for="item in  cubeList " :key="item">
            {{ item }}
        </div>
        <div @click="toPage(curPage + 1)" v-if="curPage < cubeList.length - 1" class="right iconfont">&#xe775;</div>
    </div>
</template>

<script setup>
const props = defineProps({
    pageSize: {
        type: Number,
        default: 1
    },
    curPage: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 1
    }
})
const emits = defineEmits(['changePage'])

const cubeList = computed(() => {
    let num = 1
    if (props.total % props.pageSize === 0) {
        num = props.total / props.pageSize
    } else {
        num = (props.total / props.pageSize) + 1
    }
    const res = []
    for (let i = 1; i < num; i++) {
        res.push(i)
    }
    // [1,2,3,4,5]
    const cur = props.curPage
    if (res[cur + 3]) {
        res.splice(cur + 2, res.length - cur - 1 - 2, '...')
    }
    if (res[cur - 3] || res[cur - 3] === 0) {
        res.splice(1, cur - 2, '...')
    }
    return res
})

const toPage = (pageNum) => {
    if (pageNum === '...') return
    else {
        emits('changePage', pageNum)
    }
}

</script>

<style lang="less">
.pageTable {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .cube,
    .left,
    .right {
        box-sizing: border-box;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        line-height: 40px;
        margin: 0 5px;
        text-align: center;
        font-size: 15.5px;
        cursor: pointer;
        background-color: var(--suggest-bg-color);

        color: var(--font-color-light);
    }

    .left,
    .right {
        font-size: 16px;
        font-weight: 700;
    }

    .active {
        background-color: var(--siderbar-active-color);
    }
}
</style>