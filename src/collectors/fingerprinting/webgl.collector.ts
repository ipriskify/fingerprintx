import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload, WebGLInfo } from "../../types";
import { getWebglFingerprintParams } from "../../utils/browser";
import { sha256Hex } from "../../utils/crypto";

export class WebGLCollector extends BaseCollector<
  Pick<TelemetryPayload, "webglInfo">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.WEBGL,
      category: CollectorCategory.FINGERPRINTING,
      priority: CollectorPriority.HIGH,
    });
  }

  isSupported(): boolean {
    return typeof document !== "undefined";
  }

  protected async doCollect(): Promise<Pick<TelemetryPayload, "webglInfo">> {
    let webglInfo: WebGLInfo = {};

    const canvas = this.safeExecute(
      () => document.createElement("canvas"),
      null,
    );
    if (!canvas) {
      return { webglInfo: this.createUnsupportedWebGLInfo() };
    }

    const gl = this.safeExecute(
      () =>
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
      null,
    ) as WebGLRenderingContext | WebGL2RenderingContext | null;

    if (gl) {
      const webglFPData = this.safeExecute(
        () => getWebglFingerprintParams(gl),
        null,
      );
      if (webglFPData) {
        webglInfo = { ...webglInfo, ...webglFPData.details };

        const hash = await this.safeExecuteAsync(
          () => sha256Hex(webglFPData.paramsString),
          "error",
        );
        webglInfo.fingerprint = hash;
      }
    }

    webglInfo.webgl2Supported = this.safeExecute(() => {
      const testCanvas = document.createElement("canvas");
      return !!testCanvas.getContext("webgl2");
    }, false);

    return { webglInfo };
  }

  private createUnsupportedWebGLInfo(): WebGLInfo {
    return {
      webgl2Supported: false,
      fingerprint: undefined,
    };
  }

  validate(data: Pick<TelemetryPayload, "webglInfo">): boolean {
    return (
      this.validateDataStructure(data, ["webglInfo"]) &&
      Boolean(
        data.webglInfo &&
          (data.webglInfo.fingerprint ||
            data.webglInfo.webgl2Supported !== undefined),
      )
    );
  }
}
