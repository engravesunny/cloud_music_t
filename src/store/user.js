import { defineStore } from "pinia";

export const user = defineStore("user", {
  state: () => {
    return {
      userInfo: {
        nickname: "",
        cookie: "",
        avatarUrl: "",
        id: "",
        theme: "",
      },
    };
  },
  getters: {
    getUserInfo() {
      return this.userInfo;
    },
  },
  actions: {
    reset() {
      this.userInfo = {
        nickname: "",
        cookie: localStorage.getItem("CLOUD_MUSIC") || "",
        avatarUrl: "",
        id: "",
      };
    },
    init() {
      this.userInfo = {
        ...this.userInfo,
        cookie: localStorage.getItem("CLOUD_MUSIC") || "",
        theme: localStorage.getItem("THEME") || "",
      };
    },
  },
});
