// import { useQuery } from "@tanstack/react-query";
// import { Howl } from "howler";
// import { useEffect } from "react";
// import { reciters } from "../recitation/data/reciters";
// import { useRecitationStore } from "../recitation/store/recitationStore";
// import type { Timings } from "../recitation/types/timingTypes";
// import { getHowlInstance } from "../recitation/utils/howl";

// let currentPlayingInstance: Howl | null = null;

// export const fetchTimings = async (reciterSlug: string, surah: number, style: string) => {
//   const response = await fetch(
//     `https://raw.githubusercontent.com/spa5k/quran_timings_api/master/data/${style}/${reciterSlug}/${surah}.json`,
//   );
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   return response.json() as Promise<Timings>;
// };

// const AyahPlayer = () => {
//   const {
//     currentReciter,
//     currentSurah,
//     currentAyah,
//     isPlaying,
//     setIsPlaying,
//     setCurrentTime,
//   } = useRecitationStore();

//   const reciter = reciters.find((reciter) => reciter.slug === currentReciter);

//   const { data: timings, error } = useQuery({
//     queryKey: ["timings", currentReciter, currentSurah, reciter?.slug],
//     queryFn: () => fetchTimings(reciter!.slug, currentSurah!, reciter!.style),
//     enabled: !!currentReciter && !!currentSurah,
//   });

//   useEffect(() => {
//     if (!(isPlaying && timings)) {
//       return;
//     }
//     const audioUrl = timings.audio_files[0].audio_url;
//     const verseTiming = timings.audio_files[0].verse_timings.find(
//       (timing) => timing.verse_key === `${currentSurah}:${currentAyah}`,
//     );
//     if (!verseTiming) {
//       return;
//     }
//     if (currentPlayingInstance) {
//       currentPlayingInstance.stop();
//     }
//     currentPlayingInstance = getHowlInstance(audioUrl);
//     currentPlayingInstance.seek(verseTiming.timestamp_from / 1000);
//     currentPlayingInstance.play();
//   }, [isPlaying, timings, currentAyah, currentSurah]);

//   useEffect(() => {
//     if (!currentPlayingInstance) {
//       return;
//     }
//     const interval = setInterval(() => {
//       if (currentPlayingInstance!.playing()) {
//         setCurrentTime(currentPlayingInstance!.seek() as number);
//       }
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   if (error) {
//     console.error("Error fetching timings:", error);
//   }

//   return null;
// };

// export default AyahPlayer;
