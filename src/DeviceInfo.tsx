"use client";

import React, { useEffect, useState } from "react";

export function DeviceInfo() {
  // Wait for window to load
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [devicePixelRatio, setDevicePixelRatio] = useState(0);
  const [userAgent, setUserAgent] = useState("");

  useEffect(() => {
    setScreenWidth(window.screen.width);
    setScreenHeight(window.screen.height);
    setDevicePixelRatio(window.devicePixelRatio);
    setUserAgent(window.navigator.userAgent);
  }, []);

  return (
    <div className="text-sm text-red-500">
      <p>{`Screen Width: ${screenWidth}`}</p>
      <p>{`Screen Height: ${screenHeight}`}</p>
      <p>{`Device Pixel Ratio: ${devicePixelRatio}`}</p>
      <p>{`User Agent: ${userAgent}`}</p>
    </div>
  );
}
