import request from '@/utils/request.js'

export const getSingerCate = params => request({
    url: '/artist/list',
    params
})

