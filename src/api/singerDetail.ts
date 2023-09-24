import request from "../utils/request";

// 获取歌手详情
export const getSingerDetail = (params: any) =>
  request({
    url: "/artist/detail",
    params,
  });

// 获取歌手描述
export const getSingerDes = (params: any) =>
  request({
    url: "/artist/desc",
    params,
  });

// 获取歌手专辑
export const getSingerAlbum = (params: any) =>
  request({
    url: "/artist/album",
    params,
  });

// 获取歌手单曲
export const getSingerSongs = (params: any) =>
  request({
    url: "/artists",
    params,
  });

// 获取相似歌手
export const getSingerSim = (params: any) =>
  request({
    url: "/simi/artist",
    params,
  });
