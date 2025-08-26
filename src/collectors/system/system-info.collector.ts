import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import {
  TelemetryPayload,
  DeviceStorage,
  PermissionStatusInfo,
  WebGPUInfo,
  UserAgentBrandVersion,
  UADataValues,
  NavigatorExtended,
  WindowExtended,
  WebGpuStatusId,
  PermissionState,
} from "../../types";

export class SystemInfoCollector extends BaseCollector<
  Pick<
    TelemetryPayload,
    | "zoomLevelHeuristic"
    | "deviceStorage"
    | "permissionStatuses"
    | "webgpuInfo"
    | "webrtcLeakInfo"
    | "toFixedEngineId"
    | "userAgentDataBrands"
    | "userAgentDataMobile"
    | "userAgentDataArchitecture"
    | "userAgentDataBitness"
    | "userAgentDataModel"
    | "userAgentDataPlatformVersion"
    | "userAgentDataFullVersionList"
    | "userAgentDataWow64"
  >
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.SYSTEM_INFO,
      category: CollectorCategory.SYSTEM,
      priority: CollectorPriority.MEDIUM,
    });
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && typeof navigator !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<
      TelemetryPayload,
      | "zoomLevelHeuristic"
      | "deviceStorage"
      | "permissionStatuses"
      | "webgpuInfo"
      | "webrtcLeakInfo"
      | "toFixedEngineId"
      | "userAgentDataBrands"
      | "userAgentDataMobile"
      | "userAgentDataArchitecture"
      | "userAgentDataBitness"
      | "userAgentDataModel"
      | "userAgentDataPlatformVersion"
      | "userAgentDataFullVersionList"
      | "userAgentDataWow64"
    >
  > {
    const results = await Promise.all([
      this.getZoomLevelHeuristic(),
      this.getDeviceStorage(),
      this.getPermissionStatuses(),
      this.getWebGPUInfo(),
      this.getWebRTCLeakInfo(),
      this.getToFixedEngineId(),
      this.getUserAgentDataInfo(),
    ]);

    const [
      zoomLevel,
      deviceStorage,
      permissions,
      webgpu,
      webrtc,
      toFixed,
      userAgentData,
    ] = results;

    return {
      zoomLevelHeuristic: zoomLevel,
      deviceStorage,
      permissionStatuses: permissions,
      webgpuInfo: webgpu,
      webrtcLeakInfo: webrtc,
      toFixedEngineId: toFixed,
      ...userAgentData,
    };
  }

  private async getZoomLevelHeuristic(): Promise<number | undefined> {
    return this.safeExecute(() => {
      if (window.visualViewport && window.visualViewport.scale) {
        return window.visualViewport.scale;
      } else {
        return window.devicePixelRatio || undefined;
      }
    }, undefined);
  }

  private async getDeviceStorage(): Promise<DeviceStorage> {
    return new Promise((resolve) => {
      const storageData: DeviceStorage = {};
      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage
          .estimate()
          .then((estimate) => {
            storageData.quota = estimate.quota;
            storageData.usage = estimate.usage;
            resolve(storageData);
          })
          .catch(() => resolve(storageData));
      } else {
        resolve(storageData);
      }
    });
  }

  private async getPermissionStatuses(): Promise<PermissionStatusInfo[]> {
    return new Promise((resolve) => {
      const permissionStatuses: PermissionStatusInfo[] = [];
      if (navigator.permissions) {
        const standardPerms = [
          "geolocation",
          "notifications",
          "persistent-storage",
          "midi",
          "camera",
          "microphone",
          "accelerometer",
          "gyroscope",
          "magnetometer",
        ];

        const permPromises = standardPerms.map((pName) =>
          navigator
            .permissions!.query({ name: pName as PermissionName })
            .then((result) => ({
              name: pName,
              state: this.mapBrowserPermissionState(result.state),
            }))
            .catch(() => null),
        );

        Promise.all(permPromises).then((results) => {
          results.forEach((result) => {
            if (result) {
              permissionStatuses.push(result);
            }
          });
          resolve(permissionStatuses);
        });
      } else {
        resolve(permissionStatuses);
      }
    });
  }

  private mapBrowserPermissionState(state: string): PermissionState {
    switch (state) {
      case "granted":
        return PermissionState.GRANTED;
      case "denied":
        return PermissionState.DENIED;
      case "prompt":
        return PermissionState.PROMPT;
      default:
        return PermissionState.UNKNOWN;
    }
  }

  private async getWebGPUInfo(): Promise<WebGPUInfo> {
    return new Promise((resolve) => {
      const webgpuInfo: WebGPUInfo = {
        status: WebGpuStatusId.WEB_GPU_STATUS_NOT_AVAILABLE,
      };

      const nav = navigator as NavigatorExtended;
      if (!nav.gpu || !nav.gpu.requestAdapter) {
        resolve(webgpuInfo);
        return;
      }

      nav.gpu
        .requestAdapter()
        .then((adapter) => {
          if (!adapter) {
            webgpuInfo.status =
              WebGpuStatusId.WEB_GPU_STATUS_ADAPTER_REQUEST_FAILED;
            resolve(webgpuInfo);
            return;
          }

          // Try to get adapter info if available
          if (adapter.requestAdapterInfo) {
            adapter
              .requestAdapterInfo()
              .then((info) => {
                if (info) {
                  webgpuInfo.vendor = info.vendor;
                  webgpuInfo.architecture = info.architecture;
                  webgpuInfo.device = info.device;
                  webgpuInfo.description = info.description;
                  webgpuInfo.status = WebGpuStatusId.WEB_GPU_STATUS_SUCCESS;
                }
                resolve(webgpuInfo);
              })
              .catch(() => {
                webgpuInfo.status =
                  WebGpuStatusId.WEB_GPU_STATUS_ADAPTER_INFO_FAILED;
                resolve(webgpuInfo);
              });
          } else {
            webgpuInfo.status = WebGpuStatusId.WEB_GPU_STATUS_SUCCESS;
            resolve(webgpuInfo);
          }
        })
        .catch(() => {
          webgpuInfo.status =
            WebGpuStatusId.WEB_GPU_STATUS_ADAPTER_REQUEST_FAILED;
          resolve(webgpuInfo);
        });
    });
  }

  private async getWebRTCLeakInfo(): Promise<string[]> {
    return new Promise((resolve) => {
      const ips: string[] = [];
      const RTCPeerConnection =
        (window as any).RTCPeerConnection ||
        (window as any).webkitRTCPeerConnection ||
        (window as any).mozRTCPeerConnection;

      if (!RTCPeerConnection) {
        resolve(["no_rtc_api"]);
        return;
      }

      let pc: RTCPeerConnection | null = null;
      try {
        pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
      } catch (e) {
        resolve(["rtc_init_failed"]);
        return;
      }

      const handleCandidate = (candidate?: RTCIceCandidate | null) => {
        if (candidate && candidate.candidate) {
          const ipMatch = candidate.candidate.match(
            /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/,
          );
          if (ipMatch && !ips.includes(ipMatch[0])) {
            ips.push(ipMatch[0]);
          }
        }
      };

      if (pc) {
        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          handleCandidate(event.candidate);
        };
      }

      (pc as any).createDataChannel("");

      if (pc) {
        pc.createOffer()
          .then((offer) => pc!.setLocalDescription(offer))
          .catch(() => {});
      }

      setTimeout(() => {
        if (pc) {
          pc.close();
        }
        resolve(ips.length === 0 ? ["no_leak_detected"] : ips);
      }, 1000);
    });
  }

  private async getToFixedEngineId(): Promise<number> {
    return this.safeExecute(() => {
      let toFixedEngineID = 0;
      const neg: number = -1;
      try {
        if (neg.toFixed(0) === "0") {
          toFixedEngineID += 1;
        }
      } catch (e: unknown) {
        toFixedEngineID += 2;
      }
      return toFixedEngineID;
    }, -1);
  }

  private async getUserAgentDataInfo(): Promise<
    Partial<
      Pick<
        TelemetryPayload,
        | "userAgentDataBrands"
        | "userAgentDataMobile"
        | "userAgentDataArchitecture"
        | "userAgentDataBitness"
        | "userAgentDataModel"
        | "userAgentDataPlatformVersion"
        | "userAgentDataFullVersionList"
        | "userAgentDataWow64"
      >
    >
  > {
    return new Promise((resolve) => {
      const nav = navigator as NavigatorExtended;
      if (nav.userAgentData) {
        const uaData = nav.userAgentData;
        const result = {
          userAgentDataBrands: uaData.brands,
          userAgentDataMobile: uaData.mobile,
        };

        if (uaData.getHighEntropyValues) {
          uaData
            .getHighEntropyValues([
              "architecture",
              "bitness",
              "model",
              "platformVersion",
              "fullVersionList",
              "wow64",
            ])
            .then((highEntropyValues: UADataValues) => {
              resolve({
                ...result,
                userAgentDataArchitecture: highEntropyValues.architecture,
                userAgentDataBitness: highEntropyValues.bitness,
                userAgentDataModel: highEntropyValues.model,
                userAgentDataPlatformVersion: highEntropyValues.platformVersion,
                userAgentDataFullVersionList: highEntropyValues.fullVersionList,
                userAgentDataWow64: highEntropyValues.wow64,
              });
            })
            .catch(() => resolve(result));
        } else {
          resolve(result);
        }
      } else {
        resolve({});
      }
    });
  }

  validate(
    data: Pick<
      TelemetryPayload,
      | "zoomLevelHeuristic"
      | "deviceStorage"
      | "permissionStatuses"
      | "webgpuInfo"
      | "webrtcLeakInfo"
      | "toFixedEngineId"
      | "userAgentDataBrands"
      | "userAgentDataMobile"
      | "userAgentDataArchitecture"
      | "userAgentDataBitness"
      | "userAgentDataModel"
      | "userAgentDataPlatformVersion"
      | "userAgentDataFullVersionList"
      | "userAgentDataWow64"
    >,
  ): boolean {
    return (
      this.validateDataStructure(data, ["webrtcLeakInfo", "toFixedEngineId"]) &&
      Array.isArray(data.webrtcLeakInfo) &&
      typeof data.toFixedEngineId === "number"
    );
  }
}
