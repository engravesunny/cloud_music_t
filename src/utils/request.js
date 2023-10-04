import axios from 'axios'

const baseURL = import.meta.env.VITE_SRC
const request = axios.create({
  // baseURL: '/api',
  // baseURL:'http://localhost:3000/',
  // baseURL:'http://47.93.87.206:3000/',
  baseURL: "http://kecat.top:3000",
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
  if (response.status !== 200) {
    console.log(response);
  }
  if (response.data.code === 301) {
    ElMessage.error(response.data.msg);
  }
  const cookie = response.headers['set-cookie']
  if (cookie) {
    document.cookie = cookie
  }
  return response;
}, error => {
  return Promise.reject(error);
})

export default request;
