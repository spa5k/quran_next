"use client";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { useLocationStore } from "../store/salahStore";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export const NextPrayer = () => {
  const { prayerTimes, meta } = useLocationStore();
  const [nextPrayer, setNextPrayer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [nextPrayerTime, setNextPrayerTime] = useState("");
  const [currentPrayer, setCurrentPrayer] = useState("");

  useEffect(() => {
    if (prayerTimes && meta) {
      const calculateNextPrayer = () => {
        const now = dayjs().tz(meta.timezone);
        const prayers = [
          { name: "Fajr", time: dayjs(prayerTimes.fajr).tz(meta.timezone) },
          { name: "Sunrise", time: dayjs(prayerTimes.sunrise).tz(meta.timezone) },
          { name: "Dhuhr", time: dayjs(prayerTimes.dhuhr).tz(meta.timezone) },
          { name: "Asr", time: dayjs(prayerTimes.asr).tz(meta.timezone) },
          { name: "Maghrib", time: dayjs(prayerTimes.maghrib).tz(meta.timezone) },
          { name: "Isha", time: dayjs(prayerTimes.isha).tz(meta.timezone) },
        ];

        let foundNextPrayer = false;

        for (let i = 0; i < prayers.length; i++) {
          if (now.isBefore(prayers[i].time)) {
            setNextPrayer(prayers[i].name);
            setNextPrayerTime(prayers[i].time.format("h:mm A"));
            const diff = prayers[i].time.diff(now);
            const duration = dayjs.duration(diff);
            const hours = duration.hours();
            const minutes = duration.minutes();
            setTimeRemaining(`${hours}hr ${minutes}mins`);
            foundNextPrayer = true;
            break;
          }
        }

        if (!foundNextPrayer) {
          setNextPrayer("Fajr");
          const nextFajrTime = dayjs(prayerTimes.fajr).tz(meta.timezone).add(1, "day");
          setNextPrayerTime(nextFajrTime.format("h:mm A"));
          const diff = nextFajrTime.diff(now);
          const duration = dayjs.duration(diff);
          const hours = duration.hours();
          const minutes = duration.minutes();
          setTimeRemaining(`${hours}hr ${minutes}mins`);
        }

        for (let i = prayers.length - 1; i >= 0; i--) {
          if (now.isAfter(prayers[i].time)) {
            setCurrentPrayer(prayers[i].name);
            break;
          }
        }
      };

      calculateNextPrayer();
      const interval = setInterval(calculateNextPrayer, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [prayerTimes, meta]);

  return (
    <div className="h-[200px] w-full transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_60%)] sm:left-40 p-5">
      <div>
        Current prayer: <span className="text-2xl font-semibold">{currentPrayer}</span>
      </div>
      <div>
        Next prayer in <span className="text-2xl font-semibold">{timeRemaining}</span> ({nextPrayer} at{" "}
        {nextPrayerTime})
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">Fajr</span>
          <span className="text-lg">{dayjs(prayerTimes?.fajr).tz(meta?.timezone).format("h:mm A")}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">Sunrise</span>
          <span className="text-lg">{dayjs(prayerTimes?.sunrise).tz(meta?.timezone).format("h:mm A")}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">Dhuhr</span>
          <span className="text-lg">{dayjs(prayerTimes?.dhuhr).tz(meta?.timezone).format("h:mm A")}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">Asr</span>
          <span className="text-lg">{dayjs(prayerTimes?.asr).tz(meta?.timezone).format("h:mm A")}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">Maghrib</span>
          <span className="text-lg">{dayjs(prayerTimes?.maghrib).tz(meta?.timezone).format("h:mm A")}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">Isha</span>
          <span className="text-lg">{dayjs(prayerTimes?.isha).tz(meta?.timezone).format("h:mm A")}</span>
        </div>
      </div>
    </div>
  );
};
