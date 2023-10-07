import { LayerProps } from "react-map-gl";
import { PostProcessedData, TS_ORIGIN } from "@/lib/utils";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { DataFilterExtension } from "@deck.gl/extensions/typed";

export type Settings = {
  showBuildings: boolean;
};

const dataFilter = new DataFilterExtension({
  filterSize: 1,
});

export function renderLayers(props: {
  data?: any;
  settings: Settings;
  filterValue: [number, number] | null;
}) {
  const { data, settings, filterValue } = props;

  if (!data || !filterValue) {
    return [];
  }

  const filterMin = filterValue[0] - TS_ORIGIN;
  const filterMax = filterValue[1] - TS_ORIGIN;

  return [
    new ScatterplotLayer({
      data,
      id: "accumulation",
      radiusScale: 0.01,
      radiusMinPixels: 1,
      wrapLongitude: true,
      opacity: 0.4,
      pickable: true,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: (d) => parseFloat(d.total),
      getFillColor: (d) => [122, 1, 119],
      extensions: [dataFilter],
      getFilterValue: (d: PostProcessedData) => d.start_date - TS_ORIGIN,
      filterRange: [filterMin, filterMax], // filter should never be [infinity, -infinity]
      filterSoftRange: [
        filterMin * 0.9 + filterMax * 0.1,
        filterMin * 0.1 + filterMax * 0.9,
      ],
    }),
  ];
}

// react-map-gl layer settings
export const baseMap3DBuildings: LayerProps = {
  id: "add-3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  type: "fill-extrusion",
  minzoom: 15,
  paint: {
    "fill-extrusion-color": "#aaa",

    // Use an 'interpolate' expression to
    // add a smooth transition effect to
    // the buildings as the user zooms in.
    "fill-extrusion-height": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "height"],
    ],
    "fill-extrusion-base": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "min_height"],
    ],
    "fill-extrusion-opacity": 0.6,
  },
};
