import request from "../utils/request";

export const getSongText = (params: any) =>
  request({
    url: "/lyric",
    params,
  });
