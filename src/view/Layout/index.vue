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
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
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


</script>

<style lang="less" scoped>
.main_body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    min-height: 500px;

    .main {
        flex: 1;
        display: flex;
        padding-top: 60px;
        padding-bottom: 65px;
        box-sizing: border-box;
        height: 100%;

        .main_container {
            overflow: hidden;
            border-radius: 30px 0 0 0px;
            flex: 1;
            min-width: 500px;
            background-color: var(--inner-body-color);
        }
    }
}
</style>