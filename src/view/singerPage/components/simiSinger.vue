<template>
    <div class="simiSinger">
        <virtual-list :top-height="294" :item-height="250" :data-source="simiSingerList" :cols="5">
            <template #item="{ item, col }">
                <img-card @click="toSingerPage(col.content.id)" :is-singer-list="true" :close-icon="true"
                    :item="col.content"></img-card>
            </template>
        </virtual-list>
    </div>
</template>

<script setup lang="ts">
import imgCard from '../../findSong/components/imgCard.vue';
import virtualList from '../../../components/virtualListDev/index.vue'
import { getSingerSim } from '../../../api/singerDetail';
const props = defineProps<{
    id?: string
}>()

const simiSingerList = ref([])
const initSimiSingers = async () => {
    const { data } = await getSingerSim({
        id: props.id
    })
    simiSingerList.value = data.artists ?? [];
}
const router = useRouter();
const toSingerPage = (id: any) => {
    router.push({
        path: '/singer',
        query: {
            id: id
        }
    })
}

onBeforeMount(() => {
    initSimiSingers();
})

watch(() => props.id, () => {
    initSimiSingers();
})

</script>

<style lang="less" scoped></style>