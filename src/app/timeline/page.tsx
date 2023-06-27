"use client";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
// import { TerrainLayer } from "@deck.gl/geo-layers/typed";
import { useState } from "react";
import { Layer as BaseMapLayer } from "react-map-gl";

type Settings = {
  showBuildings: boolean;
};

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 6.235565304359617,
  latitude: 62.47221575347621,
  zoom: 14,
  pitch: 45,
  bearing: -17.6,
};

const baseMap3DBuildings = {
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

const TERRAIN_IMAGE = `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
const SURFACE_IMAGE = `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000,
};

function renderLayers(props: { data?: any; settings: Settings }) {
  const { data, settings } = props;
  return [
    // new TerrainLayer({
    //   id: "terrain",
    //   minZoom: 0,
    //   strategy: "no-overlap",
    //   elevationDecoder: ELEVATION_DECODER,
    //   elevationData: TERRAIN_IMAGE,
    //   texture: SURFACE_IMAGE,
    //   wireframe: false,
    //   color: [255, 255, 255],
    //   operation: "terrain+draw",
    // }),
  ];
}

export default function Timeline() {
  const [settings, setSettings] = useState<Settings>({
    showBuildings: true,
  });

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={renderLayers({ settings })}
    >
      <Map
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <BaseMapLayer {...baseMap3DBuildings} />
      </Map>
    </DeckGL>
  );
}
