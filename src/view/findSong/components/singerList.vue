<template>
    <div class="cate-list">
        <div class="cate-item" v-for="cate in cates" :key="cate.name">
            <div class="cate-head">{{ cate.name }}:</div>
            <div class="cate-details">
                <div @click="handleSelect(cate.details[detail], detail, cate.name)" :class="{
                    active: active[cate.name] === detail
                }" class="cate-details-item" v-for="detail in Object.keys(cate.details)" :key="detail">
                    {{ detail }}
                </div>
            </div>
        </div>
        <virtual-list @getMoreData="handleLoad" :cols="5" :data-source="singerListInfo" :item-height="250"
            :top-height="240">
            <template #item="{ item, col }">
                <img-card @click="toSingerPage(col.content)" :item="col.content" :closeIcon="true"
                    :isSingerList="true"></img-card>
            </template>
        </virtual-list>
    </div>
</template>

<script setup>
import imgCard from './imgCard.vue'
import virtualList from '@/components/virtualListDev/index.vue'
import { onMounted, reactive } from 'vue';
import { getSingerCate } from '@/api/singer'
const router = useRouter();

const active = reactive({
    "语种": '所有', "筛选": '热门', "分类": '全部'
})
const letter = { "热门": "-1", "A": "a", "B": "b", "C": "c", "D": "d", "E": "e", "F": "f", "G": "g", "H": "h", "I": "i", "J": "j", "K": "k", "L": "l", "M": "m", "N": "n", "O": "o", "P": "p", "Q": "q", "R": "r", "S": "s", "T": "t", "U": "u", "V": "v", "W": "w", "X": "x", "Y": "y", "Z": "z", "#": "0" }
const limit = 30
const pageEnd = ref();
const curPage = ref(0);
const finished = ref(false);
const areas = {
    "所有": "-1",
    "华语": "7",
    "欧美": "96",
    "日本": "8",
    "韩国": "16",
    "其他": "0"
}
const sex = {
    "全部": "-1",
    "男歌手": "1",
    "女歌手": "2",
    "乐队": "3"
}
const cates = [
    {
        name: '语种',
        details: areas
    },
    {
        name: '分类',
        details: sex
    },
    {
        name: '筛选',
        details: letter
    }
]
const initial = ref('-1')
const area = ref('-1')
const type = ref('-1')
const singerListInfo = reactive([])
const loading = ref(false);

const getSingerList = async () => {
    try {
        loading.value = true
        let timer = setTimeout(() => {
            ElNotification('正在加载喵')
        }, 500);
        let { data: singerList } = await getSingerCate({
            limit,
            offset: curPage.value * limit,
            area: area.value,
            type: type.value,
            initial: initial.value
        })
        singerList.artists.forEach(item => {
            singerListInfo.push(item);
        })
        if (singerList.artists.length < limit) {
            finished.value = true;
        }
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

const handleSelect = (cate, key, name) => {
    curPage.value = 0;
    active[name] = key;
    if (Object.keys(areas).includes(key)) {
        area.value = cate;
    } else if (Object.keys(sex).includes(key)) {
        type.value = cate;
    } else {
        initial.value = cate;
    }
    singerListInfo.length = 0;
    getSingerList();
}
// 处理滑到最低处加载
const handleLoad = async () => {
    if (!finished.value && !loading.value) {
        curPage.value = curPage.value + 1;
        getSingerList();
    }
}

const toSingerPage = (context) => {
    try {
        router.push({
            path: '/singer',
            query: {
                id: context.id,
            }
        })
    } catch (error) {
        ElMessage.error(error)
    }
}

const init = () => {
    getSingerList()
}

onMounted(() => {
    init();
})


</script>

<style lang="less" scoped>
.pageEnd {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    color: var(--click-enable-color);
}

.cate-list {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;

    .cate-item {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .cate-details {
            flex: 1;
            display: flex;
            flex-wrap: wrap;

            .cate-details-item {
                width: 80px;
                font-size: 14px;
                text-align: center;
                margin-bottom: 20px;
                border-right: 1px solid var(--font-color-light);

                &:hover {
                    color: var(--click-enable-color);
                    cursor: pointer;
                }

                &.active {
                    color: var(--click-enable-color);
                }
            }
        }
    }
}
</style>