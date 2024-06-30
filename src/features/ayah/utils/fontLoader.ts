// fontUtils.js
export const loadFont = (page: string, type = "v1") => {
  let fontName, fontUrlWoff2, fontUrlWoff, fontUrlTtf;

  if (type === "v1") {
    fontName = `Mushaf Page ${page}`;
    fontUrlWoff2 =
      `https://rawcdn.githack.com/mustafa0x/qpc-fonts/9cf744bc9395e91ed6ff44cfc528a828193c787a/mushaf-woff2/QCF_P${
        page.padStart(
          3,
          "0",
        )
      }.woff2`;
    fontUrlWoff =
      `https://rawcdn.githack.com/mustafa0x/qpc-fonts/9cf744bc9395e91ed6ff44cfc528a828193c787a/mushaf-woff/QCF_P${
        page.padStart(
          3,
          "0",
        )
      }.woff`;
  } else if (type === "v2") {
    fontName = `Mushaf2 Page ${page}`;
    fontUrlTtf =
      `https://rawcdn.githack.com/mustafa0x/qpc-fonts/9cf744bc9395e91ed6ff44cfc528a828193c787a/mushaf-v2/QCF2${
        page.padStart(
          3,
          "0",
        )
      }.ttf`;
  }

  const fontFace = `
    @font-face {
      font-family: "${fontName}";
      src:  ${fontUrlWoff2 ? `url(${fontUrlWoff2}) format("woff2"),` : ""}
            ${fontUrlWoff ? `url(${fontUrlWoff}) format("woff"),` : ""}
            ${fontUrlTtf ? `url(${fontUrlTtf}) format("truetype")` : ""};
    }
  `;

  console.log(fontFace);

  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(fontFace, styleSheet.cssRules.length);
};
