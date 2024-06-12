"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

export const DynamicFontSizer: React.FC = () => {
  // Define step size for font changes and default font size
  const step = 2;
  const defaultFont = 28; // A good default size for readability [2]
  const minFont = 12;
  const maxFont = 40;

  // Initialize font size from local storage or use default
  const [fontSize, setFontSize] = useState<number>(() => {
    const storedFontSize = localStorage.getItem("ayahFontSize");
    return storedFontSize ? parseInt(storedFontSize, 10) : defaultFont;
  });

  // Update local storage whenever the font size changes
  useEffect(() => {
    localStorage.setItem("ayahFontSize", fontSize.toString());
  }, [fontSize]);

  // Increase font size within limits
  const increaseFontSize = () => {
    if (fontSize < maxFont) {
      setFontSize(fontSize + step);
    }
  };

  // Decrease font size within limits
  const decreaseFontSize = () => {
    if (fontSize > minFont) {
      setFontSize(fontSize - step);
    }
  };

  // Reset font size to default
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
      <style>
        {`:root { --ayah-font-size: ${fontSize}px; }`}
      </style>
    </>
  );
};
