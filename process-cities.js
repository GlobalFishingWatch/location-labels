import fs from "fs";
import { scaleLinear, scaleLog } from "d3";
import {
  MIN_POPULATIONRANK,
  MAX_POPULATIONRANK_CITY,
  MAX_ZOOM,
} from "./config.js";


export async function processCities() {
  const citiesFile = fs.readFileSync("./input/geonames.geojson", "utf8");
  const citiesJson = JSON.parse(citiesFile);

  const zoomScale = scaleLinear()
    .domain([1000, 20000, 500000, 3000000]) // Population range
    .range([10, 8, 5, 2])
    .clamp(true);

  const cityPopulationRankScale = scaleLog()
    .domain([5000, 10000000]) // Population range
    .range([MIN_POPULATIONRANK, MAX_POPULATIONRANK_CITY])
    .clamp(true);

  const cityPopulationSizeScale = scaleLinear()
    .domain([5000, 500000, 5000000]) // Population rank
    .range([12, 14, 16]) // Size
    .clamp(true);

  return citiesJson.features.flatMap((feature) => {
    const population = feature.properties.population || 0;

    if (population < 500) {
      return [];
    }

    return {
      ...feature,
      tippecanoe: {
        minzoom: Math.round(zoomScale(population)),
        maxzoom: MAX_ZOOM,
      },
      properties: {
        type: "place",
        size: cityPopulationSizeScale(population),
        populationRank: Math.round(cityPopulationRankScale(population)),
        name: feature.properties.name,
      },
    };
  });
}
