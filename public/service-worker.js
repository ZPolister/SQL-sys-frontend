// 定义缓存名称和预缓存资源列表
const CACHE_NAME = 'health-app-v1';
const PRE_CACHE_RESOURCES = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/android-chrome-512x512.png',
    '/manifest.json',
];


// 监听安装事件
self.addEventListener('install', event => {
    console.info('[ServiceWorker] 安装完成')
    event.waitUntil(
        caches.open(CACHE_NAME) // TODO 缓存没生效，随便了不维护了
            .then(cache => {
                console.info('[ServiceWorker] 正在缓存核心资源');
                return cache.addAll(PRE_CACHE_RESOURCES);
            })
            .then(() => {
                console.info('[ServiceWorker] 核心资源缓存完成');
                return self.skipWaiting(); // 强制激活新版本
            })
            .catch(error => {
                console.error('[ServiceWorker] 缓存失败:', error);
            })
    )
})

// 监听激活事件
self.addEventListener('activate', event => {
    console.info('[ServiceWorker] 激活完成')
    const CACHE_WHITELIST = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (!CACHE_WHITELIST.includes(name)) {
                        console.info('[ServiceWorker] 删除旧缓存:', name);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    )
})

// 监听通知点击事件
self.addEventListener('notificationclick', event => {
    event.notification.close();
    console.info('[ServiceWorker] 通知被点击');
    // 打开指定页面
    event.waitUntil(
        clients.openWindow('http://localhost:5173/')
    );
});

// 来自服务器推送事件
self.addEventListener("push", function (event) {
    const payload = event.data ? event.data.text() : "no payload";

    self.registration.showNotification("HealthApp", {
        body: `payload = ${payload}`,
    }).finally()
});
