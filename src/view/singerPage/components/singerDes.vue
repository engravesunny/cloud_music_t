<template>
    <div class="singerDes">
        <div class="des-item" v-if="singerDesInfo.length" v-for="item in singerDesInfo" :key="item.ti">
            <div class="des-item-title">{{ item.ti }}</div>
            <div class="des-item-detail">
                <p v-for="txt in item.txts">
                    {{ txt }}
                </p>
            </div>
        </div>
        <div v-else class="no-data">
            暂时没有歌手详情
        </div>
    </div>
</template>

<script setup lang="ts">
import { getSingerDes } from '../../../api/singerDetail'
const props = defineProps<{
    id?: string
}>()
// 歌手描述信息
const singerDesInfo = reactive<any[]>([])
const initDesSingerInfo = async () => {
    const { data } = await getSingerDes({
        id: props.id
    })
    const handleList = data.introduction as any[]
    handleList.forEach(item => {
        const list = item.txt.split('\n');
        singerDesInfo.push({
            ti: item.ti,
            txts: list
        })
    })
}
onBeforeMount(() => {
    initDesSingerInfo();
})
watch(() => props.id, () => {
    initDesSingerInfo();
})
</script>

<style lang="less" scoped>
.singerDes {
    padding-right: 30px;
    padding-bottom: 20px;

    .no-data {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: var(--font-color-light);
    }

    .des-item-title {
        margin: 20px 0;
        font-weight: 700px;
        font-size: 20px;
    }

    .des-item-detail {
        font-size: 15px;
        color: var(--font-color-light);
        font-weight: 100;

        p {
            line-height: 30px;
        }
    }
}
</style>