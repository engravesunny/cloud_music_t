import { ElMessage } from "element-plus";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: '/',
        name: 'layout',
        redirect: '/findSong',
        component: () => import('@/view/Layout/index.vue'),
        children: [
            {
                path: "/search",
                name: 'search',
                component: () => import('@/view/search/index.vue'),
                meta: {
                    component: 'Search'
                }
            },
            {
                path: "/findSong",
                name: 'findSong',
                component: () => import('@/view/findSong/index.vue'),
                meta: {
                    component: 'findSong'
                }
            },
            {
                path: "/myLike",
                name: 'myLike',
                component: () => import('@/view/myLike/index.vue'),
                meta: {
                    component: 'myLike'
                }
            },
            {
                path: "/suggestSong",
                name: 'suggestSong',
                component: () => import('@/view/suggestSong/index.vue'),
                meta: {
                    component: 'suggestSong'
                }
            },
            {
                path: "/privateFM",
                name: 'privateFM',
                component: () => import('@/view/privateFM/index.vue'),
                meta: {
                    component: 'privateFM'
                }
            },
            {
                path: "/songList",
                name: 'songList',
                component: () => import('@/view/songList/index.vue'),
                meta: {
                    component: 'songList'
                }
            },
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

const routeNeedToken = ["/myLike", "/suggestSong", "/songList", "/privateFM"]

router.beforeEach((to, from, next) => {
    // 判断是否为需要登录的path
    if (routeNeedToken.indexOf(to.fullPath) > -1) {
        // 未登录
        if (!localStorage.getItem('userInfo')) {
            ElMessage('请您先登录')
            next('/findSong')
        } else {
            next()
        }
    } else {
        next()
    }
})


export default router;