"use client";

import DeckGL from "@deck.gl/react/typed";
import { useMemo, useState } from "react";
import { Settings, baseMap3DBuildings, renderLayers } from "./layer";
import { getTimeRange } from "@/lib/utils";
import { DateRangePicker } from "./components/DateRange";
import { Map, Layer as BaseMapLayer } from "react-map-gl";

type Data = {
  timestamp: Date;
  latitude: number;
  longitude: number;
  depth: number;
  magnitude: number;
};

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 6.235565304359617,
  latitude: 62.47221575347621,
  zoom: 14,
  pitch: 45,
  bearing: -17.6,
};

const data: Data[] = [];

export default function DataMap() {
  const [settings, setSettings] = useState<Settings>({
    showBuildings: true,
  });

  const [filter, setFilter] = useState(null);

  const timeRange = useMemo(() => getTimeRange(data), [data]);
  const filterValue = filter || timeRange;

  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={renderLayers({ settings, filterValue })}
        width={"100%"}
      >
        <Map
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <BaseMapLayer {...baseMap3DBuildings} />
        </Map>
      </DeckGL>

      <DateRangePicker className="absolute top-4 right-4" />
    </>
  );
}
