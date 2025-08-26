import { TextEncoderImplementation } from "../polyfills";

export function fallbackSha256(message: string): string {
  var hash = 0;
  for (var i = 0; i < message.length; i++) {
    var char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function sha256Hex(message: string): Promise<string> {
  return new Promise<string>(function (resolve) {
    try {
      var encoder = new TextEncoderImplementation();
      var msgBuffer = encoder.encode(message);
      var uint8MsgBuffer = new Uint8Array(Uint8Array.from(msgBuffer));
      crypto.subtle
        .digest("SHA-256", uint8MsgBuffer)
        .then(function (hashBuffer: ArrayBuffer) {
          var hashArray: number[] = [];
          var uint8View = new Uint8Array(hashBuffer);
          for (var i = 0; i < uint8View.length; i++) {
            hashArray.push(uint8View[i]);
          }
          resolve(
            hashArray
              .map(function (b: number) {
                return b.toString(16).padStart(2, "0");
              })
              .join(""),
          );
        })
        .catch(function () {
          resolve(fallbackSha256(message));
        });
    } catch (e) {
      resolve(fallbackSha256(message));
    }
  });
}

export function generateRandomHex(length: number): string {
  var arr = new Uint8Array(length / 2);
  try {
    crypto.getRandomValues(arr);
    var hexChars: string[] = [];
    for (var i = 0; i < arr.length; i++) {
      hexChars.push(arr[i].toString(16).padStart(2, "0"));
    }
    return hexChars.join("");
  } catch (e) {
    var result = "";
    var characters = "0123456789abcdef";
    for (var j = 0; j < length; j++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }
}
