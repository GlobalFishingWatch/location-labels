import { convertShapefile } from "./convert-shapefile.js";
import { scaleLog, scaleLinear } from "d3";
import {
  MIN_POPULATIONRANK_COUNTRY,
  MAX_POPULATIONRANK_COUNTRY,
} from "./config.js";

const countryPopulationRankScale = scaleLog()
  .domain([100000, 1000000000]) // Population
  .range([MIN_POPULATIONRANK_COUNTRY, MAX_POPULATIONRANK_COUNTRY])
  .clamp(true);

const countryPopulationSizeScale = scaleLinear()
  .domain([10000, 1000000, 100000000]) // Population rank
  .range([14, 16, 18]) // Size
  .clamp(true);

export async function processAdmin0() {
  const countries = await convertShapefile(
    "./input/ne_10m_admin_0_countries/ne_10m_admin_0_countries"
  );

  // console.log('processCountries:', countries.features[0].properties)
  // console.log(countries.features.length,countries.features.filter(country => country.properties.POP_EST).length);

  return countries.features.flatMap((country) => {
    if (country.properties.POP_EST <= 1000 || country.properties.TYPE === 'Lease') {
      return [];
    }

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [country.properties.LABEL_X, country.properties.LABEL_Y],
      },
      tippecanoe: {
        minzoom: 0,
        maxzoom: Math.ceil(country.properties.MAX_LABEL),
      },
      properties: {
        type: "country",
        populationRank: Math.round(
          countryPopulationRankScale(country.properties.POP_EST || 0)
        ),
        size: countryPopulationSizeScale(country.properties.POP_EST || 0),
        name: country.properties.NAME_LONG || country.properties.NAME_EN,
        name_es: country.properties.NAME_ES,
        name_fr: country.properties.NAME_FR,
        name_id: country.properties.NAME_ID,
        name_pt: country.properties.NAME_PT,
        name_zh: country.properties.NAME_ZH,
      },
    };
  });
}
