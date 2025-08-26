import {
  NetworkInformation,
  BatteryManager,
  UserAgentData,
  GPU,
} from "./browser-apis";

export interface NavigatorExtended extends Navigator {
  cpuClass?: string;
  userLanguage?: string;
  browserLanguage?: string;
  systemLanguage?: string;
  msDoNotTrack?: string;
  deviceMemory?: number;
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
  getBattery?: () => Promise<BatteryManager>;
  userAgentData?: UserAgentData;
  requestMediaKeySystemAccess: (
    keySystem: string,
    supportedConfigurations: any[],
  ) => Promise<any>;
  gpu?: GPU;
  msSaveBlob?: any;
  webkitTemporaryStorage?: {
    queryUsageAndQuota: (
      successCallback: (usedBytes: number, grantedBytes: number) => void,
      errorCallback?: (error: any) => void,
    ) => void;
  };
  serviceWorker: ServiceWorkerContainer;
  brave?: {
    isBrave: () => Promise<boolean>;
    [key: string]: any;
  };
}

export interface WindowExtended extends Window {
  doNotTrack?: string;
  webkitRequestFileSystem?: (
    type: number,
    size: number,
    successCallback: (fs: any) => void,
    errorCallback?: (error: Error) => void,
  ) => void;
  openDatabase?: (
    name: string | null,
    version: string | null,
    displayName: string | null,
    estimatedSize: number | null,
    creationCallback?: (db: any) => void,
  ) => any | null;
  _phantom?: any;
  callPhantom?: any;
  Buffer?: any;
  emit?: any;
  spawn?: any;
  awesomium?: any;
  fmget_targets?: any;
  geb?: any;
  __nightmare?: any;
  nightmare?: any;
  __phantomas?: any;
  _Selenium_IDE_Recorder?: any;
  _selenium?: any;
  calledSelenium?: any;
  wdioElectron?: any;
  __webdriverFunc?: any;
  __lastWatirAlert?: any;
  __lastWatirConfirm?: any;
  __lastWatirPrompt?: any;
  _WEBDRIVER_ELEM_CACHE?: any;
  ChromeDriverw?: any;
  domAutomation?: any;
  domAutomationController?: any;
  RunPerfTest?: any;
  CefSharp?: any;
  cdc_adoQpoasnfa76pfcZLmcfl_Array?: any;
  cdc_adoQpoasnfa76pfcZLmcfl_Promise?: any;
  $cdc_asdjflasutopfhvcZLmcfl_Symbol?: any;
  WebGLRenderingContext?: typeof WebGLRenderingContext;
  WebGL2RenderingContext?: typeof WebGL2RenderingContext;
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
  SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance;
  InstallTrigger?: any;
  chrome?: {
    webstore?: any;
    runtime?: any;
    [key: string]: any;
  };
  StyleMedia?: any;
  opera?: any;
  safari?: any;
}
