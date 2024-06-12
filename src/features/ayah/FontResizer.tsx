"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

export const DynamicFontSizer: React.FC = () => {
  const step = 2;
  const defaultFont = 28;
  const minFont = 12;
  const maxFont = 40;

  // Initialize font size state without a default value
  const [fontSize, setFontSize] = useState<number>(defaultFont);

  // Effect for initializing font size from local storage on client side
  useEffect(() => {
    const storedFontSize = localStorage.getItem("ayahFontSize");
    if (storedFontSize) {
      setFontSize(parseInt(storedFontSize, 10));
    }
  }, []);

  // Update local storage whenever the font size changes
  useEffect(() => {
    localStorage.setItem("ayahFontSize", fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    if (fontSize < maxFont) {
      setFontSize(fontSize + step);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > minFont) {
      setFontSize(fontSize - step);
    }
  };

  const resetFontSize = () => {
    setFontSize(defaultFont);
  };

  return (
    <>
      <div>
        <Button onClick={decreaseFontSize} disabled={fontSize <= minFont}>-</Button>
        <span style={{ margin: "0 10px" }}>{fontSize}px</span>
        <Button onClick={increaseFontSize} disabled={fontSize >= maxFont}>+</Button>
        <Button onClick={resetFontSize}>Reset</Button>
      </div>
      <style jsx>
        {`
          :root { --ayah-font-size: ${fontSize}px; }
        `}
      </style>
    </>
  );
};
