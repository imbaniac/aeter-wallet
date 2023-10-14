import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  permissions: ["scripting", "storage"],
  background: {
    service_worker: "src/background.ts",
    type: "module"
  },
  options_ui: {
    page: "src/options/index.html"
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/content_script/index.ts"],
      run_at: "document_start",
      all_frames: true
    }
  ],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self'; frame-ancestors 'none';"
  },
  web_accessible_resources: [
    {
      matches: ["<all_urls>"],
      resources: ["src/inpage.ts"]
    }
  ]
};

export default manifest;
