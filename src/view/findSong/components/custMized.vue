<template>
    <!-- 私人订制 -->
    <div class="suggest-list">
        <virtual-list @getMoreData="handleLoad" :cols="5" :data-source="custMizedList" :item-height="250" :top-height="120">
            <template #item="{ item, col }">
                <img-card :item.async="col.content" :closeIcon="false" :isSingerList="false"></img-card>
            </template>
        </virtual-list>
    </div>
    <!-- 私人订制 -->
</template>

<script setup>
import imgCard from './imgCard.vue'
import virtualList from '@/components/virtualListDev/index.vue'
import { search } from "@/api/search";
import { onMounted } from "vue";
import { ElMessage } from "element-plus";

let custMizedList = reactive([]);
const curPage = ref(0);
const limit = ref(40);
const finished = ref(false);
const loading = ref(false)

// 获取歌单
const getPlayList = async () => {
    // 获取私人订制歌单
    try {
        loading.value = true;
        let timer = setTimeout(() => {
            ElNotification('正在加载喵')
        }, 500);
        const { data: custMized } = await search({
            keywords: "私人订制",
            limit: limit.value,
            type: 1000,
            offset: curPage.value * limit.value
        })
        const playList = custMized?.result?.playlists
        if (!playList || playList.length < limit.value) {
            finished.value = true;
        }
        playList.forEach(item => {
            custMizedList.push(item);
        })
        clearTimeout(timer);
        if (!finished.value) {
            ElNotification.success('加载成功');
            setTimeout(() => {
                ElNotification.closeAll();
            }, 800);
        }
        if (finished.value) {
            ElNotification.success('已经到底了哦');
        }
        loading.value = false
    } catch (error) {
        ElNotification.error('加载失败')
    }
}

// 处理滑到最低处加载
const handleLoad = async () => {
    if (!finished.value && !loading.value) {
        curPage.value = curPage.value + 1;
        getPlayList();
    }
}

const init = async () => {
    try {
        await getPlayList();
    } catch (error) {
        // console.log(error);
        ElMessage.error("Error");
    }

}
onMounted(() => {
    init();
})


</script>

<style lang="less" scoped>
.suggest-list {
    min-height: 500px;
}

.pageEnd {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    color: var(--click-enable-color);
}
</style>