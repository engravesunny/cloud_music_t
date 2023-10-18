<template>
    <div class="top_menu unselectable">
        <!-- logo -->
        <div class="logo">
            <div class="logo_container">
                <div class="logo_icon unselectable">
                    <img src="@/assets/img/logo.png" alt="logo.png">
                </div>
                <div class="logo_title unselectable">刻猫猫的音乐盒</div>
            </div>
        </div>
        <!-- logo -->

        <!-- 搜索框 -->
        <Search></Search>
        <!-- 搜索框 -->

        <!-- 用户区域 -->
        <User></User>
        <!-- 用户区域 -->

        <!-- 主题 -->
        <Theme></Theme>
        <!-- 主题 -->

        <!-- 窗口操作区域 -->
        <!-- 窗口操作区域 -->

    </div>
</template>

<script setup>
import Theme from './components/Theme.vue'
import Search from './components/Search.vue'
import User from './components/User.vue'

let color = '#000000'

</script>

<style lang="less" scoped>
.top_menu {
    display: inline-block;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-width: 900px;
    height: 60px;
    z-index: 999;
    .logo {
        display: flex;
        float: left;
        margin-left: 20px;
        height: 60px;
        .logo_container {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .logo_icon {
                height: 60px;

                img {
                    margin-top: -11px;
                    width: 80px;
                    height: 80px;
                }
            }

            .logo_title {
                font-size: 24px;
                font-weight: 700;
            }
        }
    }
}
</style>