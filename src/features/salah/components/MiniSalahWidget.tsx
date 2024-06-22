"use client";

import { Button } from "@/components/ui/button";
import { useGeolocation } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocationStore } from "../store/salahStore";

dayjs.extend(utc);
dayjs.extend(timezone);

export const MiniSalahWidget = () => {
  const { prayerTimes, meta, setCoordinates, fetchCityName, calculatePrayerTimes } = useLocationStore();
  const [currentPrayer, setCurrentPrayer] = useState("");
  const [currentPrayerTime, setCurrentPrayerTime] = useState("");
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
      <div className="flex items-center justify-center">
        <div className="text-center flex items-center gap-4">
          <div className="text-xl font-bold">{currentPrayer}</div> started at
          <div className="text-md">{currentPrayerTime}</div>
        </div>
      </div>
    </Link>
  );
};
