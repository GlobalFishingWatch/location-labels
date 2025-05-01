import fs from "fs";
import { processAdmin0 } from "./process-admin0.js";
import { processAdmin1 } from "./process-admin1.js";
import { processCities } from "./process-cities.js";
import { processSeas } from "./process-seas.js";

try {
  const countries = await processAdmin0();
  const states = await processAdmin1();
  const cities = await processCities();
  const seas = await processSeas();
  
  const allFeatures = [...countries, ...states, ...cities, ...seas];
  
  const charSet = new Set();
  allFeatures.forEach((feature) => {
    const name = feature.properties.name || "";
    const name_es = feature.properties.name_es || "";
    const name_fr = feature.properties.name_fr || "";
    const name_pt = feature.properties.name_pt || "";
    const name_id = feature.properties.name_id || "";
    const name_zh = feature.properties.name_zh || "";
    const name_all = name + name_es + name_fr + name_pt + name_id + name_zh;
    name_all.split("").forEach((char) => {
      charSet.add(char);
    });
  });
  
  console.log("CHARSET:");
  console.log(Array.from(charSet).sort().join(""));

  fs.writeFileSync(
    "./output/geonames_with_scalerank.geojson",
    JSON.stringify({ type: "FeatureCollection", features: allFeatures }, null, 2)
  );
} catch (error) {
  console.error("Error processing tiles:", error);
}
