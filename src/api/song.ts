import request from "../utils/request";
interface Params {
  id: string | number;
}
export const getSongText = (params: Params) =>
  request({
    url: "/lyric",
    params,
  });
