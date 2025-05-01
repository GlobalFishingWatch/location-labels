import fs from "fs";
import { MAX_ZOOM } from "./config.js";

export async function processSeas() {

  
  const seasFile = fs.readFileSync("./input/seas.geojson", "utf8");
  const seasJson = JSON.parse(seasFile);
  
  return seasJson.features.map((feature) => {
    return {
      ...feature,
      tippecanoe: {
        minzoom: 0,
        maxzoom: MAX_ZOOM,
      },
      properties: {
        type: "sea",
        size: feature.properties.NAME.includes("Ocean") ? 16 : 13,
        name: feature.properties.NAME,
        name_es: feature.properties.NAME_ES,
        name_fr: feature.properties.NAME_FR,
        name_pt: feature.properties.NAME_PT,
        name_id: feature.properties.NAME_ID,
        name_zh: feature.properties.NAME_ZH,
      },
    };
  });
}