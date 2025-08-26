<p align="center">
  <a href="https://ipriskify.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="assets/logo_dark.svg" />
      <source media="(prefers-color-scheme: light)" srcset="assets/logo_light.svg" />
      <img src="assets/logo_dark.svg" alt="IPRiskify logo" width="312px" />
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@ipriskify/fingerprintx"><img src="https://img.shields.io/npm/v/@ipriskify/fingerprintx.svg" alt="Current NPM version"></a>
  <a href="https://www.npmjs.com/package/@ipriskify/fingerprintx"><img src="https://img.shields.io/npm/dm/@ipriskify/fingerprintx.svg" alt="Monthly downloads from NPM"></a>
  <a href="https://www.jsdelivr.com/package/npm/@ipriskify/fingerprintx"><img src="https://img.shields.io/jsdelivr/npm/hm/@ipriskify/fingerprintx.svg" alt="Monthly downloads from jsDelivr"></a>
</p>
<p align="center">
  <a href="https://discord.gg/zwjwEA7hv7">
    <img src="https://img.shields.io/discord/1406934513866768445?style=for-the-badge&label=Discord&logo=Discord&logoColor=white&color=5865F2" alt="Discord server">
  </a>
</p>
</p>

FingerprintX is an open source, client side, fingerprinting library for IPRiskify. It uses browser fingerprinting to build a persistent browser fingerprint on the visitor.

✅ Incognito Mode Detection <br>
✅ IOS and Android Stable  <br>
✅ Basic Bot Detection <br>


## Demo

We have a demo which allows you to see the library in action, visit https://demo.ipriskify.com to see your browser fingerprint and stats.

## Usage

### Basic Usage

Include the FingerprintX library in your HTML and initialize it:

```js
const ipRiskify = import('https://cdn.jsdelivr.net/npm/@ipriskify/fingerprintx/dist/ipriskify.min.js')
    .then(IPRiskify => IPRiskify.load())

  ipRiskify
    .then(fp => fp.get())
    .then(result => {
      const analysis = result.analysis;
      console.log('Fingerprint result:', result)

    })
  
```


### Fingerprint Analysis

FingerprintX provides a simple analysis of the fingerprint to make it easy to understand the browser. This includes bot detection, incognito mode detection, browser details and a unique visitor ID. This is stored in the `analysis` property of the result.


```json
{
	"fingerprint":"6e0ae...c55", // Unique Fingerprint, persistent across sessions
	"browser": {
		"name": "Brave",
		"major_version": "138",
		"full_version": "138.0.0",
		"os": "Mac OS X",
		"os_version": "10.15.7",
		"device": "Other",
		"user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
	},
	"incognito": true,
	"bot_detected": true,
}
```

### Fingerprint Raw

Some users may want to see the full raw fingerprint data collected by FingerprintX. Below is an example of the full raw data collected. The raw fingerprint is stored in the `fingerprint` property of the result.

