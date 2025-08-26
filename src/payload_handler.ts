import { TelemetryPayload } from "./types";
import { sha256Hex } from "./utils/crypto";
export function calculatefingerprintInternal(
  data: TelemetryPayload,
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const fields: (string | number | boolean | undefined | null)[] = [];

      if (data.browserCapabilityInfo) {
        fields.push(data.browserCapabilityInfo.cookiesEnabled);
        fields.push(data.browserCapabilityInfo.hasIndexedDB);
        fields.push(data.browserCapabilityInfo.hasLocalStorage);
        fields.push(data.browserCapabilityInfo.hasMsSaveBlob);
        fields.push(data.browserCapabilityInfo.hasOpenDatabase);
        fields.push(data.browserCapabilityInfo.hasPromiseAllSettled);
        fields.push(data.browserCapabilityInfo.hasSessionStorage);
        fields.push(data.browserCapabilityInfo.hasWebkitRequestFileSystem);
        fields.push(data.browserCapabilityInfo.javaEnabled);
      }

      fields.push(data.endiannessByte);
      fields.push(data.evalLengthFingerprint);
      fields.push(data.fullscreenApiFingerprint);
      fields.push(data.mathFingerprint);
      fields.push(data.maxTouchPoints);

      if (data.mediaQueryMatches) {
        fields.push([...data.mediaQueryMatches].sort().join(","));
      }

      if (data.mobileHeuristics) {
        fields.push(data.mobileHeuristics.byTouchEvent);
        fields.push(data.mobileHeuristics.deviceOrientationApiDetected);
        fields.push(data.mobileHeuristics.specificUserAgentPatternDetected);
      }

      if (data.navigatorInfo) {
        fields.push(data.navigatorInfo.cpuClass);
        fields.push(data.navigatorInfo.hasServiceWorker);
      }

      if (data.permissionStatuses) {
        const sortedPermissions = [...data.permissionStatuses].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        for (const p of sortedPermissions) {
          fields.push(`${p.name}:${p.state}`);
        }
      }

      fields.push(data.platform);
      fields.push(data.rectsFingerprint);

      if (data.supportedVideoAudioCodecs) {
        fields.push([...data.supportedVideoAudioCodecs].sort().join(","));
      }

      fields.push(data.timeFormatPreference);
      fields.push(data.timezoneOffsetMinutes);
      fields.push(data.toFixedEngineId);

      if (data.touchCapabilityDetails) {
        fields.push(data.touchCapabilityDetails.maxPoints);
        fields.push(data.touchCapabilityDetails.touchApiSupported);
        fields.push(data.touchCapabilityDetails.touchEventSupported);
      }

      if (data.webglInfo) {
        fields.push(data.webglInfo.maxFragmentUniformVectors);
        fields.push(data.webglInfo.maxTextureImageUnits);
        fields.push(data.webglInfo.maxTextureSize);
        fields.push(data.webglInfo.maxVaryingVectors);
        if (data.webglInfo.maxViewportDimsObj) {
          fields.push(data.webglInfo.maxViewportDimsObj.width);
          fields.push(data.webglInfo.maxViewportDimsObj.height);
        }
        fields.push(data.webglInfo.unmaskedRenderer);
        fields.push(data.webglInfo.webgl2Supported);
      }

      const finalString = fields.map((f) => String(f ?? "")).join("|");

      sha256Hex(finalString).then(resolve).catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

export function serializePayloadToJson(payload: TelemetryPayload): string {
  return JSON.stringify(payload);
}
