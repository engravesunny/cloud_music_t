import request from '@/utils/request.js'

export const getMyFavourite = params => request({
    url:'/likelist',
    params
})

export const getSongs = params => request({
    url:'/song/detail',
    params
})

// 用户歌单

export const getUserSongList = params => request({
    url:'/user/playlist',
    params
})


// 每日推荐歌曲

export const getDailySongs = params => request({
    url:'/recommend/songs'
})

// 收藏歌曲

export const toLikeSong = params => request({
    url:"/like",
    params
})

// 获取私人FM
export const privateFM = () => request({
    url:"/personal_fm"
})


