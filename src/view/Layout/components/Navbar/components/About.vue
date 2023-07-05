<template>
    <div class="container">
        <div class="title">关于</div>
        <div class="description">
            <p>这是一个基于vue3+vite+pinia的方网易云建议项目，目前已完成大部分常规功能</p>
            <p>获取源码：<a href="https://github.com/engravesunny/cloud_music" target="_blank">github</a></p>
            <p>这是一个公开的仓库</p>
        </div>
    </div>
</template>

<style lang="less" scoped>
.container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 300px;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;
    border-radius: 10px;
    .title{
        margin: 10px;
        font-size: 30px;
        font-weight: 700;
    }
    .description{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        p{
            padding: 5px;
            font-size: 18px;
            text-align: center;
        }
    }
}

</style>