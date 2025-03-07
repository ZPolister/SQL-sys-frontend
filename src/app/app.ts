import {AnalysisControllerApi, Configuration, DefaultApi, SystemControllerApi} from "../api";


export class HealthApp extends EventTarget {
  $DefaultApi: DefaultApi;
  $AnalysisControllerApi: AnalysisControllerApi;
  $SystemControllerApi: SystemControllerApi;

  apiConfig: Configuration;

  constructor() {
    super();

    this.apiConfig = new Configuration({
      basePath: __API_URL__,
      middleware: [
        {
          pre: context => {
            return new Promise((resolve, reject) => {
              console.log(`[HealthApp] 请求 ${context.url}`)

              resolve(context);
            });
          }
        }
      ]
    })

    this.$DefaultApi = new DefaultApi(this.apiConfig);
    this.$AnalysisControllerApi = new AnalysisControllerApi(this.apiConfig);
    this.$SystemControllerApi = new SystemControllerApi(this.apiConfig);
  }

  showVersion() {
    console.log(`Version: TTXX \nAPI: ${__API_URL__}`);
    this.$SystemControllerApi.getSystem().then((res) => {
      console.log(res);
    })
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      console.log('[ServiceWorker] 恭喜，您的浏览器支持PWA应用')
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            registration.update().finally(() => {
              console.log('[ServiceWorker] 应用已更新')
            })
          });
      });
    }
  }

  requestNotificationPermission() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('[Notification] 获得通知权限')
        }
      });
    }
  }

  sendNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      return new Notification(title, {
        body,
        icon: '/android-chrome-512x512.png'
      });
    } else {
      return null;
    }
  }
}

export const $app = new HealthApp();
