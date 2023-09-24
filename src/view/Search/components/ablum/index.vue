<template>
    <div><virtual-list @getMoreData="handleLoad" :top-height="130" :item-height="250" :data-source="searchResult" :cols="5">
            <template #item="{ item, col }">
                <img-card :is-album="true" :item.async="col.content" :closeIcon="false" :isSingerList="false"></img-card>
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
        type: 10
    })
    searchResult.value = [...searchResult.value, ...data.result.albums]
}
const handleLoad = () => {
    curPage.value++;
    getSearchResult();
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