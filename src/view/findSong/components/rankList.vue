<template>
    <div class="official-rank">
        <div class="title">官方榜</div>
        <div class="official-rank-item" v-for="(item, itemInd) in officialRankInfo" :key="item.name">
            <div class="cover-img" @click="handleClickRank(item.id)">
                <el-image style="width: 200px; height: 200px;" :src="item.coverImgUrl"></el-image>
                <div class="playBtn iconfont" @click.stop="handlePlayClick(item)">&#xe87c;</div>
                <div class="date">
                    {{ mdDate(item.updateTime) + "更新" }}
                </div>
            </div>
            <ul class="song-display">
                <li class="song" v-for="(song, index) in item.tracks" @dblclick="playRankSong(itemInd, index)"
                    :key="item.first">
                    <span class="song-name">{{ index + 1 + ' ' + song.first }}</span>
                    <span class="song-ar">{{ song.second }}</span>
                </li>
            </ul>
        </div>
    </div>
    <div class="title" style="margin-left: 20px;">全球榜</div>
    <play-list :suggest-lists="erRankInfo"></play-list>
</template>

<script setup>
import { mdDate } from '@/utils/formatDate'
import playSong from '../../../utils/playSong';
import playAll from '@/utils/playAll';
import playList from './suggestList.vue'
import { getAllRanks, getAllRankDetail, getSongListAllSong } from '@/api/songList'
import { onBeforeMount, reactive } from 'vue';
import { ElMessage } from 'element-plus';
const router = useRouter();
const officialRankInfo = reactive([]);
const erRankInfo = reactive([]);

const getAllRankList = async () => {
    const { data: rank } = await getAllRankDetail()
    const list = rank.list;
    const officialTempList = list.splice(0, 4);
    const erTempList = list
    officialTempList.forEach(item => {
        officialRankInfo.push(item)
    })
    erTempList.forEach(item => {
        erRankInfo.push(item)
    })
}

let toSongList = (id) => {
    router.push({
        path: '/songlist',
        query: {
            songListInfoId: id
        }
    })
}

const handlePlayClick = async (item) => {
    try {
        if (item.playList) {
            playAll(item.playList)
        } else {
            const id = item.id;
            const { data: songList } = await getSongListAllSong({
                id
            })
            item.playList = songList.songs
        }
        playAll(item.playList)
    } catch (error) {
        ElMessage.error(error)
    }

}

const handleClickRank = (id) => {
    toSongList(id)
}

// itemInd歌单序列号 songInd歌曲序列号
const playRankSong = async (itemInd, songInd) => {
    const RankInfo = officialRankInfo[itemInd]
    if (RankInfo.playList) {
        playSong(RankInfo.playList[songInd])
    } else {
        const { data: songList } = await getSongListAllSong({
            id: RankInfo.id
        })
        RankInfo.playList = songList.songs
        playSong(RankInfo.playList[songInd])
    }
}

onBeforeMount(async () => {
    await getAllRankList();
})



</script>

<style lang="less" scoped>
.title {
    font-size: 30px;
    font-weight: 700;
    padding: 10px 0px;
}

.official-rank {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;

    .official-rank-item {
        margin-bottom: 20px;
        height: 200px;
        display: flex;


        .cover-img {
            position: relative;
            width: 200px;
            height: 200px;
            aspect-ratio: 1;
            border-radius: 10px;
            overflow: hidden;
            background: linear-gradient(-45deg, #F1F2F3 25%, #fff 45%, #F1F2F3 65%);
            background-size: 400% 100%;
            animation: skeleton-loading 1.2s ease-in-out infinite;
            cursor: pointer;

            &:hover {
                .playBtn {
                    opacity: 1;
                }
            }

            .playBtn {
                opacity: 0;
                position: absolute;
                right: 10px;
                bottom: 10px;
                width: 25%;
                font-size: 30px;
                aspect-ratio: 1;
                background-color: var();
                color: var(--inner-body-color);
                background: var(--click-enable-color);
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                transition: all .3s;

                &:hover {
                    transform: scale(1.1);
                }

                &:active {
                    transform: scale(1.0);
                }
            }

            .date {
                position: absolute;
                top: 75%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
                font-size: 14px;
            }
        }

        .song-display {
            flex: 1;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            height: 100%;

            .song {
                font-size: 20px;
                width: 100%;
                height: 33%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 5px;
                padding: 0 20px;
                cursor: pointer;
                transition: all .1s;

                .song-ar {
                    margin-right: 20px;
                }

                &:nth-child(1),
                &:nth-child(3) {
                    background-color: var(--siderbar-hover-color);
                }

                &:hover {
                    background-color: var(--siderbar-active-color);
                }

                &:active {
                    background-color: var(--siderbar-hover-color);
                }
            }
        }
    }
}
</style>