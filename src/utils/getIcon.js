export const getIcon = (name) => {
    const res = ''
    switch (name) {
        case '发现音乐':
            return String.fromCharCode(parseInt('e9ce', 16));
        case '私人FM':
            return String.fromCharCode(parseInt('e69d', 16));
        case '我的收藏':
            return String.fromCharCode(parseInt('e8ab', 16));
        case '每日推荐':
            return String.fromCharCode(parseInt('e685', 16));
    }
}