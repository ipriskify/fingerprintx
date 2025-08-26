import {
  WebGLInfo,
  WindowExtended,
  NavigatorExtended,
  DimensionsMessage,
  FloatArrayMessage,
  SpeechApiStatusId,
  SpeechVoiceInfo,
} from "../types";
import { sha256Hex } from "./crypto";
import { WEBDRIVER_KEYS } from "../constants";

export function getWebglFingerprintParams(
  gl: WebGLRenderingContext | WebGL2RenderingContext | null,
): { rendererInfo: string; paramsString: string; details: Partial<WebGLInfo> } {
  var data: {
    rendererInfo: string;
    paramsString: string;
    details: Partial<WebGLInfo>;
  } = { rendererInfo: "no_webgl", paramsString: "", details: {} };

  if (!gl) return data;

  var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  data.rendererInfo =
    debugInfo && gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string) ||
        "unknown_renderer"
      : "no_debug_info_renderer";

  var p: string[] = [];
  try {
    if (gl.canvas instanceof HTMLCanvasElement) {
      p.push(gl.canvas.toDataURL());
    }
  } catch (e) {}
  var extensions = gl.getSupportedExtensions();
  p.push("extensions:" + (extensions ? extensions.join(";") : ""));
  var aliasedLineWidthRange = gl.getParameter(
    gl.ALIASED_LINE_WIDTH_RANGE,
  ) as Float32Array | null;
  const aliasedLineWidthRangeArray = aliasedLineWidthRange
    ? Array.from(aliasedLineWidthRange)
    : [];
  p.push(
    "aliased_line_width_range:" +
      (aliasedLineWidthRangeArray.length > 0
        ? aliasedLineWidthRangeArray.join(",")
        : ""),
  );
  var aliasedPointSizeRange = gl.getParameter(
    gl.ALIASED_POINT_SIZE_RANGE,
  ) as Float32Array | null;
  const aliasedPointSizeRangeArray = aliasedPointSizeRange
    ? Array.from(aliasedPointSizeRange)
    : [];
  p.push(
    "aliased_point_size_range:" +
      (aliasedPointSizeRangeArray.length > 0
        ? aliasedPointSizeRangeArray.join(",")
        : ""),
  );
  p.push("alpha_bits:" + String(gl.getParameter(gl.ALPHA_BITS)));
  p.push("antialias:" + (gl.getContextAttributes()?.antialias ? "yes" : "no"));
  p.push("blue_bits:" + String(gl.getParameter(gl.BLUE_BITS)));
  p.push("depth_bits:" + String(gl.getParameter(gl.DEPTH_BITS)));
  p.push("green_bits:" + String(gl.getParameter(gl.GREEN_BITS)));
  p.push(
    "max_combined_texture_image_units:" +
      String(gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),
  );
  p.push(
    "max_cube_map_texture_size:" +
      String(gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)),
  );
  p.push(
    "max_fragment_uniform_vectors:" +
      String(gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS)),
  );
  p.push(
    "max_renderbuffer_size:" +
      String(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)),
  );
  p.push(
    "max_texture_image_units:" +
      String(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)),
  );
  p.push("max_texture_size:" + String(gl.getParameter(gl.MAX_TEXTURE_SIZE)));
  p.push(
    "max_varying_vectors:" + String(gl.getParameter(gl.MAX_VARYING_VECTORS)),
  );
  p.push(
    "max_vertex_attribs:" + String(gl.getParameter(gl.MAX_VERTEX_ATTRIBS)),
  );
  p.push(
    "max_vertex_texture_image_units:" +
      String(gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)),
  );
  p.push(
    "max_vertex_uniform_vectors:" +
      String(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)),
  );
  var maxViewportDims = gl.getParameter(
    gl.MAX_VIEWPORT_DIMS,
  ) as Int32Array | null;
  const maxViewportDimsArray = maxViewportDims
    ? Array.from(maxViewportDims)
    : [];
  p.push(
    "max_viewport_dims:" +
      (maxViewportDimsArray.length > 0 ? maxViewportDimsArray.join(",") : ""),
  );
  p.push("red_bits:" + String(gl.getParameter(gl.RED_BITS)));
  p.push("renderer:" + String(gl.getParameter(gl.RENDERER)));
  p.push(
    "shading_language_version:" +
      String(gl.getParameter(gl.SHADING_LANGUAGE_VERSION)),
  );
  p.push("stencil_bits:" + String(gl.getParameter(gl.STENCIL_BITS)));
  p.push("vendor:" + String(gl.getParameter(gl.VENDOR)));
  p.push("version:" + String(gl.getParameter(gl.VERSION)));
  if (debugInfo) {
    p.push(
      "unmasked_vendor:" +
        String(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)),
    );
    p.push(
      "unmasked_renderer:" +
        String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)),
    );
  }
  data.paramsString = p.join("~");

  data.details.maxViewportDimsObj =
    maxViewportDimsArray.length === 2
      ? { width: maxViewportDimsArray[0], height: maxViewportDimsArray[1] }
      : { width: 0, height: 0 };

  data.details.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
  data.details.maxTextureImageUnits = gl.getParameter(
    gl.MAX_TEXTURE_IMAGE_UNITS,
  ) as number;
  data.details.maxFragmentUniformVectors = gl.getParameter(
    gl.MAX_FRAGMENT_UNIFORM_VECTORS,
  ) as number;
  data.details.maxVaryingVectors = gl.getParameter(
    gl.MAX_VARYING_VECTORS,
  ) as number;

  data.details.aliasedPointSizeRangeArr = {
    values: aliasedPointSizeRangeArray,
  };
  data.details.aliasedLineWidthRangeArr = {
    values: aliasedLineWidthRangeArray,
  };

  data.details.unmaskedRenderer = data.rendererInfo;
  return data;
}

