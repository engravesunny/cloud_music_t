<template>
    <div class="high_commit_Box">
        <h3>
            <div class="title">精彩评论</div>
        </h3>
        <commitCell v-for="item in highComments" :key="item.commentId" :comment="item"></commitCell>
    </div>

    <div class="normal_commit_box">
        <h3>
            <div class="title" ref="newHead">最新评论</div>
        </h3>
        <div v-loading="!normalComments.length" style="width: 100%;min-height: 500px;">
            <commitCell v-for="item in normalComments" :key="item.commentId" :comment="item"></commitCell>
        </div>
        <pageDivision @changePage="changePage" :pageSize="limit" :curPage="curPage" :total="total"></pageDivision>
    </div>
</template>

<script setup lang="ts">
import pageDivision from './pageDivision.vue'
import commitCell from './commitCell.vue'
import { getCommits, limit } from '../utils/getComments'

const props = defineProps<{
    FMInfo: any[],
    index: number
}>()
const emits = defineEmits(['updateTotal'])

let newHead = ref<HTMLDivElement>()
let highComments = reactive<any[]>([])
let total = ref(0)
let normalComments = reactive<any[]>([])

const curPage = ref(0);

// set commnets
const setComments = async () => {
    const info = await getCommits(props.FMInfo[props.index].id, curPage.value);
    normalComments.length = 0;
    highComments.length = 0;
    info?.norComs.forEach(item => {
        normalComments.push(item);
    })
    info?.hiComs.forEach(item => {
        highComments.push(item);
    })
    total.value = info?.ttl as number
    emits('updateTotal', info?.ttl)
}

const updateComments = async () => {
    normalComments.length = 0;
    const info = await getCommits(props.FMInfo[props.index].id, curPage.value);
    info?.norComs.forEach(item => {
        normalComments.push(item);
    })
}
const scrollbar = inject('scrollbar') as any
const changePage = (page: number) => {
    if (curPage.value === page) return;
    else {
        // 跳转到最新评论头部
        const newsHeadDom = newHead.value as HTMLDivElement;
        const scrollTop = newsHeadDom.offsetTop;
        scrollbar.value.setScrollTop(scrollTop);
        curPage.value = page;
        updateComments();
    }
}

onMounted(() => {
    setComments();
})

watch(() => props.index, () => {
    setComments();
}, {
    deep: true,
})


</script>

<style lang="less" scoped>
.normal_commit_box,
.high_commit_Box {
    box-sizing: border-box;
    width: 80%;
    padding-bottom: 75px;
}
</style>