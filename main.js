import fs from "fs";
import { scaleLinear, scaleLog } from "d3";

const MIN_POPULATIONRANK = -1000;
const MAX_POPULATIONRANK = 1000;
const MAX_POPULATIONRANK_CITY = 500;
const MAX_ZOOM = 20;

function _getSize(rank) {
  if(rank < -800) {
    return 12
  } else if (rank < -600) {
    return 12.5
  } else if (rank < -400) {
    return 13
  } else if (rank < -200) {
    return 13.5
  } else if (rank < 0) {
    return 14
  } else if (rank < 200) {
    return 14.5
  } else if (rank < 400) {
    return 15
  }
  return 15
}
const charSet = new Set();

try {
  const countries = fs.readFileSync("./input/countries.geojson", "utf8");
  const geonames = fs.readFileSync("./input/geonames.geojson", "utf8");
  const countriesJson = JSON.parse(countries);
  const geonamesJson = JSON.parse(geonames);
  const allFeatures = [...countriesJson.features, ...geonamesJson.features];

  const zoomScale = scaleLinear()
    .domain([1000, 20000, 500000, 3000000]) // Population range
    .range([10, 8, 3, 1])
    .clamp(true);
  
  const countryPopulationRankScale = scaleLog()
    .domain([500000, 200000000]) // Population range
    .range([MAX_POPULATIONRANK_CITY, MAX_POPULATIONRANK])
    .clamp(true);

  const cityPopulationRankScale = scaleLog()
    .domain([5000, 100000000]) // Population range
    .range([MIN_POPULATIONRANK, MAX_POPULATIONRANK_CITY])
    .clamp(true);

  const features = allFeatures.flatMap((feature) => {
    const population = feature.properties.population || 0;
    
    if(population < 500) {
      return []
    }
    
    const isCountry = feature.properties.SCALERANK === -1;
    
    if (isCountry) {
      const { NAME_EN, NAME_ES, NAME_FR, NAME_PT, NAME_ID, NAME_ZH } = feature.properties;
      for (const char of [NAME_EN, NAME_ES, NAME_FR, NAME_PT, NAME_ID, NAME_ZH].join("")) {
        charSet.add(char);
      }
      return {
        ...feature,
        tippecanoe: {
          minzoom: 0,
          maxzoom: 5,
        },
        properties: {
          populationRank: Math.round(countryPopulationRankScale(population)),
          size: 16,
          name: NAME_EN,
          name_es: NAME_ES,
          name_fr: NAME_FR,
          name_pt: NAME_PT,
          name_id: NAME_ID,
          name_zh: NAME_ZH,
        },
      };
    }

    const { name } = feature.properties;
    for (const char of name) {
      charSet.add(char);
    }
    
    const populationRank = Math.round(cityPopulationRankScale(population));
    return {
      ...feature,
      tippecanoe: {
        minzoom: Math.round(zoomScale(population)),
        maxzoom: MAX_ZOOM,
      },
      properties: {
        size: _getSize(populationRank),
        populationRank,
        name,
      },
    };

  });

  console.log('CHARSET:');
  console.log(Array.from(charSet).sort().join(""));
  
  fs.writeFileSync(
    "./output/geonames_with_scalerank.geojson",
    JSON.stringify({type: "FeatureCollection", features}, null, 2)
  );
} catch (error) {
  console.error("Error processing tiles:", error);
}
