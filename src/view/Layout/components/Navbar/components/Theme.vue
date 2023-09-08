<template>
    <div class="theme">
        <div class="iconfont" @click="handleClick">&#xeaec;</div>
        <div class="color-palette" :style="{ height, boxShadow }">
            <div class="title">
                <h2>主题设置</h2>
            </div>
            <div class="title">内部主题</div>
            <div class="container" @click="handleChangeTheme">
                <div class="theme-box">Dark Purple</div>
                <div class="theme-box">Light Purple</div>
            </div>
            <div class="title">定制主题</div>
            <div class="container">Data is none</div>

        </div>
    </div>
</template>

<script setup>
import { changeTheme } from '../../../../../utils/changeTheme'
const height = ref(0)
const boxShadow = ref('none')

const handleClick = () => {
    if (height.value) {
        height.value = 0;
        boxShadow.value = 'none';
    } else {
        height.value = '600px';
        boxShadow.value = '-1px -1px 10px 2px rgba(0, 0, 0, 0.1)'
    }
}

const handleChangeTheme = (e) => {
    changeTheme(e.target.innerText);
}

</script>

<style lang="less" scoped>
.theme {
    position: relative;
    display: flex;
    float: right;
    margin-right: 20px;
    height: 60px;
    align-items: center;

    .iconfont {
        position: relative;
        cursor: pointer;
        border-radius: 50%;
        height: 40px;
        width: 40px;
        font-size: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all .5s;

        &:hover {
            background-color: var(--siderbar-hover-color);
        }
    }

    .color-palette {
        border-radius: 10px;
        position: absolute;
        top: 60px;
        right: 50%;
        transform: translate(50%);
        width: 300px;
        background-color: var(--drag-box-color);
        overflow: hidden;

        .title {
            padding: 10px;
            font-size: 22px;
            font-weight: 700;
        }

        .container {
            padding: 5px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: gray;
            font-size: 16px;

            .theme-box {
                cursor: pointer;
                margin: 5px;
                padding: 10px 50px;
                border-radius: 10px;
                background-color: var(--inner-body-color);
                transition: all 0.2s;

                &:hover {
                    transform: scale(1.1);
                    background-color: var(--bg-color-global);
                }

                &:active {
                    background-color: var(--siderbar-active-color);
                }
            }
        }
    }
}
</style>