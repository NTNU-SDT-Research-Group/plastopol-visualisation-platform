"use client";

import DeckGL from "@deck.gl/react/typed";
import { PickingInfo } from "@deck.gl/core/typed";
import { useEffect, useMemo, useState } from "react";
import { Settings, baseMap3DBuildings, renderLayers } from "./layer";
import {
  PostProcessedData,
  formatDate,
  getTimeRange,
  postProcess,
} from "@/lib/utils";
import { MapControls } from "./components/MapControls";
import { Map, Layer as BaseMapLayer } from "react-map-gl";

function getTooltip({ object }: PickingInfo) {
  return (
    object &&
    `\
    Date: ${object.start_date};
    Personal Use Items: ${object.personal_use} Kgs;
    Fishery Items: ${object.fisheries} Kgs;
    Industrial Items: ${object.industrial} Kgs;
    Hygiene Items: ${object.hygiene} Kgs;
    `
  );
}

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 6.235565304359617,
  latitude: 62.47221575347621,
  zoom: 14,
  pitch: 45,
  bearing: -17.6,
};

const BASE_URL = "http://129.241.152.251:8000";

const animationSpeed = 0.1;

export default function DataMap() {
  const [settings, setSettings] = useState<Settings>({
    showBuildings: true,
  });
  const [data, setData] = useState<PostProcessedData[]>([]);
  const [startDate, setStartDate] = useState<Date>(
    new Date("2013-01-01T00:00:00.000Z")
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date("2021-01-01T00:00:00.000Z")
  );
  const [filter, setFilter] = useState<[number, number]>();
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationProgress, setAnimationProgress] = useState<number>(0);

  useEffect(() => {
    const requestURL = `${BASE_URL}/api/history?dateFrom=${formatDate(
      startDate
    )}&dateTo=${formatDate(endDate)}`;
    fetch(requestURL)
      .then((res) => res.json())
      .then((resJson) => setData(postProcess(resJson.data)));
  }, [startDate, endDate]);

  const timeRange = useMemo(() => getTimeRange(data), [data]);

  useEffect(() => {
    if (startDate && endDate) {
      setFilter([startDate.getTime(), startDate.getTime()]);
    }
  }, [startDate, endDate]);

  const filterValue = filter || timeRange;

  const animate = () => {
    setAnimationProgress((prev) => prev + 1 * animationSpeed);
    if (animationProgress >= 100) {
      setIsAnimating(false);
    }

    if (filterValue && endDate && filterValue[1] >= endDate.getTime()) {
      setIsAnimating(false);
    }

    if (filterValue) {
      const filterPlusOneMonth =
        filterValue[1] + 1000 * 60 * 60 * 24 * 30 * animationSpeed;
      setFilter([filterValue[0], filterPlusOneMonth]);
    }
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const resetAnimation = () => {
    setAnimationProgress(0);
    setIsAnimating(false);

    if (startDate && endDate)
      setFilter([startDate?.getTime(), startDate?.getTime()]);
  };

  if (isAnimating) {
    requestAnimationFrame(animate);
  }

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
        getTooltip={getTooltip}
      >
        <Map
          reuseMaps={true}
          styleDiffing={true}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          onRender={(event) => event.target.resize()}
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
        toggleAnimation={toggleAnimation}
        resetAnimation={resetAnimation}
        isAnimating={isAnimating}
        animationProgress={animationProgress}
      />
    </>
  );
}
