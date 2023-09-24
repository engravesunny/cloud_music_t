<template>
    <div><virtual-list @getMoreData="handleLoad" :top-height="130" :item-height="250" :data-source="searchResult" :cols="5">
            <template #item="{ item, col }">
                <img-card @click="toSingerPage(col.content)" :is-album="false" :item.async="col.content" :closeIcon="true"
                    :isSingerList="true"></img-card>
            </template>
        </virtual-list></div>
</template>

<script setup lang="ts">
import virtualList from '../../../../components/virtualListDev/index.vue';
import imgCard from '../../../findSong/components/imgCard.vue';
import { search } from '../../../../api/search';
const props = defineProps<{
    searchValue?: string,
    currentPages: any,
    result: any,
    songTotal: any,
}>()
const searchValue = ref(props.searchValue)
defineEmits(['updatePage'])
const searchResult = ref([])
const limit = 30;
const curPage = ref(0)
const getSearchResult = async () => {
    const { data } = await search({
        limit,
        offset: curPage.value * limit,
        keywords: searchValue.value,
        type: 100
    })
    searchResult.value = [...searchResult.value, ...data.result.artists]
}
const handleLoad = () => {
    curPage.value++;
    getSearchResult();
}
const router = useRouter()
const toSingerPage = (context: any) => {
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
onBeforeMount(() => {
    getSearchResult();
})
const route = useRoute();
watch(() => route.query, (val: any) => {
    searchValue.value = val.searchValue
    searchResult.value = []
    curPage.value = 0;
    getSearchResult()
})
</script>