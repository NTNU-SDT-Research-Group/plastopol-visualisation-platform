import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";
import { DataFilterExtension } from "@deck.gl/extensions/typed";
import { LayerProps } from "react-map-gl";

export type Settings = {
  showBuildings: boolean;
};

const dataFilter = new DataFilterExtension({
  filterSize: 1,
  // Enable for higher precision, e.g. 1 second granularity
  // See DataFilterExtension documentation for how to pick precision
  fp64: false,
});

export function renderLayers(props: {
  data?: any;
  settings: Settings;
  filterValue: [number, number];
}) {
  const { data, settings, filterValue } = props;
  return [
    new HeatmapLayer({
      data,
      id: "heatmp-layer",
      pickable: false,
      getPosition: (d) => [d[0], d[1]],
      getWeight: (d) => d[2],
      radiusPixels: 30,
      intensity: 1,
      threshold: 0.3,
      getFilterValue: (d: any) => d.timestamp,
      filterRange: [filterValue[0], filterValue[1]],
      filterSoftRange: [
        filterValue[0] * 0.9 + filterValue[1] * 0.1,
        filterValue[0] * 0.1 + filterValue[1] * 0.9,
      ],
      extensions: [dataFilter],
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
