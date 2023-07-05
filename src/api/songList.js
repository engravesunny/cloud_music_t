import request from '@/utils/request'

// 轮播图
export const getHotBanner = params=>request({
    url:'/banner'
})

// 精品歌单

export const getHighPlayList = params=>request({
    url:'/top/playlist/highquality',
    params
})


// 推荐歌单

export const getDailyList = params=>request({
    url:'/personalized',
    params
})

// 每日推荐

export const getDailySongs = () => request({
    url:'/recommend/resource'
})

// 获取歌单所有歌曲

export const getSongListAllSong = params => request({
    url:'/playlist/track/all',
    params
})

// 获取歌曲评论

export const getSongCommits = params => request({
    url:"/comment/music",
    params
})

// 获取歌单详情

export const getSongListDetail = params => request({
    url:'/playlist/detail',
    params
})
