<template>
    <div class="search">
        <div class="search_outline">

            <!-- 搜索图标 -->
            <div class="search_icon unselectable" @click="fnSearch">
                <el-icon>
                    <Search style="width: 30px; height: 30px;cursor: pointer;" />
                </el-icon>
            </div>
            <!-- 搜索图标 -->

            <!-- 搜索输入区域 -->
            <div class="search_input unselectable">
                <input type="text" v-model="searchText" :placeholder="placeholder" @keydown.enter="fnSearch"
                    @input="searchSuggestFn" @focus="showSuggest = true">
            </div>
            <!-- 搜索输入区域 -->

        </div>

        <!-- 搜索建议区域 -->
        <div v-if="showSuggest" @click="showSuggest = false" style="width:100vw;height:100vh;position:fixed;top:0;left:0;">
            <div v-if="showSuggest" class="suggest">
                <div class="suggest_title" v-if="suggestList.length || !suggestList.length && showSuggest && !searchText">
                    猜你想搜</div>
                <ul v-if="suggestList.length && showSuggest && searchText">
                    <li class="suggest_cell shenglue" :title="item.name" v-for="item in suggestList" :key="item.id"
                        @click="$event => suggestSearch($event, item.name)">
                        {{ item.name }}{{ item.artists.length ? ' - ' : '' }}
                        <span v-for="artist in item.artists" :key="artist.id">{{ artist.name + ' ' }}</span>
                    </li>
                </ul>
                <ul v-if="!suggestList.length && showSuggest && !searchText">
                    <li class="suggest_cell shenglue" :title="item.first" v-for="item in hotSong" :key="item.first"
                        @click="$event => suggestSearch($event, item.first)">
                        {{ item.first }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
// 引入搜索api接口
import { searchDefault, searchHot, searchSuggest, searchResult, search } from '@/api/search.js'
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter()
const route = useRoute()
// 搜索功能
let placeholder = ref('')
let searchText = ref('')
let showSuggest = ref(false)
let hotSong = reactive([])
// 初始化
onMounted(async () => {
    const { data } = await searchDefault()
    placeholder.value = data.data.showKeyword
    const res = await searchHot()
    if (res.data.result) {
        res.data.result.hots.forEach(item => {
            hotSong.push(item)
        })
    }
})

// 搜索enter键或按搜索图标
const fnSearch = () => {
    showSuggest.value = false
    if (searchText.value) {
        // 输入了搜索输入的关键词
        router.push({
            path: '/search',
            query: {
                searchValue: searchText.value
            }
        })

    } else {
        // 搜索placeholder
        router.push({
            path: '/search',
            query: {
                searchValue: placeholder.value
            }
        })
    }
}

// 搜索建议列表
let suggestList = reactive([])

let timer = null

// 防抖
const debounce = (fn, delay) => {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = null;
        timer = setTimeout(() => {
            fn.apply({}, args)
        }, delay);
    }
}

// 搜索建议input事件
let Fn = async () => {
    // 显示suggest列表
    showSuggest.value = true

    // 获取searchSuggest

    //置空suggest列表
    suggestList.length = 0

    if (!searchText.value) return;
    timer = setTimeout(async () => {
        const { data } = await searchSuggest({
            keywords: searchText.value
        })
        if (data.result) {
            data.result.songs.forEach(item => {
                suggestList.push(item)
            })
            clearTimeout(timer)
            timer = null
        }
    }, 200);
}
const searchSuggestFn = debounce(Fn, 300);

// 点击搜索建议搜索
let suggestSearch = async (e, name) => {
    // 点击列表项时判断是否为li标签，li标签带有全部信息，内嵌标签span只带有歌手信息需要需找它的父节点
    if (e.target.nodeName === 'LI') {
        name = e.target.innerText;
    } else {
        name = e.target.parentNode.innerText
    }
    router.push({
        path: '/search',
        query: {
            searchValue: name
        }
    })
}
</script>

<style lang="less" scoped>
.search {
    position: relative;
    display: flex;
    float: left;
    margin-top: 14px;
    margin-left: 100px;
    width: 30%;
    height: 30px;
    color: var(--font-color-global) !important;

    .search_outline {
        display: flex;
        align-items: center;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
        width: 100%;
        height: 34px;
        border-radius: 25px;
        background: var(--search-bg-color);

        .search_icon {
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            padding-top: 14px;
        }

        .search_input {
            width: 100%;

            input {
                width: 100%;
                border: none;
                background: rgba(0, 0, 0, 0);
                outline: none;
                color: var(--font-color-global);
            }
        }
    }

    .suggest {
        position: absolute;
        top: 60px;
        left: 370px;
        width: 400px;
        max-height: 80vh;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 3px 0 5px -5px #000;
        background: var(--suggest-bg-color);

        .suggest_title {
            padding: 10px 10px 10px 10px;
            font-size: 20px;
            font-weight: 700;
        }

        .suggest_cell {
            padding: 10px 20px;
            box-sizing: border-box;
            width: 100%;
            height: 30px;
            line-height: 10px;
        }

        .suggest_cell:hover {
            background-color: var(--siderbar-active-color);
            cursor: pointer;
        }
    }
}
</style>