> [!NOTE]
> This is an example fingerprint, your fingerprint will be different based on your browser and device.

  
```json
{
    "storedWebsiteData": [],
    "indexedDbKeys": [],
    "endiannessByte": 127,
    "incognitoDetected": false,
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "language": "en-US",
    "platform": "MacIntel",
    "timezoneOffsetMinutes": 240,
    "browserCapabilityInfo": {
        "hasSessionStorage": 1,
        "hasLocalStorage": 1,
        "hasIndexedDB": 1,
        "cookiesEnabled": true,
        "javaEnabled": false,
        "hasWebkitRequestFileSystem": true,
        "hasOpenDatabase": false,
        "hasPromiseAllSettled": true,
        "hasMsSaveBlob": false
    },
    "screenInfo": {
        "dimensionsObj": {
            "width": 1440,
            "height": 900
        },
        "availDimensionsObj": {
            "width": 1440,
            "height": 900
        },
        "colorDepth": 30,
        "devicePixelRatio": 2,
        "screenDpi": 96
    },
    "webglInfo": {
        "maxViewportDimsObj": {
            "width": 16384,
            "height": 16384
        },
        "maxTextureSize": 16384,
        "maxTextureImageUnits": 16,
        "maxFragmentUniformVectors": 1024,
        "maxVaryingVectors": 30,
        "aliasedPointSizeRangeArr": {
            "values": [
                1,
                511
            ]
        },
        "aliasedLineWidthRangeArr": {
            "values": [
                1,
                1
            ]
        },
        "unmaskedRenderer": "ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Max, Unspecified Version)",
        "fingerprint": "9bd6ce42d844968e4a5a89d4b2e9e9d9cfce263b6b23ada80ccd4c0df84d14b8",
        "webgl2Supported": true
    },
    "automationInfo": {
        "automationToolDetected": false,
        "webdriverChecks": [
            false,
        ]
    },
    "jsErrorSignature": "c",
    "browserEngineSignature": "brave",
    "audioFingerprint": "a94b988df773e851a8a0835f3c4dcbc56541a8f0e61b4330cc3e217fd4be0f03",
    "mediaDevicesInfo": {
        "devices": [
            {
                "id": "",
                "kind": "audioinput",
                "hasLabel": false
            },
            {
                "id": "",
                "kind": "videoinput",
                "hasLabel": false
            },
            {
                "id": "",
                "kind": "audiooutput",
                "hasLabel": false
            }
        ],
        "microphoneAccess": "unlabeled",
        "webcamAccess": "unlabeled",
        "speakerAccess": "present"
    },
    "documentCookie": "",
    "speechApiFingerprint": 2,
    "speechVoices": [
        {
            "name": "Samantha",
            "lang": "en-US",
            "default": true,
            "localService": true,
            "voiceURI": "Samantha"
        },
        ...
    ],
    "batteryStatusIssue": false,
    "canvasImageDataBenchmark": 16.9,
    "fingerprint": "6e0ae...c55"
}
```

## IPRiskify Pro

The open source library is limited with the production library using over 200+ signals to build an incredibly accurate and detailed browser profile. If you plan to use Fingerprint in your application we highly recommend using the Pro version, with it supporting more features and providing additional security.

We also have a free tier which allows for 10,000 lookups per month.

| Provider          | Data Points Collected | Bot Detection | Accuracy | VPN / Residential Proxy Detection | Dashboard | Obfuscation | Integrity Verification | Pricing           |
| ----------------- | --------------------- | ------------- | -------- | --------------------------------- | --------- | ----------- | ---------------------- | ----------------- |
| IPRIskify Pro     | ~250                  | ✅             | ~99%     | ✅                                 | ✅         | ✅           | ✅                      | $.001 Per Request |
| IPRiskify Free    | ~75                   | ✅             | ~83%     | ❌                                 | ❌         | ❌           | ❌                      | Free              |
| FingerprintJS Pro | ~200                  | ✅             | ~99%     | ✅                                 | ✅         | ❌           | ❌                      | $.01 Per Request  |
| FingerprintJS     | ~                     | ❌             | ~50%     | ❌                                 | ❌         | ❌           | ❌                      | Free              |
| CreepJS           | ~50                   | ✅             | ~30%     | ❌                                 | ✅         | ❌           | ❌                      | Free              |
| ThumbarkJS        | ~20                   | ❌             | ~25%     | ❌                                 | ❌         | ❌           | ❌                      | Free              |

## Telemetry

FingerprintX collects telemetry by default to improve performance and accuracy. If you do not want to send telemetry you can disable it by passing `telemetry=false` when loading the library. Please note that this will disable telemetry but may also reduce accuracy.

```html
<script src="https://cdn.jsdelivr.net/npm/@ipriskify/fingerprintx@1.0.0/dist/ipriskify.min.js"></script>
<script>
  // Load IPRiskify with telemetry disabled
  const fpPromise = IPRiskify.load({ telemetry: false });
  
  fpPromise
    .then(fp => fp.get())
    .then(result => {
      console.log('Fingerprint result:', result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
</script>
```

## Support

If you need help, please visit our [Discord server](https://discord.gg/zwjwEA7hv7) or open an issue on GitHub.

## Contributing

If you would like to contribute to the project please read our [contributing guidelines](CONTRIBUTING.MD) first.