export function getAudioContextFingerprintData(): string {
  try {
    var AppWindow = window as WindowExtended;
    var AC = AppWindow.AudioContext || AppWindow.webkitAudioContext;
    if (!AC) return "no_ac";
    var context = new AC();
    var oscillator = context.createOscillator();
    var analyser = context.createAnalyser();
    var gain = context.createGain();
    var scriptProcessor = context.createScriptProcessor(4096, 1, 1);
    gain.gain.value = 0;
    oscillator.type = "triangle";
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gain);
    gain.connect(context.destination);
    var props = [
      context.sampleRate,
      context.destination.channelCount,
      context.destination.maxChannelCount,
      analyser.fftSize,
      analyser.frequencyBinCount,
    ].join(",");
    oscillator.start(0);
    if (context.state !== "closed") {
      context.close().catch(function () {});
    }
    return props;
  } catch (e) {
    return "ac_err";
  }
}

export const webdriver_keys = WEBDRIVER_KEYS;

export function getWebdriverChecks(): boolean[] {
  const checks: boolean[] = [];
  const winExt = window as WindowExtended;
  const navExt = navigator as NavigatorExtended;
  checks.push(!!navExt.webdriver);
  WEBDRIVER_KEYS.forEach((key: string) => {
    if (key in winExt) {
      checks.push(true);
    } else {
      checks.push(false);
    }
  });
  return checks;
}

export function getArchitecture(): number {
  try {
    const f = new Float32Array(1);
    const u8 = new Uint8Array(f.buffer);
    f[0] = Infinity;
    f[0] = f[0] - f[0];
    return u8[3];
  } catch (e) {
    return -1;
  }
}

export function getClientRectsFingerprint(): number {
  try {
    const div = document.createElement("div");
    div.style.cssText =
      "width:123.45px; height:67.89px; position:fixed; top:10.1px; left:20.2px; border: 5px solid rgb(20, 40, 60); padding: 2.5px; margin: 1.5px; opacity: 0.87;";
    document.body.appendChild(div);
    const rect = div.getBoundingClientRect();
    document.body.removeChild(div);
    let fingerprint = 0;
    fingerprint += Math.round(rect.width * 100);
    fingerprint += Math.round(rect.height * 100) * 1000;
    fingerprint += Math.round(rect.top * 100) * 100000;
    fingerprint += Math.round(rect.left * 100) * 10000000;
    fingerprint += Math.round(rect.x * 100) * 1000000000;
    fingerprint += Math.round(rect.y * 100) * 100000000000;
    return fingerprint;
  } catch (e) {
    return 0;
  }
}

