import { POPULATIONRANK_STATE } from "./config.js";
import { convertShapefile } from "./convert-shapefile.js";

export async function processAdmin1() {
  const states = await convertShapefile("./input/ne_10m_admin_1_states_provinces/ne_10m_admin_1_states_provinces");

  // console.log('process states:', states.features[0].properties)

  return states.features.map(state => {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [state.properties.longitude, state.properties.latitude]
        },
        tippecanoe: {
          minzoom: 2,
          maxzoom: Math.ceil(state.properties.max_label),
        },
        properties: {
          type: "state",
          populationRank: POPULATIONRANK_STATE,
          size: 12,
          name: state.properties.name.toUpperCase(),
        }
    }
  });
}