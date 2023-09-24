import request from "../utils/request";

export const getAlbumContent = params => request({
    url: "/album",
    params
})
