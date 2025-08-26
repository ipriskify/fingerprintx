import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload } from "../../types";
import { getAudioContextFingerprintData } from "../../utils/browser";
import { sha256Hex } from "../../utils/crypto";

export class AudioFingerprintCollector extends BaseCollector<
  Pick<TelemetryPayload, "audioFingerprint">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.AUDIO_FINGERPRINT,
      category: CollectorCategory.FINGERPRINTING,
      priority: CollectorPriority.MEDIUM,
    });
  }

  isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      (typeof (window as any).AudioContext !== "undefined" ||
        typeof (window as any).webkitAudioContext !== "undefined")
    );
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "audioFingerprint">
  > {
    const audioData = getAudioContextFingerprintData();
    const hash = await sha256Hex(audioData);
    return { audioFingerprint: hash };
  }

  validate(data: Pick<TelemetryPayload, "audioFingerprint">): boolean {
    return (
      this.validateDataStructure(data, ["audioFingerprint"]) &&
      Boolean(data.audioFingerprint && data.audioFingerprint.length > 0)
    );
  }
}
