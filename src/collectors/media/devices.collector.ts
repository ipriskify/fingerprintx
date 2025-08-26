import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import {
  TelemetryPayload,
  MediaDevicesInfo,
  MediaDeviceInfoEntry,
} from "../../types";
import {
  MediaDeviceAccessLevel,
  MediaDevicePresence,
  MediaDeviceKind,
} from "../../types/fingerprint";

export class MediaDevicesCollector extends BaseCollector<
  Pick<TelemetryPayload, "mediaDevicesInfo" | "documentCookie">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.MEDIA_DEVICES,
      category: CollectorCategory.MEDIA,
      priority: CollectorPriority.MEDIUM,
    });
  }

  isSupported(): boolean {
    return typeof navigator !== "undefined" && typeof document !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "mediaDevicesInfo" | "documentCookie">
  > {
    const data: Pick<TelemetryPayload, "mediaDevicesInfo" | "documentCookie"> =
      {
        mediaDevicesInfo: {},
        documentCookie: this.safeExecute(() => document.cookie || "", ""),
      };

    if (!navigator.mediaDevices?.enumerateDevices) {
      data.mediaDevicesInfo = this.createUnsupportedMediaInfo();
      return data;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      data.mediaDevicesInfo!.devices = devices.map(
        (dev: MediaDeviceInfo): MediaDeviceInfoEntry => ({
          id: dev.deviceId.slice(0, 8),
          kind: dev.kind,
          hasLabel: !!dev.label,
        }),
      );

      data.mediaDevicesInfo!.microphoneAccess = this.determineMediaAccessLevel(
        devices,
        "audioinput",
      );
      data.mediaDevicesInfo!.webcamAccess = this.determineMediaAccessLevel(
        devices,
        "videoinput",
      );
      data.mediaDevicesInfo!.speakerAccess =
        this.determineSpeakerPresence(devices);
    } catch (error) {
      data.mediaDevicesInfo = this.createErrorMediaInfo();
    }

    return data;
  }

  private determineMediaAccessLevel(
    devices: MediaDeviceInfo[],
    deviceKind: string,
  ): string {
    try {
      const deviceOfType = devices.filter((dev) => dev.kind === deviceKind);
      if (deviceOfType.length === 0) {
        return MediaDeviceAccessLevel.NONE;
      }
      const hasLabels = deviceOfType.some(
        (dev) => dev.label && dev.label.length > 0,
      );
      return hasLabels
        ? MediaDeviceAccessLevel.LABELED
        : MediaDeviceAccessLevel.UNLABELED;
    } catch (error) {
      return MediaDeviceAccessLevel.ERROR;
    }
  }

  private determineSpeakerPresence(devices: MediaDeviceInfo[]): string {
    try {
      return devices.some((dev) => dev.kind === "audiooutput")
        ? MediaDevicePresence.PRESENT
        : MediaDevicePresence.NOT_PRESENT;
    } catch (error) {
      return MediaDevicePresence.ERROR;
    }
  }

  private createUnsupportedMediaInfo(): MediaDevicesInfo {
    return {
      devices: [{ id: "no_api", kind: "no_api", hasLabel: false }],
      microphoneAccess: MediaDeviceAccessLevel.UNSUPPORTED,
      webcamAccess: MediaDeviceAccessLevel.UNSUPPORTED,
      speakerAccess: MediaDevicePresence.UNSUPPORTED,
    };
  }

  private createErrorMediaInfo(): MediaDevicesInfo {
    return {
      devices: [{ id: "err", kind: "err", hasLabel: false }],
      microphoneAccess: MediaDeviceAccessLevel.ERROR,
      webcamAccess: MediaDeviceAccessLevel.ERROR,
      speakerAccess: MediaDevicePresence.ERROR,
    };
  }

  validate(
    data: Pick<TelemetryPayload, "mediaDevicesInfo" | "documentCookie">,
  ): boolean {
    return (
      this.validateDataStructure(data, [
        "mediaDevicesInfo",
        "documentCookie",
      ]) &&
      Boolean(
        data.mediaDevicesInfo?.devices &&
          Array.isArray(data.mediaDevicesInfo.devices),
      )
    );
  }
}
