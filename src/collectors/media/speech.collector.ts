import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload, SpeechVoiceInfo } from "../../types";
import {
  getSpeechSynthesisFingerprint,
  getSpeechSynthesisVoices,
} from "../../utils/browser";

export class SpeechSynthesisCollector extends BaseCollector<
  Pick<TelemetryPayload, "speechApiFingerprint" | "speechVoices">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.SPEECH_SYNTHESIS,
      category: CollectorCategory.MEDIA,
      priority: CollectorPriority.MEDIUM,
    });
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && typeof navigator !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "speechApiFingerprint" | "speechVoices">
  > {
    const speechApiFingerprint = this.safeExecute(
      () => getSpeechSynthesisFingerprint(),
      undefined,
    );
    const speechVoices = await this.safeExecuteAsync(
      () => getSpeechSynthesisVoices(),
      [],
    );

    return {
      speechApiFingerprint,
      speechVoices,
    };
  }

  validate(
    data: Pick<TelemetryPayload, "speechApiFingerprint" | "speechVoices">,
  ): boolean {
    return (
      this.validateDataStructure(data, [
        "speechApiFingerprint",
        "speechVoices",
      ]) &&
      (data.speechApiFingerprint !== undefined ||
        data.speechVoices !== undefined)
    );
  }
}
