import request from "@/utils/request";

// 轮播图
export const getHotBanner = (params) =>
  request({
    url: "/banner",
  });

// 精品歌单

export const getHighPlayList = (params) =>
  request({
    url: "/top/playlist/highquality",
    params,
  });

// 推荐歌单

export const getDailyList = (params) =>
  request({
    url: "/personalized",
    params,
  });

// 每日推荐

export const getDailySongs = () =>
  request({
    url: "/recommend/resource",
  });

// 获取歌单所有歌曲

export const getSongListAllSong = (params) =>
  request({
    url: "/playlist/track/all",
    params,
  });

// 获取歌曲评论

export const getSongCommits = (params) =>
  request({
    url: "/comment/music",
    params,
  });

// 发送歌曲评论

export const sendComment = (params) => request({
  url: "/comment",
  params
})

// 评论点赞
export const toGoodComment = (params) => request({
  url: "/comment/like",
  params
})

// 获取歌单详情

export const getSongListDetail = (params) =>
  request({
    url: "/playlist/detail",
    params,
  });

// 获取歌单分类

export const getListCategory = (params) =>
  request({
    url: "/playlist/catlist",
    params,
  });

// 获取分类歌单

export const getCatPlayList = (params) =>
  request({
    url: "/top/playlist",
    params,
  });

// 获取所有榜单

export const getAllRanks = (params) =>
  request({
    url: "/toplist",
    params,
  });

// 所有榜单内容摘要

export const getAllRankDetail = (params) =>
  request({
    url: "/toplist/detail",
    params,
  });

// 新碟上架
// area: ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本

// type : new:全部 hot:热门,默认为 new

// year : 年,默认本年

// month : 月,默认本月
// /top/album?offset=0&limit=30&year=2019&month=6
export const getNewAlbums = (params) =>
  request({
    url: "/top/album",
    params,
  });

// 新歌速递

// type: 地区类型 id,对应以下:

// 全部:0

// 华语:7

// 欧美:96

// 日本:8

// 韩国:16
export const getNewSongs = (params) =>
  request({
    url: "/top/song",
    params,
  });
