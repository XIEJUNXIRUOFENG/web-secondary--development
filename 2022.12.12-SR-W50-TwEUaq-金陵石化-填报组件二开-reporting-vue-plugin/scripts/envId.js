const fs = require("fs");
const path = require("path");

let configJson = require("../pluginTemp/config.json");


let customPluginId = configJson.id;
fs.writeFileSync(
  path.resolve(__dirname, "../pluginTemp/config.json"),
  JSON.stringify(configJson, null, 2),
  "utf8"
);

fs.writeFileSync(
  path.resolve(__dirname, "../.env"),
  `VUE_APP_CUSTOM_PLUGIN_ID=${customPluginId}`,
  "utf8"
);
