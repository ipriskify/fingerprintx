import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload } from "../../types";
import { WINDOWS_FONTS } from "../../constants";

const MacOSFonts = {
  "10.9": ["Helvetica Neue", "Geneva"],
  "10.10": ["Kohinoor Devanagari Medium", "Luminari"],
  "10.11": ["PingFang HK Light"],
  "10.12": [
    "American Typewriter Semibold",
    "Futura Bold",
    "SignPainter-HouseScript Semibold",
  ],
  "10.13-10.14": ["InaiMathi Bold"],
  "10.15-11": ["Galvji", "MuktaMahee Regular"],
  "12": [
    "Noto Sans Gunjala Gondi Regular",
    "Noto Sans Masaram Gondi Regular",
    "Noto Serif Yezidi Regular",
  ],
  "13": [
    "Apple SD Gothic Neo ExtraBold",
    "STIX Two Math Regular",
    "STIX Two Text Regular",
    "Noto Sans Canadian Aboriginal Regular",
  ],
} as const;

const DesktopAppFonts = {
  "Microsoft Outlook": ["MS Outlook"],
  "Adobe Acrobat": ["ZWAdobeF"],
  LibreOffice: ["Amiri", "KACSTOffice", "Liberation Mono", "Source Code Pro"],
  OpenOffice: ["DejaVu Sans", "Gentium Book Basic", "OpenSymbol"],
} as const;

const LINUX_FONTS = [
  "Arimo",
  "Chilanka",
  "Cousine",
  "Jomolhari",
  "MONO",
  "Noto Color Emoji",
  "Ubuntu",
] as const;

const ANDROID_FONTS = ["Dancing Script", "Droid Sans Mono", "Roboto"] as const;

export class FontFingerprintCollector extends BaseCollector<
  Pick<TelemetryPayload, "installedFonts">
> {
  private fontList: string[];

  constructor() {
    super({
      id: COLLECTOR_IDS.FONT_FINGERPRINT,
      category: CollectorCategory.FINGERPRINTING,
      priority: CollectorPriority.MEDIUM,
    });

    const appleFlat = Object.values(MacOSFonts).flat();
    const windowsFlat = Object.values(WINDOWS_FONTS).flat();
    const desktopFlat = Object.values(DesktopAppFonts).flat();

    this.fontList = [
      ...appleFlat,
      ...windowsFlat,
      ...LINUX_FONTS,
      ...ANDROID_FONTS,
      ...desktopFlat,
    ].sort();
  }

  isSupported(): boolean {
    return (
      typeof document !== "undefined" &&
      typeof document.fonts !== "undefined" &&
      typeof document.fonts.check !== "undefined" &&
      typeof window !== "undefined" &&
      typeof (window as any).FontFace !== "undefined"
    );
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "installedFonts">
  > {
    try {
      const installedFonts = await this.getInstalledFontsUsingFontFace(
        this.fontList,
      );
      return { installedFonts };
    } catch (error) {
      return { installedFonts: ["font_detection_error"] };
    }
  }

  private generateRandomCssSafeString(length: number = 12): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "rand";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async getInstalledFontsUsingFontFace(
    fontList: string[],
  ): Promise<string[]> {
    if (!document.fonts || !document.fonts.check || !(window as any).FontFace) {
      return ["font_api_unavailable"];
    }

    let fontsChecked: string[] = [];
    const randomFontName = this.generateRandomCssSafeString();

    if (!document.fonts.check(`12px "${randomFontName}"`)) {
      fontsChecked = fontList.reduce((acc, font) => {
        try {
          if (document.fonts.check(`12px "${font}"`)) {
            acc.push(font);
          }
        } catch (e) {}
        return acc;
      }, [] as string[]);
    }

    const fontFaceList = fontList
      .map((font) => {
        try {
          return new (window as any).FontFace(font, `local("${font}")`);
        } catch (e) {
          return null;
        }
      })
      .filter((f) => f !== null);

    const responseCollection = await Promise.allSettled(
      fontFaceList.map((font) => font.load().catch(() => null)),
    );

    const fontsLoaded = responseCollection.reduce((acc, fontResult) => {
      if (
        fontResult.status === "fulfilled" &&
        fontResult.value &&
        fontResult.value.family
      ) {
        acc.push(fontResult.value.family);
      }
      return acc;
    }, [] as string[]);

    const combined = Array.from(
      new Set([...fontsChecked, ...fontsLoaded]),
    ).sort();

    return combined.length > 0 ? combined : ["no_custom_fonts_detected"];
  }

  validate(data: Pick<TelemetryPayload, "installedFonts">): boolean {
    return Boolean(data.installedFonts && Array.isArray(data.installedFonts));
  }
}
