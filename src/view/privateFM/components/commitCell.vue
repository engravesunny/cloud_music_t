<template>
    <div class="commit_cell">
        <div class="left">
            <div v-if="comment" class="avatar">
                <el-image @load="handleLoad" class="opacity0" :style="{ opacity: `${opacity}` }"
                    :src="comment.user.avatarUrl" lazy></el-image>
            </div>
        </div>
        <div class="right">
            <div class="top">
                <div v-if="comment" class="commit_text">
                    <p class="name">{{ comment.user.nickname }} :</p>
                    <p class="content">{{ comment.content }}</p>
                </div>
            </div>
            <div v-if="comment.beReplied?.length" class="middle">
                <p class="name">@{{ comment.beReplied[0]?.user.nickname }} :</p>
                <p class="comment">{{ comment.beReplied[0]?.content }}</p>
            </div>
            <div class="bottom">
                <div v-if="comment" class="date">{{ comment.timeStr }}</div>
                <div v-if="comment" class="goods iconfont">&#xe651;<span class="likeCount">{{ comment.likedCount }}</span>
                </div>
                <div v-if="comment && false" class="goods iconfont">&#xec8c;<span class="likeCount">{{ comment.likedCount
                }}</span></div>
            </div>
        </div>


    </div>
</template>

<script setup>
const props = defineProps(['comment'])
const opacity = ref(0)
const handleLoad = () => {
    opacity.value = 1;
}
</script>

<style lang="less" scoped>
.opacity0 {
    opacity: 0;
    border-radius: 50%;
}

.commit_cell {
    margin: 15px 10px;
    width: 100%;
    min-height: 110px;
    display: flex;
    justify-content: flex-start;
    background-color: var(--bg-color-global);
    border-radius: 10px;

    &:hover {
        background-color: var(--siderbar-hover-color);
    }

    .left {
        box-sizing: border-box;
        width: 90px;
        height: 90px;
        padding: 15px;

        .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            background: linear-gradient(-45deg, #F1F2F3 25%, #fff 45%, #F1F2F3 65%);
            background-size: 400% 100%;
            animation: skeleton-loading 1.2s ease-in-out infinite;
        }
    }

    .right {
        padding: 20px;
        padding-left: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .middle {
            .name {
                font-weight: 700;
                font-size: 14px;
                margin-bottom: 5px;
            }

            .comment {
                font-size: 14px;
                color: var(--font-color-light);
            }

            padding: 7px 7px;
            border-radius: 6px;
            box-sizing: border-box;
            margin: 10px 0;
            width: 100%;
            min-height: 50px;
            background-color: var(--siderbar-active-color);
        }

        .top {
            width: 100%;

            .commit_text {
                font-size: 14px;

                .name {
                    font-weight: 700;
                    margin-bottom: 10px;
                }
            }
        }

        .bottom {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            .date {
                font-size: 14px;
                color: gray;
            }

            .goods {
                font-size: 20px;
                cursor: pointer;

                .likeCount {
                    color: rgb(139, 123, 123);
                    font-size: 14px;
                }
            }
        }
    }
}
</style>