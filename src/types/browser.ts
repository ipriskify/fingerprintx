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
  cdc_adoQpoasnfa76pfcZLmcfl_Array?: any;
  cdc_adoQpoasnfa76pfcZLmcfl_Promise?: any;
  $cdc_asdjflasutopfhvcZLmcfl_Symbol?: any;
  chrome?: any;
  InstallTrigger?: any;
  StyleMedia?: any;
  opera?: any;
  AudioContext?: any;
  webkitAudioContext?: any;
  SpeechSynthesisUtterance?: any;
}
