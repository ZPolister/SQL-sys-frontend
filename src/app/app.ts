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
}

export const $app = new HealthApp();
