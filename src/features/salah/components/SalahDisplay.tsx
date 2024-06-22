"use client";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
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
  } = useLocationStore();

  const formatTime = (time: Date | undefined) => {
    return time ? dayjs(time).tz(meta?.timezone).format("h:mm A") : "";
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Today Prayer Times for {cityName}</h1>
          <SalahSettingsDialog />
        </div>

        <SalahTimesDisplay meta={meta} prayerTimes={prayerTimes} />
      </div>
    </main>
  );
}
