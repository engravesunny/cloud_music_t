<template>
  <div class="singer-page-top">
    <div class="leftAvatar">
      <div class="img">
        <img
          :src="http2Https(singer.avatar + '?params=140y140')"
          :alt="singer.name"
        />
      </div>
    </div>
    <div class="rightInfo">
      <div class="title">艺术家</div>
      <div class="name">{{ singer.name }}</div>
      <div class="nickname">
        <span
          class="nickname-item"
          v-for="nickname in singer.nickname"
          :key="nickname"
          >{{ nickname }}</span
        >
      </div>
      <div class="dataCount iconfont">
        <div class="album-count">
          &#xe601; {{ singer.dataCount.albumsCount }}
        </div>
        <div class="music-count">
          &#xe60a; {{ singer.dataCount.songsCount }}
        </div>
        <div class="mv-count">&#xe630; {{ singer.dataCount.MVCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { http2Https } from "@/utils/http2Https";
import { singerInfo } from "../types/index";
const props = defineProps<{
  singer: singerInfo;
}>();
</script>

<style lang="less" scoped>
.singer-page-top {
  width: 100%;
  height: 200px;
  display: flex;
  gap: 20px;

  .leftAvatar {
    height: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 6px;

    .img {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: linear-gradient(-45deg, #f1f2f3 25%, #fff 45%, #f1f2f3 65%);
      background-size: 400% 100%;
      animation: skeleton-loading 1.2s ease-in-out infinite;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .rightInfo {
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 14px;
    }

    .name {
      font-size: 58px;
      padding: 5px 0;
    }

    .nickname {
      width: 100%;
      display: flex;
      color: var(--font-color-light);
      font-size: 20px;

      .nickname-item + .nickname-item {
        &::before {
          content: "；";
          font-size: 20px;
          display: inline;
        }
      }
    }

    .dataCount {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 20px;
      font-weight: 700;
    }
  }
}
</style>
