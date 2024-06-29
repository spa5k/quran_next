// fontUtils.js
export const loadFont = (page: string, type = "mushaf") => {
  let fontName, fontUrlWoff2, fontUrlWoff;

  if (type === "mushaf") {
    fontName = `Mushaf Page ${page}`;
    fontUrlWoff2 = `https://raw.githubusercontent.com/mustafa0x/qpc-fonts/f93bf5f3/mushaf-woff2/QCF_P${page.padStart(
      3,
      "0"
    )}.woff2`;
    fontUrlWoff = `https://raw.githubusercontent.com/mustafa0x/qpc-fonts/f93bf5f3/mushaf-woff/QCF_P${page.padStart(
      3,
      "0"
    )}.woff`;
  } else if (type === "mushaf2") {
    fontName = `Mushaf2 Page ${page}`;
    fontUrlWoff2 = `https://raw.githubusercontent.com/mustafa0x/qpc-fonts/master/mushaf-v2/QCF2${page.padStart(
      3,
      "0"
    )}.woff2`;
    fontUrlWoff = `https://raw.githubusercontent.com/mustafa0x/qpc-fonts/master/mushaf-v2/QCF2${page.padStart(
      3,
      "0"
    )}.woff`;
  }

  const fontFace = `
    @font-face {
      font-family: "${fontName}";
      src:  url(${fontUrlWoff2}) format("woff2"),
            url(${fontUrlWoff}) format("woff");
    }
  `;

  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(fontFace, styleSheet.cssRules.length);
};
