import request from '@/utils/request.js'

// 搜索关键词
export const search = params => request({
    url:'/cloudsearch',
    params
})

// 默认搜索关键词
export const searchDefault = () => request({
    url:"/search/default"
})

// 热搜列表
export const searchHot = () => request({
    url:"/search/hot"
})

// 搜索建议
export const searchSuggest = params => request({
    url:"/search/suggest",
    params
})

// 搜索多重匹配
export const searchResult = params => request({
    url:"/search/multimatch",
    params
})


// 获取歌曲url

export const getSongUrl = params => request({
    url:"/song/url",
    params
})


// 音乐是否可用

export const checkSong = params => request({
    url:"/check/music",
    params
})
