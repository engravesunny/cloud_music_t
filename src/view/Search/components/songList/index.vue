<template>
  <div>
    <virtual-list
      :top-height="130"
      :item-height="250"
      :data-source="searchResult"
      :cols="5"
      @get-more-data="handleLoad"
    >
      <template #item="{ item, col }">
        <img-card
          :is-album="false"
          :item="col.content"
          :close-icon="false"
          :is-singer-list="false"
        ></img-card>
      </template>
    </virtual-list>
  </div>
</template>

<script setup lang="ts">
import virtualList from "../../../../components/virtualListDev/index.vue";
import imgCard from "../../../findSong/components/imgCard.vue";
import { search } from "../../../../api/search";
const props = defineProps<{
  searchValue?: string;
  currentPages: any;
  result: any;
  songTotal: any;
}>();
const searchValue = ref(props.searchValue);
const searchResult = ref<any[]>([]);
const limit = 40;
const curPage = ref(0);
const getSearchResult = async () => {
  const { data } = await search({
    limit,
    offset: curPage.value * limit,
    keywords: searchValue.value,
    type: 1000,
  });
  searchResult.value = [...searchResult.value, ...data.result.playlists];
};
const handleLoad = () => {
  curPage.value++;
  getSearchResult();
};

onBeforeMount(() => {
  getSearchResult();
});
let handleRouteChange = (val: any) => {
  searchValue.value = val.searchValue;
  searchResult.value = [];
  curPage.value = 0;
  getSearchResult();
};

const route = useRoute();
watch(
  () => route,
  (val: any) => {
    if (route.path === "/search") {
      handleRouteChange(route.query);
    } else {
      return;
    }
  },
  {
    deep: true,
  },
);
</script>
