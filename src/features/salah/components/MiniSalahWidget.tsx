"use client";

import { Button } from "@/components/ui/button";
import { useGeolocation } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocationStore } from "../store/salahStore";

dayjs.extend(utc);
dayjs.extend(timezone);

export const MiniSalahWidget = () => {
  const { prayerTimes, meta, setCoordinates, fetchCityName, calculatePrayerTimes } = useLocationStore();
  const [currentPrayer, setCurrentPrayer] = useState("");
  const [currentPrayerTime, setCurrentPrayerTime] = useState("");
  const [nextPrayerTime, setNextPrayerTime] = useState("");
  const [progress, setProgress] = useState(0);
  const [retry, setRetry] = useState(false);

  const {
    loading,
    latitude,
    longitude,
    error,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10_000,
    maximumAge: 0,
  });

  useEffect(() => {
    if (!loading && !error && latitude && longitude) {
      setCoordinates(latitude.toString(), longitude.toString());
      fetchCityName(latitude.toString(), longitude.toString());
      calculatePrayerTimes();
      setRetry(false);
      return;
    }
    if (error) {
      console.error("Error fetching location:", error);
      if (error.code === error.PERMISSION_DENIED) {
        setRetry(true);
      }
    }
  }, [loading, latitude, longitude, error, setCoordinates, fetchCityName, calculatePrayerTimes]);

  useEffect(() => {
    if (!(prayerTimes && meta)) {
      return;
    }
    const calculateCurrentPrayer = () => {
      const now = dayjs().tz(meta.timezone);
      const prayers = [
        { name: "Fajr", time: dayjs(prayerTimes.fajr).tz(meta.timezone) },
        { name: "Sunrise", time: dayjs(prayerTimes.sunrise).tz(meta.timezone) },
        { name: "Dhuhr", time: dayjs(prayerTimes.dhuhr).tz(meta.timezone) },
        { name: "Asr", time: dayjs(prayerTimes.asr).tz(meta.timezone) },
        { name: "Maghrib", time: dayjs(prayerTimes.maghrib).tz(meta.timezone) },
        { name: "Isha", time: dayjs(prayerTimes.isha).tz(meta.timezone) },
      ];

      for (let i = prayers.length - 1; i >= 0; i--) {
        if (now.isAfter(prayers[i].time)) {
          setCurrentPrayer(prayers[i].name);
          setCurrentPrayerTime(prayers[i].time.format("h:mm A"));
          const nextPrayer = prayers[(i + 1) % prayers.length];
          setNextPrayerTime(nextPrayer.time.format("h:mm A"));

          const totalDuration = nextPrayer.time.diff(prayers[i].time);
          const elapsedDuration = now.diff(prayers[i].time);
          const progressPercentage = (elapsedDuration / totalDuration) * 100;
          setProgress(progressPercentage);

          break;
        }
      }
    };

    calculateCurrentPrayer();
    const interval = setInterval(calculateCurrentPrayer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayerTimes, meta]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (retry) {
    return (
      <div className="flex items-center justify-center">
        <Button
          onClick={() => setRetry(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Retry for location
        </Button>
      </div>
    );
  }

  return (
    <Link href={"/salah"} prefetch={false}>
      <div className="flex items-center justify-center w-1/2">
        <div className="relative w-full bg-gray-200 rounded-md overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-200 to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
          </motion.div>
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-200 to-green-400 opacity-50"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ repeat: Infinity, duration: 5, ease: "anticipate" }}
            // style={{ width: "200%" }}
          >
          </motion.div>
          <div className="relative z-10 text-center flex items-center justify-between p-2">
            <div className="flex text-center items-center gap-4">
              <p className="text-xl font-bold">{currentPrayer}</p>
              {currentPrayerTime}
            </div>
            <div className="text-md">{nextPrayerTime}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};
