"use client";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const triggerGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates(latitude.toString(), longitude.toString());
            fetchCityName(latitude.toString(), longitude.toString());
            calculatePrayerTimes();
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching location:", error);
            setLoading(false);
          },
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    if (!meta || !meta.latitude || !meta.longitude) {
      triggerGeolocation();
    } else if (prayerTimes && meta) {
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
      setLoading(false);

      calculateCurrentPrayer();
      const interval = setInterval(calculateCurrentPrayer, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [prayerTimes, meta, setCoordinates, fetchCityName, calculatePrayerTimes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <Link href={"/salah"} prefetch={false}>
      <div className="flex items-center justify-center">
        <div className="text-center flex items-center gap-4">
          <div className="text-xl font-bold">{currentPrayer}</div>
          <div className="text-md">{currentPrayerTime}</div>
        </div>
      </div>
    </Link>
  );
};
