<template>
    <div class="nav">
        <div class="nav-box">
            <div class="nav-btn" @click="handleNavClick(item)" :class="{ active: activeBtn === item.name }"
                v-for="item in navs" :key="item.name">
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script setup>
const emits = defineEmits(['changeNav']);

const navs = [
    {
        name: '个性推荐',
        component: 'PersonalRec'
    },
    {
        name: '专属订制',
        component: 'CustMized'
    },
    {
        name: '歌单',
        component: 'playList'
    },
    {
        name: '排行榜',
        component: 'rankList'
    },
    {
        name: '歌手',
        component: 'singerList'
    },
    {
        name: '最新音乐',
        component: 'latestSong'
    },
]
const activeBtn = ref(navs[0].name);
const handleNavClick = (item) => {
    activeBtn.value = item.name
    emits('changeNav', item.component)
}

</script>

<style lang="less" scoped>
.nav {
    width: 100%;
    min-height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;

    .nav-box {
        display: flex;
        border-radius: 50px;
        background-color: var(--drag-box-color);
        overflow: hidden;

        .nav-btn {
            border-radius: 50px;
            display: flex;
            justify-content: center;
            padding: 15px 30px;
            font-size: 20px;
            cursor: pointer;

            &.active {
                background-color: var(--siderbar-active-color);
                font-weight: 700;
            }
        }

        .nav-btn:hover {
            background-color: var(--siderbar-active-color);
        }
    }
}
</style>