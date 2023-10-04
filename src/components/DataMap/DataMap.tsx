"use client";

import DeckGL from "@deck.gl/react/typed";
import { useEffect, useMemo, useState } from "react";
import { Settings, baseMap3DBuildings, renderLayers } from "./layer";
import {
  PostProcessedData,
  TS_ORIGIN,
  getTimeRange,
  postProcess,
} from "@/lib/utils";
import { MapControls } from "./components/MapControls";
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

const BASE_URL = "http://129.241.152.251:8000";

export default function DataMap() {
  const [settings, setSettings] = useState<Settings>({
    showBuildings: true,
  });
  const [data, setData] = useState<PostProcessedData[]>([]);
  const [filter, setFilter] = useState<[number, number]>();
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date("2013-01-01T00:00:00.000Z")
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date("2021-01-01T00:00:00.000Z")
  );

  useEffect(() => {
    fetch(`${BASE_URL}/api/history?dateFrom=2013-01-01&dateTo=2021-01-01`)
      .then((res) => res.json())
      .then((resJson) => setData(postProcess(resJson.data)));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      setFilter([startDate.getTime(), endDate.getTime()]);
    }
  }, [startDate, endDate]);

  const filterValue = useMemo(
    () => filter || getTimeRange(data),
    [filter, data]
  );

  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={renderLayers({
          data,
          settings,
          filterValue: filterValue,
        })}
        width={"100%"}
      >
        <Map
          reuseMaps={true}
          styleDiffing={true}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <BaseMapLayer {...baseMap3DBuildings} />
        </Map>
      </DeckGL>

      <MapControls
        className="absolute top-4 right-4"
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </>
  );
}
