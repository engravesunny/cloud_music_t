import { defineStore } from 'pinia'

export const user = defineStore('user',{
    state: () => {
        return {
            userInfo:{
                nickname:'',
                cookie:'',
                avatarUrl:'',
                id:''
            }
        }
    },
    getters:{},
    actions:{}
})