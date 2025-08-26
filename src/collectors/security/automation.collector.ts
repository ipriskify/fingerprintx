import { BaseCollector, CollectorCategory, CollectorPriority } from "../base";
import {
  TelemetryPayload,
  AutomationInfo,
  WindowExtended,
  NavigatorExtended,
} from "../../types";
import { getWebdriverChecks } from "../../utils/browser";

export class AutomationDetectionCollector extends BaseCollector<
  Pick<TelemetryPayload, "automationInfo">
> {
  constructor() {
    super({
  id: "automation-detection",
      category: CollectorCategory.SECURITY,
      priority: CollectorPriority.HIGH,
      timeout: 2000,
    });
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && typeof navigator !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "automationInfo">
  > {
    const automationInfo: AutomationInfo = {};
    const winExt = window as WindowExtended;
    const navExt = navigator as NavigatorExtended;

    automationInfo.automationToolDetected = !!(
      (navExt as any).webdriver ||
      winExt._phantom ||
      winExt.callPhantom ||
      winExt.Buffer ||
      winExt.emit ||
      winExt.spawn ||
      (document.documentElement &&
        document.documentElement.getAttribute("webdriver")) ||
      winExt.cdc_adoQpoasnfa76pfcZLmcfl_Array ||
      winExt.cdc_adoQpoasnfa76pfcZLmcfl_Promise ||
      winExt.$cdc_asdjflasutopfhvcZLmcfl_Symbol
    );

    automationInfo.webdriverChecks = getWebdriverChecks();

    return { automationInfo };
  }

  validate(data: Pick<TelemetryPayload, "automationInfo">): boolean {
    return Boolean(
      data.automationInfo &&
        typeof data.automationInfo.automationToolDetected === "boolean",
    );
  }
}
