import { getMyFavourite } from '@/api/myFavourite.js'
import {user} from '@/store/user'
import { storeToRefs } from 'pinia'
import { ElMessage } from "element-plus"

const userStore = user()

const { userInfo } = storeToRefs(userStore)
const ids =async() => {
    const {data} = await getMyFavourite({
        id:userInfo.value.id
    })
    return data.ids
}

export default ids