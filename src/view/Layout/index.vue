<template>
    <div class="main_body">
            <!-- 顶部区域 -->
                <!-- Navbar区域 -->

                <Navbar></Navbar>

                <!-- Navbar区域 -->

            <!-- 顶部区域 -->

            <!-- 主体区域 -->

                <div class="main">
                        
                    <!-- 左侧边栏 -->
                    <Sidebar></Sidebar>
                    <!-- 左侧边栏 -->

                    <!-- 二级路由/内容区域 -->
                    <div class="main_container">
                        <keep-alive>
                            <component :is='routeViewer'></component>
                        </keep-alive>
                    </div>                  
                    <!-- 二级路由 -->

                </div>

            <!-- 主体区域 -->

            <!-- 底部区域 -->

                <Footer></Footer>

            <!-- 底部区域 -->
    </div>

</template>

<script setup>
import Navbar from './components/Navbar/index.vue';
import Sidebar from './components/Sidebar/index.vue';
import Footer from './components/Footer/index.vue'
import myLike from '../myLike/index.vue'
import findSong from '../findSong/index.vue'
import privateFM from '../privateFM/index.vue'
import Search from '../Search/index.vue'
import suggestSong from '../suggestSong/index.vue'
import songList from '../songList/index.vue'


const route = useRoute()
const router = useRouter()

// 默认是findSong
const routeViewer = shallowRef(findSong)

// 监听路由
watch(route,(val)=>{
    switch (val.meta.component) {
        case 'findSong':
            routeViewer.value = findSong
            break;
        case 'myLike':
            routeViewer.value = myLike
            break;
        case 'suggestSong':
            routeViewer.value = suggestSong
            break;
        case 'privateFM':
            routeViewer.value = privateFM
            break; 
        case 'Search':
            routeViewer.value = Search
            break; 
        case 'songList':
            routeViewer.value = songList
            break;                         
        default:
            break;
    }
},{
    deep:true,
    immediate:true
})

</script>

<style lang="less" scoped>
.main_body{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    min-height:500px;
    .main{
        flex: 1;
        display: flex;
        padding-top: 60px;
        box-sizing: border-box;
        height: 100%;
        .main_container{
            flex: 1;
            min-width: 500px;
        }
    }
}

</style>