export function getSpeechSynthesisFingerprint(): SpeechApiStatusId {
  try {
    const win = window as WindowExtended;
    if (
      !win.speechSynthesis ||
      typeof win.speechSynthesis.getVoices !== "function"
    ) {
      return SpeechApiStatusId.SPEECH_API_STATUS_NOT_AVAILABLE;
    }
    if (typeof win.SpeechSynthesisUtterance !== "function") {
      return SpeechApiStatusId.SPEECH_API_STATUS_UTTERANCE_MISSING;
    }
    return SpeechApiStatusId.SPEECH_API_STATUS_AVAILABLE;
  } catch (e) {
    return SpeechApiStatusId.SPEECH_API_STATUS_ERROR;
  }
}

export async function getSpeechSynthesisVoices(): Promise<SpeechVoiceInfo[]> {
  try {
    const win = window as WindowExtended;
    if (
      !win.speechSynthesis ||
      typeof win.speechSynthesis.getVoices !== "function"
    ) {
      return [];
    }

    // Get voices immediately
    let voices = win.speechSynthesis.getVoices();

    // If no voices are returned, wait for the voiceschanged event
    if (voices.length === 0) {
      voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
        let timeoutId: number;
        let resolved = false;

        const cleanup = () => {
          if (timeoutId) clearTimeout(timeoutId);
          if (!resolved) {
            win.speechSynthesis.removeEventListener(
              "voiceschanged",
              onVoicesChanged,
            );
          }
          resolved = true;
        };

        const onVoicesChanged = () => {
          cleanup();
          resolve(win.speechSynthesis.getVoices());
        };

        // Set up timeout - give it more time to load voices
        timeoutId = setTimeout(() => {
          cleanup();
          resolve(win.speechSynthesis.getVoices());
        }, 1000) as any; // 1 second timeout

        win.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);

        // Also try to trigger voice loading by speaking something silently
        if (typeof win.SpeechSynthesisUtterance === "function") {
          try {
            const utterance = new win.SpeechSynthesisUtterance("");
            utterance.volume = 0;
            win.speechSynthesis.speak(utterance);
            win.speechSynthesis.cancel(); // Cancel immediately
          } catch (e) {
            // Ignore errors from this attempt
          }
        }
      });
    }

    return voices.map(
      (voice: SpeechSynthesisVoice): SpeechVoiceInfo => ({
        name: voice.name,
        lang: voice.lang,
        default: voice.default,
        localService: voice.localService,
        voiceURI: voice.voiceURI,
      }),
    );
  } catch (e) {
    return [];
  }
}

export function getFullscreenPropertiesFingerprint(): number {
  try {
    const docElement = document.documentElement as any;
    const doc = document as any;
    let score = 0;
    if (docElement.requestFullscreen) score += 1;
    if (docElement.webkitRequestFullscreen) score += 2;
    if (docElement.mozRequestFullScreen) score += 4;
    if (docElement.msRequestFullscreen) score += 8;

    if (doc.exitFullscreen) score += 16;
    if (doc.webkitExitFullscreen) score += 32;
    if (doc.mozCancelFullScreen) score += 64;
    if (doc.msExitFullscreen) score += 128;

    if (doc.fullscreenElement) score += 256;
    if (doc.webkitFullscreenElement) score += 512;
    if (doc.mozFullScreenElement) score += 1024;
    if (doc.msFullscreenElement) score += 2048;

    if (doc.fullscreenEnabled) score += 4096;
    if (doc.webkitFullscreenEnabled) score += 8192;
    if (doc.mozFullScreenEnabled) score += 16384;
    if (doc.msFullscreenEnabled) score += 32768;

    return score;
  } catch (e) {
    return -1;
  }
}

export function getJsMathEngineFingerprint(): number {
  try {
    let result = 0;
    result += Math.acos(0.12345678912345678);
    result += Math.asin(0.98765432198765432);
    result += Math.atan(12345.6789);
    result += Math.exp(1.2345);
    result += Math.log(987.654);
    result += Math.pow(1.23, 4.56);
    result += Math.sqrt(12345.6789);
    result += Math.cos(0.123456789);
    result += Math.sin(0.987654321);
    result += Math.tan(12.345);
    return Math.round(result * 1e12);
  } catch (e) {
    return 0;
  }
}

export function getEvalToStringLengthFingerprint(): number {
  try {
    return eval.toString().length;
  } catch (e) {
    return -1;
  }
}
