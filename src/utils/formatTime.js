// 毫秒转 分:秒
const formatTime= (a)=> {
    if(a===0)return '00:00'
    let m = 0
    let s = 0
    m = Math.floor(a/60000)
    s = Math.floor((a%60000)/1000)
    const tos = (a) => {
        if(a<10){
            return '0'+a
        } else {
            return a.toString()
        }
    }
    return tos(m) + ':' + tos(s)

}

export default formatTime;