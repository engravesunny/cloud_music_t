import request from '@/utils/request.js'

// // 手机号登录
// export const phoneLogin = params => request({
//     method: 'post',
//     url:'/login/cellphone',
//     params
// })


// // 发送验证码
// export const sendCode = params => request({
//     method:'post',
//     url:'/captcha/sent',
//     params
// })

// // 短信登录
// export const codeLogin = params => request({
//     method:'post',
//     url:'/captcha/verify',
//     params
// })

// 以上api无法通过验证，只可以用二维码登录

// 二维码登录接口

// 二维码key生成接口

export const qrKey = () => request({
    url:'/login/qr/key'
})

// 二维码生成接口

export const qrCreate = params => request({
    url:'/login/qr/create',
    params
})

// 二维码检测扫码状态接口

export const qrCheck = params => request({
    url:'/login/qr/check',
    params
})

// 退出登录

export const logout = () => request({
    url:"/logout"
})

// 获取用户信息

export const getUserInfoDetail = () => request({
    url:'/user/account'
})