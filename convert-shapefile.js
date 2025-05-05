import shapefile from "shapefile";

export async function convertShapefile(path) {
  return await shapefile
    .read(`${path}.shp`, `${path}.dbf`, {
      encoding: "utf8",
    })
    .then((result) => {
      return {
        type: "FeatureCollection",
        features: result.features.map((feature) => {
          return {
            ...feature,
            properties: {
              ...Object.fromEntries(
                Object.entries(feature.properties).map(([key, value]) => [
                  key,
                  typeof value === "string"
                    ? (value || "").replace(/\0/g, "")
                    : value,
                ])
              ),
            },
          };
        }),
      };
    })
    .catch((error) => console.error(error.stack));
}
