"use client";

import { Spinner } from "@/components/icons/spinner";
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
  const [error, setError] = useState<string>();

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
            setError("Cannot get your location. Please add your location.");
            setLoading(false);
          },
        );
        return;
      }
      console.error("Geolocation is not supported by this browser.");
      setError("Cannot get your location. Please add your location.");
      setLoading(false);
    };

    if (!meta || !meta.latitude || !meta.longitude) {
      triggerGeolocation();
    } else {
      setLoading(false);
    }
  }, [meta, setCoordinates, fetchCityName, calculatePrayerTimes]);

  if (loading || (error && !prayerTimes)) {
    return (
      <main className="flex flex-col items-center h-full">
        <Spinner />
        <div className="text-center text-lg mt-4">{loading ? "Loading..." : error}</div>
      </main>
    );
  }

  if (!meta || !prayerTimes) {
    return (
      <main className="flex flex-col items-center h-full gap-4 justify-between">
        <div className="text-center text-lg text-red-500">{error}</div>
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
        {`Today's Prayer Times`} {cityName ? <Highlight>for {cityName}</Highlight> : null}
      </motion.h1>
      <div className="flex gap-4 flex-col justify-center mt-20">
        <SalahTimesDisplay meta={meta} prayerTimes={prayerTimes} />
      </div>
      <div className="mt-10">
        <SalahSettingsDialog />
      </div>
    </main>
  );
}
