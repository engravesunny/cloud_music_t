<template>
    <virtual-list :top-height="topHeight" :item-height="250" :data-source="hotAlbums" :cols="5">
        <template #item="{ item, col }">
            <img-card :is-album="true" :item.async="col.content" :closeIcon="false" :isSingerList="false"></img-card>
        </template>
    </virtual-list>
</template>

<script setup lang="ts">
import imgCard from '../../findSong/components/imgCard.vue';
import virtualList from '../../../components/virtualListDev/index.vue'

const props = defineProps<{
    hotAlbums: any,
    topHeight: number
}>()

</script>

<style lang="less" scoped></style>