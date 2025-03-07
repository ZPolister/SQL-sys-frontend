import {AnalysisControllerApi, Configuration, DefaultApi, SystemControllerApi} from "../api";
import {useLoginStore} from "../stores/useLoginStore";
import {MessagePlugin} from "tdesign-react";

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
              console.log(`[HealthApp] 请求 ${context.url}`, context.init)
              resolve(context);
            });
          },
        }
      ]
    })

    this.$DefaultApi = new DefaultApi(this.apiConfig);
    this.$AnalysisControllerApi = new AnalysisControllerApi(this.apiConfig);
    this.$SystemControllerApi = new SystemControllerApi(this.apiConfig);

    this.syncLoginState()
  }

  showVersion() {
    console.log(`Version: TTXX \nAPI: ${__API_URL__}`);
    this.$SystemControllerApi.getSystem().then((res) => {
      console.log(res);
    })
  }

  /**
   * 注册ServiceWorker
   * @deprecated 不维护了
   */
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

  /**
   * 请求通知权限
   */
  requestNotificationPermission() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('[Notification] 获得通知权限')
        }
      });
    }
  }

  /**
   * 发送通知
   * @param title
   * @param body
   */
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

  /**
   * @todo 需要完善
   */
  syncLoginState() {
    this.$DefaultApi.getApiAuthCheckLogin()
      .then(res => {
        const isLogin: boolean = res.data;
        if (isLogin) {
          MessagePlugin.success('欢迎回来').finally();
          useLoginStore.getState().setState('logged');
        } else {
          MessagePlugin.warning('您还未登录，请登录').finally();
          useLoginStore.getState().setState('logout');
        }
      })
      .catch(() => {
        MessagePlugin.error('检查登录失败').finally();
        useLoginStore.getState().setState('logout');
      })
  }

  login(account: string, password: string) {
    useLoginStore.getState().setState('pending')

    $app.$DefaultApi.postApiAuthLogin({
      loginDto: {
        identifier: account,
        password: password
      }
    })
      .then((res) => {
        console.log(res)
        if (res.code === 200) {
          MessagePlugin.success("登录成功").finally()
          useLoginStore.getState().setState('logged')
        } else if (res.code === 505) {
          throw new Error("登录失败，账号或密码错误")
        } else if (res.code === 511) {
          throw new Error("登录失败，账户被禁用")
        } else {
          throw new Error("登录失败，未知错误")
        }
      })
      .catch((err) => {
        MessagePlugin.error(err.message).finally()
        useLoginStore.getState().setState('logout')
      })
  }
}

export const $app = new HealthApp();
