const addedFonts = new Set();

export const loadFont = async (page: string, type = "v1") => {
  let fontName;
  let fontUrl;

  if (type === "v1") {
    fontName = `Mushaf Page ${page}`;
    fontUrl =
      `https://rawcdn.githack.com/mustafa0x/qpc-fonts/9cf744bc9395e91ed6ff44cfc528a828193c787a/mushaf-woff2/QCF_P${
        page.padStart(
          3,
          "0",
        )
      }.woff2`;
  } else if (type === "v2") {
    fontName = `Mushaf2 Page ${page}`;
    fontUrl = `https://rawcdn.githack.com/mustafa0x/qpc-fonts/9cf744bc9395e91ed6ff44cfc528a828193c787a/mushaf-v2/QCF2${
      page.padStart(
        3,
        "0",
      )
    }.ttf`;
  }

  if (addedFonts.has(fontName)) {
    return;
  }

  try {
    const fontFace = new FontFace(fontName!, `url(${fontUrl})`);
    await fontFace.load();
    document.fonts.add(fontFace);
    addedFonts.add(fontName);
  } catch (error) {
    console.error(`Failed to load font ${fontName}:`, error);
  }
};
