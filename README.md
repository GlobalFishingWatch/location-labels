# location-labels
Location labels data used to generate pm tiles layer

## Input datasets
`ne_10m_admin_[0-1]` (source: [www.naturalearthdata.com](https://www.naturalearthdata.com))

`seas.geojson` (source: [www.marineregions.org/](https://www.marineregions.org/))

## How to use

Install [tippecanoe](https://github.com/mapbox/tippecanoe)
```bash
brew install tippecanoe
```

Install NPM dependencies
```bash
npm install
```

Execute
```bash
npm start
```

This will generate an `locations.pmtiles` file in the `/output` folder
