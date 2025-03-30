import {Configuration, DefaultApi, ResponseContext, SystemControllerApi} from "../api";
import {useLoginStore} from "../stores/useLoginStore";
import {MessagePlugin} from "tdesign-react";


export class HealthApp extends EventTarget {
  $DefaultApi: DefaultApi;
  $SystemControllerApi: SystemControllerApi;
  $isDarkTheme: boolean = false;
  private autoTheme: boolean = true;
  private themeChangeListeners: Array<(isDark: boolean) => void> = [];
  
  
  apiConfig: Configuration;

  constructor() {
    super();

    this.apiConfig = new Configuration({
      // basePath: __API_URL__,
      basePath: "/api",
      middleware: [
        {
          pre: context => {
            return new Promise((resolve, reject) => {
              console.log(`[HealthApp] 请求 ${context.url}`, context.init)
              resolve(context);
            });
          },
          post(context: ResponseContext): Promise<Response | void> {
            return new Promise(async (resolve, reject) => {
              // const res = context.response.clone()
              // console.log(`[HealthApp] 响应 ${context.url}`, await res.json())
              resolve(context.response);
            })
          }
        }
      ]
    })

    this.$DefaultApi = new DefaultApi(this.apiConfig);
    this.$SystemControllerApi = new SystemControllerApi(this.apiConfig);

    this.syncLoginState()
  }

  /**
   * 设置深浅色主题
   * @param theme 'dark' | 'light'
   * @param auto 是否自动跟随系统
   */
  setTheme(theme: 'dark' | 'light', auto: boolean = true) {
    const oldValue = this.$isDarkTheme;
    if (theme === 'dark') {
      this.$isDarkTheme = true;
      console.log('[HealthApp] 设置主题为深色' + this.$isDarkTheme);
      document.documentElement.setAttribute('theme-mode', 'dark')
    } else {
      this.$isDarkTheme = false;
      console.log('[HealthApp] 设置主题为浅色' + this.$isDarkTheme);
      document.documentElement.removeAttribute('theme-mode');
    }
    this.autoTheme = auto;
    
    // 如果主题发生了变化，通知所有监听器
    if (oldValue !== this.$isDarkTheme) {
      this.notifyThemeChangeListeners();
    }
  }
  
  /**
   * 添加主题变化监听器
   * @param listener 监听函数，接收一个布尔值参数表示是否为深色主题
   * @returns 用于移除监听器的函数
   */
  addThemeChangeListener(listener: (isDark: boolean) => void): () => void {
    this.themeChangeListeners.push(listener);
    return () => {
      this.themeChangeListeners = this.themeChangeListeners.filter(l => l !== listener);
    };
  }
  
  /**
   * 通知所有主题变化监听器
   */
  private notifyThemeChangeListeners() {
    for (const listener of this.themeChangeListeners) {
      listener(this.$isDarkTheme);
    }
  }

  /**
   * 获取当前是否处于自动主题模式
   */
  isAutoTheme() {
    return this.autoTheme;
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
        const isLogin: boolean = res.data ;
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

  logout() {
    useLoginStore.getState().setState('pending')

    $app.$DefaultApi.postApiAuthLogout()
      .then((res) => {
        if (res.code === 200) {
          MessagePlugin.success("退出成功").finally()
          useLoginStore.getState().setState('logout')
        } else {
          throw new Error("退出失败，未知错误")
        }
      })
      .catch((err) => {
        MessagePlugin.error(err.message).finally()
      })
  }

  async register(account: string, password: string, email: string, emailCode: string, birthday: string) {
    useLoginStore.getState().setState('pending')

    try {
      const res = await $app.$DefaultApi.postApiAuthRegister({
        registerDto: {
          username: account,
          password: password,
          email: email,
          birthday: birthday,
          code: emailCode
        }
      });
      if (res.code === 200) {
        MessagePlugin.success("注册成功，请继续登录").finally();
        useLoginStore.getState().setState('logout');
      } else {
        throw new Error("注册失败，未知错误");
      }
    } catch (err) {
      MessagePlugin.error(`${err}`).finally();
    }
  }

  sendEmailCode(email: string) {
    $app.$DefaultApi.postApiAuthSendCode({
      email: email
    })
      .then((res) => {
        if (res.code === 200) {
          MessagePlugin.success("发送成功").finally()
        } else {
          throw new Error("发送失败，未知错误")
        }
      })
      .catch((err) => {
        MessagePlugin.error(err.message).finally()
      })
  }
}

export const $app = new HealthApp();
