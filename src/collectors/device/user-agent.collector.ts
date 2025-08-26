import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload, NavigatorExtended } from "../../types";

export class UserAgentCollector extends BaseCollector<
  Pick<
    TelemetryPayload,
    "userAgent" | "language" | "platform" | "timezoneOffsetMinutes"
  >
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.USER_AGENT,
      category: CollectorCategory.DEVICE,
      priority: CollectorPriority.CRITICAL,
      timeout: 1000,
    });
  }

  isSupported(): boolean {
    return typeof navigator !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<
      TelemetryPayload,
      "userAgent" | "language" | "platform" | "timezoneOffsetMinutes"
    >
  > {
    const nav = navigator as NavigatorExtended;
    const data: Pick<
      TelemetryPayload,
      "userAgent" | "language" | "platform" | "timezoneOffsetMinutes"
    > = {};

    data.userAgent = nav.userAgent || undefined;
    data.language =
      nav.language ||
      nav.userLanguage ||
      nav.browserLanguage ||
      nav.systemLanguage ||
      undefined;

    data.platform = this.safeExecute(
      () => nav.platform || "unknown",
      "unknown",
    );
    data.timezoneOffsetMinutes = this.safeExecute(
      () => new Date().getTimezoneOffset(),
      undefined,
    );

    return data;
  }

  validate(
    data: Pick<
      TelemetryPayload,
      "userAgent" | "language" | "platform" | "timezoneOffsetMinutes"
    >,
  ): boolean {
    return this.validateDataStructure(data, ["userAgent", "language"]);
  }
}
