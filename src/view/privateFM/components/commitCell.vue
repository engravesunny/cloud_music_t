<template>
    <div class="commit_cell">
        <div class="left">
            <div v-if="comment" class="avatar">
                <el-image style="border-radius:50%" :src="comment.user.avatarUrl" lazy></el-image>
            </div>
        </div>
        <div class="right">
            <div class="top">
                <div v-if="comment" class="commit_text">
                    <span class="name">{{ comment.user.nickname }}</span> : <span class="content">{{ comment.content }}</span>
                </div>
            </div>
            <div class="bottom">
                <div v-if="comment" class="date">{{ comment.timeStr }}</div>
                <div v-if="comment" class="goods iconfont">&#xe651;<span class="likeCount">{{comment.likedCount}}</span></div>
                <div v-if="comment&&false" class="goods iconfont">&#xec8c;<span class="likeCount">{{comment.likedCount}}</span></div>
            </div>
        </div>
        

    </div>
</template>

<script setup>

const props = defineProps(['comment'])

</script>

<style lang="less" scoped>
.commit_cell{
    margin: 10px;
    width: 100%;
    min-height:110px;
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .left{
        box-sizing: border-box;
        width: 90px;
        height: 90px;
        padding: 15px;
        .avatar{
            width: 60px;
            height: 60px;
        }
    }
    .right{
        padding: 20px;
        padding-left: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top{
            width: 100%;
            .commit_text{
                font-size: 14px;
                .name{
                    font-weight: 700;
                }
            }
        }
        .bottom{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .date{
                font-size: 14px;
                color: gray;
            }
            .goods{
                font-size: 20px;
                cursor: pointer;
                .likeCount{
                    color: rgb(139, 123, 123);
                    font-size: 14px;
                }
            }
        }
    }
}
    
</style>