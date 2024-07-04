import { Howl } from "howler";

let currentHowl: Howl | null = null;

export const getHowlInstance = (src: string): Howl => {
  if (currentHowl) {
    currentHowl.stop();
  }

  currentHowl = new Howl({
    src: [src],
    onend: () => {
      currentHowl = null;
    },
  });

  return currentHowl;
};

export const stopCurrentHowl = () => {
  if (currentHowl) {
    currentHowl.stop();
    currentHowl = null;
  }
};
