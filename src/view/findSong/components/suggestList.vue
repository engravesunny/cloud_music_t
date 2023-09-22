<template>
    <div>
        <h2>
            {{ title }}
        </h2>
        <div v-loading="!suggestLists.length" class="playlist_container">
            <ul>
                <img-card v-for="item in suggestLists" :key="item.id" :item.async="item" :closeIcon="!!closeIcon"
                    :isSingerList="!!isSingerList | false"></img-card>
            </ul>
        </div>
    </div>
</template>

<script setup>
import imgCard from './imgCard.vue'
let props = defineProps(['suggestLists', 'title', 'closeIcon', 'isSingerList'])

</script>

<style lang="less" scoped>
.playlist_container {
    width: 100%;
    min-height: 300px;

    ul {
        padding: 20px 20px 0 20px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;
        column-gap: 40px;
        row-gap: 20px;
        width: 100%;
        justify-items: stretch;
        padding-right: 20px;
    }
}
</style>