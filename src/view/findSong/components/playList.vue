<template>
    <div class="container">
        <div class="category-header">
            <div class="left-btn">
                <span class="btn-text" @click="handleShowBanner(!showBanner)">
                    {{ currentCategory }}
                </span>
                <div ref="bannerDom" v-if="showBanner" class="banner-categories">
                    <div class="header"> <span class="text" @click="handleSelectCat('全部')">全部歌单</span> </div>
                    <div class="categories">
                        <div class="cate-head" v-for="item in list">
                            <div class="name">{{ item.name }}</div>
                            <ul class="cate-detail">
                                <li class="detail" v-for="detail in item.categories">
                                    <span class="text" @click="handleSelectCat(detail.name)">
                                        <div v-if="detail.hot" class="hot">HOT</div>
                                        {{ detail.name }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <ul class="right-list">
                <li v-for="item in hotCategories" @click="handleSelectCat(item.name)" :key="item.name">{{ item.name }}</li>
            </ul>
        </div>
        <virtual-list @getMoreData="handleLoad" :cols="5" :data-source="playList" :item-height="250" :top-height="180">
            <template #item="{ item, col }">
                <img-card :item="col.content" :closeIcon="false" :isSingerList="false"></img-card>
            </template>
        </virtual-list>
    </div>
</template>

<script setup>
import imgCard from './imgCard.vue'
import virtualList from '@/components/virtualListDev/index.vue'
import { onMounted, reactive } from 'vue';
import { getListCategory, getCatPlayList } from '../../../api/songList';

const pageEnd = ref();
const bannerDom = ref();
const list = reactive([]);
const playList = reactive([]);
const currentCategory = ref('全部');
const showBanner = ref(false);
const hotCategories = reactive([]);
const curPage = ref(0)
const limit = 30;
const finished = ref(false);
const loading = ref(false);

const getCategoryPlayList = async () => {
    try {
        loading.value = true
        let timer = setTimeout(() => {
            ElNotification('正在加载喵')
        }, 500);
        const { data: playListInfo } = await getCatPlayList({
            cat: currentCategory.value,
            limit,
            offset: curPage.value * limit
        });
        if (playListInfo.playlists.length < limit) {
            finished.value = true;
        }
        playListInfo.playlists.forEach(item => {
            playList.push(item);
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


const initCategoryList = async () => {
    const { data } = await getListCategory();
    const categories = data.categories;
    const sub = data.sub;
    list.length = 0;
    let count = 0;
    sub.forEach(item => {
        if (item.hot && count < 10) {
            count++;
            hotCategories.push(item);
        }
    })
    Object.keys(categories).forEach((item) => {
        const categoryItem = { name: categories[item], categories: sub.filter(cate => cate.category == item) };
        list.push(categoryItem);
    })

}

function closeBanner(e) {
    const el = bannerDom.value;
    if (!el.contains(e.target)) {
        showBanner.value = false;
        document.removeEventListener('click', closeBanner)
        return;
    }
}

const handleShowBanner = async (content) => {
    if (content) {
        setTimeout(() => {
            document.addEventListener('click', closeBanner)
        });
    } else {
        document.removeEventListener('click', closeBanner)
    }
    showBanner.value = content
}

const handleSelectCat = async (name) => {
    curPage.value = 0;
    finished.value = false;
    handleShowBanner(false);
    playList.length = 0;
    currentCategory.value = name;
    await getCategoryPlayList();
}

// 处理滑到最低处加载
const handleLoad = async () => {
    if (!finished.value && !loading.value) {
        curPage.value = curPage.value + 1;
        getCategoryPlayList();
    }
}

// 初始化
const init = async () => {
    await initCategoryList()
    await getCategoryPlayList();
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

.container {
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    min-height: 300px;

    .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .right-list {
            display: flex;

            li {
                margin: 0 10px;
                color: var(--font-color-global);
                cursor: pointer;
                font-size: 12px;
            }
        }
    }

    .left-btn {
        position: relative;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        color: var(--click-enable-color);

        .btn-text {
            padding: 5px 10px;
            border: 1px solid var(--click-enable-color);
            border-radius: 10px;
            cursor: pointer;

            &:active {
                border: 1px solid var(--siderbar-active-color);
            }
        }
    }

    .banner-categories {
        position: absolute;
        top: 60px;
        left: 0;
        z-index: 9999;
        background-color: var(--darilog-bg-color);
        box-sizing: border-box;
        width: 700px;
        color: var(--darilog-font-color);
        border-radius: 10px;
        overflow: hidden;

        .header {
            color: var(--click-enable-color);
            height: 70px;
            padding: 0 20px;
            border-bottom: 1px solid rgb(208, 208, 208);

            .text {
                cursor: pointer;
                font-size: 14px;
                padding: 5px 10px;
                background-color: var(--bg-color-global);
                border-radius: 20px;
            }
        }

        .categories {
            width: 100%;
            display: flex;
            flex-direction: column;
            font-size: 12px;
            padding: 0 20px;
        }

        .cate-head {
            width: 100%;
            color: rgb(153, 153, 153);
            display: flex;
            margin-bottom: 5px;

            .name {
                margin-right: 20px;
                width: 50px;
            }
        }

        .cate-detail {
            padding-right: 30px;
            width: 100%;
            color: var(--font-color-global);
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

            .detail {
                display: flex;
                justify-content: center;
                align-items: center;

                &:hover {
                    color: var(--click-enable-color);
                    cursor: pointer;
                }

                .text {
                    position: relative;
                }

                .hot {
                    color: var(--click-enable-color);
                    position: absolute;
                    right: -21.6px;
                    top: -7.2px;
                    font-size: 12px;
                    transform: scale(0.6);
                }
            }
        }
    }
}
</style>