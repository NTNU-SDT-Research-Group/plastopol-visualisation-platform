import { PostProcessedData, TS_ORIGIN } from "@/lib/utils";
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
  // fp64: false,
  countItems: true,
});

export function renderLayers(props: {
  data?: any;
  settings: Settings;
  filterValue: [number, number];
}) {
  const { data, settings, filterValue } = props;

  if (!data) {
    return [];
  }

  console.log(filterValue);

  return [
    new HeatmapLayer({
      data,
      id: "heatmp-layer",
      pickable: false,
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => parseFloat(d.total),
      colorRange: [
        [254, 235, 226],
        [252, 197, 192],
        [250, 159, 181],
        [247, 104, 161],
        [197, 27, 138],
        [122, 1, 119],
      ],
      radiusPixels: 30,
      intensity: 1.8,
      threshold: 0.3,
      aggregation: "SUM",
      // extensions: [dataFilter],
      // getFilterValue: (d: PostProcessedData) => {
      //   const value = d.start_date - TS_ORIGIN;
      //   // console.log(
      //   //   [
      //   //     (filterValue[0] - TS_ORIGIN) / 1000000,
      //   //     (filterValue[1] - TS_ORIGIN) / 1000000,
      //   //   ],
      //   //   value / 1000000
      //   // );
      //   // if (
      //   //   value < filterValue[0] - TS_ORIGIN ||
      //   //   value > filterValue[1] - TS_ORIGIN
      //   // ) {
      //   //   console.log("filtering");
      //   // }

      //   return value;
      // },
      // filterRange: [filterValue[0] - TS_ORIGIN, filterValue[1] - TS_ORIGIN],
      // filterSoftRange: [
      //   filterValue[0] * 0.9 + filterValue[1] * 0.1,
      //   filterValue[0] * 0.1 + filterValue[1] * 0.9,
      // ],
      // onFilteredItemsChange: ({ count }: { count: number }) => {
      //   console.log(`Filtered ${count} items`);
      // },
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
