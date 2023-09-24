import { defineStore } from 'pinia'

export const user = defineStore('user', {
    state: () => {
        return {
            userInfo: {
                nickname: '',
                cookie: localStorage.getItem('CLOUD_MUSIC') || '',
                avatarUrl: '',
                id: ''
            }
        }
    },
    getters: {},
    actions: {
        reset() {
            this.userInfo = {
                nickname: '',
                cookie: localStorage.getItem('CLOUD_MUSIC') || '',
                avatarUrl: '',
                id: ''
            }
        }
    }
})