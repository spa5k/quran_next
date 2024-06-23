"use client";

import { Highlight } from "@/components/ui/hero-highlight";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocationStore } from "../store/salahStore";
import { SalahSettingsDialog } from "./SalahSettings";
import { SalahTimesDisplay } from "./SalahTimeDisplay";

dayjs.extend(utc);
dayjs.extend(timezone);

export function SalahDisplay() {
  const {
    meta,
    prayerTimes,
    cityName,
    setCoordinates,
    fetchCityName,
    calculatePrayerTimes,
  } = useLocationStore();

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
    } else {
      setLoading(false);
    }
  }, [meta, setCoordinates, fetchCityName, calculatePrayerTimes]);

  if (loading) {
    return (
      <main className="flex flex-col items-center h-full">
        <div className="text-center text-lg">Loading...</div>
      </main>
    );
  }

  if (!prayerTimes || !meta) {
    return (
      <main className="flex flex-col items-center h-full">
        <div className="text-center text-lg">Unable to fetch prayer times. Please update your location.</div>
        <SalahSettingsDialog />
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center h-full">
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto z-10 "
      >
        Pray on time, because life is just a{" "}
        <Highlight>
          collection of moments
        </Highlight>
        <br />
        <br />

        {`Today's Prayer Times for`} <Highlight>{cityName}</Highlight>
      </motion.h1>
      <div className="flex gap-4 flex-col justify-center mt-20">
        <SalahTimesDisplay meta={meta} prayerTimes={prayerTimes} />
        <SalahSettingsDialog />
      </div>
    </main>
  );
}
