if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(
    targetLength: number,
    padString?: string,
  ): string {
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== "undefined" ? padString : " ");
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length);
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

var TextEncoderImplementationPolyfill: {
  new (): { encode(input?: string): Uint8Array };
};

class TextEncoderPolyfill {
  encode(str: string = ""): Uint8Array {
    var result: number[] = [];
    for (var i = 0; i < str.length; i++) {
      var charCode = str.charCodeAt(i);
      if (charCode < 0x80) {
        result.push(charCode);
      } else if (charCode < 0x800) {
        result.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
      } else if (charCode < 0xd800 || charCode >= 0xe000) {
        result.push(
          0xe0 | (charCode >> 12),
          0x80 | ((charCode >> 6) & 0x3f),
          0x80 | (charCode & 0x3f),
        );
      } else {
        charCode =
          0x10000 +
          (((charCode & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
        result.push(
          0xf0 | (charCode >> 18),
          0x80 | ((charCode >> 12) & 0x3f),
          0x80 | ((charCode >> 6) & 0x3f),
          0x80 | (charCode & 0x3f),
        );
      }
    }
    return new Uint8Array(result);
  }
}
TextEncoderImplementationPolyfill = TextEncoderPolyfill;

export var TextEncoderImplementation: {
  new (): { encode(input?: string): Uint8Array };
};

if (typeof TextEncoder === "undefined") {
  TextEncoderImplementation = TextEncoderImplementationPolyfill;
} else {
  TextEncoderImplementation = TextEncoder;
}
