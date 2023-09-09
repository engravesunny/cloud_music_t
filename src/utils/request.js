import axios from 'axios'

const baseURL = import.meta.env.VITE_SRC
const request = axios.create({
  // baseURL:'/api',
  // baseURL:'http://localhost:3000/',
  // baseURL:'http://47.93.87.206:3000/',
  baseURL: "https://kecat.top:3000",
  withCredentials: true,
  timeout: 10000
})

// 请求拦截
request.interceptors.request.use(config => {
  if (config.method == 'post') {
    config.data = {
      ...config.data,
      _t: Date.parse(new Date()) / 1000
    }
  } else if (config.method == 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }
  return config;
}, error => {
  Promise.reject(error);
})

// 响应拦截
request.interceptors.response.use(response => {
  const cookie = response.headers['set-cookie']
  if (cookie) {
    document.cookie = cookie
  }
  return response;
}, error => {
  return Promise.reject(error);
})

export default request;
