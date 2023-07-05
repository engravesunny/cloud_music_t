// 多歌手分割符分割
const mulArShow = (a) => {
    let res = ''
    if(a){
        a.map(item => {
            res = res + item.name + '/'
        })
    }
    return res.slice(0,res.length-1)
}

export default mulArShow