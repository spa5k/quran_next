"use client";

import { Button } from "@/components/ui/button";
import { useGeolocation } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocationStore } from "../store/salahStore";

dayjs.extend(utc);
dayjs.extend(timezone);

export const MiniSalahWidget = () => {
  const {
    prayerTimes,
    meta,
    setCoordinates,
    calculatePrayerTimes,
    playAdhan,
    latitude: currentLatitude,
    rehydrated,
    sunnahTimes,
  } = useLocationStore();
  const [currentPrayer, setCurrentPrayer] = useState("");
  const [currentPrayerTime, setCurrentPrayerTime] = useState("");
  const [nextPrayerTime, setNextPrayerTime] = useState("");
  const [progress, setProgress] = useState(0);
  const [retry, setRetry] = useState(false);
  const adhanAudioRef = useRef<HTMLAudioElement>(null);

  const path = usePathname();

  const {
    loading,
    latitude,
    longitude,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10_000,
    maximumAge: 0,
  });

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

      if (sunnahTimes) {
        prayers.push(
          { name: "Last Third of the Night", time: dayjs(sunnahTimes.lastThirdOfTheNight).tz(meta.timezone) },
          { name: "Midnight", time: dayjs(sunnahTimes.middleOfTheNight).tz(meta.timezone) },
        );
      }

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

          // Play Adhan and show notification if enabled and not already played
          if (
            playAdhan && adhanAudioRef.current && !isAdhanPlayed(prayers[i].name)
            && now.isSame(prayers[i].time, "minute")
          ) {
            adhanAudioRef.current.play();
            showNotification(nextPrayer.name); // Show notification
            markAdhanAsPlayed(nextPrayer.name); // Mark Adhan as played
          }

          break;
        }
      }
    };

    calculateCurrentPrayer();
    const interval = setInterval(calculateCurrentPrayer, 60_000); // Update every minute

    return () => clearInterval(interval);
  }, [prayerTimes, meta, playAdhan, sunnahTimes]);

  const showNotification = (prayerName: string) => {
    if (Notification.permission === "granted") {
      new Notification("Prayer Time", {
        body: `It's time for ${prayerName} prayer.`,
        icon: "/aqsa.jpg", // Replace with your icon path
      });
    }
  };

  const isAdhanPlayed = (prayerName: string) => {
    const playedPrayers = JSON.parse(localStorage.getItem("playedPrayers") || "[]");
    return playedPrayers.includes(prayerName);
  };

  const markAdhanAsPlayed = (prayerName: string) => {
    const playedPrayers = JSON.parse(localStorage.getItem("playedPrayers") || "[]");
    playedPrayers.push(prayerName);
    localStorage.setItem("playedPrayers", JSON.stringify(playedPrayers));
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!(adhanAudioRef.current && navigator.mediaSession)) {
      return;
    }
    navigator.mediaSession.setActionHandler("play", () => {
      adhanAudioRef.current?.play();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      adhanAudioRef.current?.pause();
    });

    adhanAudioRef.current.addEventListener("play", () => {
      navigator.mediaSession.playbackState = "playing";
    });

    adhanAudioRef.current.addEventListener("pause", () => {
      navigator.mediaSession.playbackState = "paused";
    });
  }, [adhanAudioRef]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // if location permission is granted, and the state is rehydrated, and the latitude/longitude from state is null, then fetch the geocoordinates
      if (!loading && latitude && longitude && rehydrated && !currentLatitude) {
        setCoordinates(latitude.toString(), longitude.toString());
        calculatePrayerTimes();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading, latitude, longitude, rehydrated, currentLatitude]);

  const getNextPrayer = () => {
    if (!prayerTimes || !meta) {
      return "";
    }

    const now = dayjs().tz(meta.timezone);
    const prayers = [
      { name: "Fajr", time: dayjs(prayerTimes.fajr).tz(meta.timezone) },
      { name: "Sunrise", time: dayjs(prayerTimes.sunrise).tz(meta.timezone) },
      { name: "Dhuhr", time: dayjs(prayerTimes.dhuhr).tz(meta.timezone) },
      { name: "Asr", time: dayjs(prayerTimes.asr).tz(meta.timezone) },
      { name: "Maghrib", time: dayjs(prayerTimes.maghrib).tz(meta.timezone) },
      { name: "Isha", time: dayjs(prayerTimes.isha).tz(meta.timezone) },
    ];

    if (sunnahTimes) {
      prayers.push(
        { name: "Last Third of the Night", time: dayjs(sunnahTimes.lastThirdOfTheNight).tz(meta.timezone) },
        { name: "Midnight", time: dayjs(sunnahTimes.middleOfTheNight).tz(meta.timezone) },
      );
    }

    for (let i = 0; i < prayers.length; i++) {
      if (now.isBefore(prayers[i].time)) {
        return prayers[i].name;
      }
    }

    return prayers[0].name; // Return the first prayer if all have passed
  };

  if (loading && !latitude && !longitude) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (retry && path != "/salah") {
    return (
      <div className="flex items-center justify-center">
        <Button
          onClick={() => setRetry(false)}
          className="px-4 py-2"
        >
          Add location
        </Button>
      </div>
    );
  }

  if (!prayerTimes && (!longitude || !latitude)) {
    return (
      <div className="flex items-center justify-center">
        {path == "/salah" || (
          <Link href={"/salah"} prefetch={false}>
            <Button className="px-4 py- rounded-md">Add location</Button>
          </Link>
        )}
      </div>
    );
  }

  const nextPrayer = getNextPrayer();

  return (
    <Link href={"/salah"} prefetch={false}>
      <div className="flex items-center justify-center w-full ">
        <div className="relative w-full bg-gray-200 rounded-md overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-green-400 opacity-50"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ repeat: Infinity, duration: 5, ease: "anticipate" }}
          />
          <div className="relative z-10 text-center flex items-center justify-between p-2">
            <div className="flex text-center items-center gap-4">
              <p className="text-sm font-bold sm:text-xl ">
                {currentPrayer.charAt(0).toUpperCase() + currentPrayer.slice(1)}
              </p>
              <p className="hidden sm:flex">{currentPrayerTime}</p>
            </div>
            <div className="flex text-center items-center gap-4">
              <p className="text-sm font-bold sm:text-xl">{nextPrayer.charAt(0).toUpperCase() + nextPrayer.slice(1)}</p>
              <p className="hidden sm:flex">{nextPrayerTime}</p>
            </div>
          </div>
        </div>
      </div>
      <audio ref={adhanAudioRef} src="/adhan1.mp3" />
    </Link>
  );
};
