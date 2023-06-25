'use client';

import React, {useRef, useEffect} from "react";
import {Runtime, Inspector} from "@observablehq/runtime";
import notebook from "8ac0e5bc768dca73";

function Notebook() {
  const viewofNumberRef = useRef();
  const viewofCurrentStateRef = useRef();
  const miniPlotsRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, name => {
      if (name === "viewof number") return new Inspector(viewofNumberRef.current);
      if (name === "viewof currentState") return new Inspector(viewofCurrentStateRef.current);
      if (name === "miniPlots") return new Inspector(miniPlotsRef.current);
      return ["lineChart","barChart","covidData","dailyNumbers","columnChart","trendChart","lastTwelveMonths","totals","stateNumbers","months","tidyAll","mapData","ticks","cells","extent","xRules","colors","miniPlotColor"].includes(name);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={viewofNumberRef} />
      <div ref={viewofCurrentStateRef} />
      <div ref={miniPlotsRef} />
    </>
  );
}

export default Notebook;