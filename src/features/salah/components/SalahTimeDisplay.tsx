import type { PrayerTimes } from "adhan";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { Meta } from "../store/salahStore";

dayjs.extend(utc);
dayjs.extend(timezone);

export const SalahTimesDisplay = ({ meta, prayerTimes }: {
  prayerTimes: PrayerTimes | null;
  meta: Meta | null;
}) => {
  const formatTime = (time: Date | undefined) => {
    return time ? dayjs(time).tz(meta?.timezone).format("h:mm A") : "";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Fajr</h2>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {formatTime(prayerTimes?.fajr)}
        </p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Dhuhr</h2>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{formatTime(prayerTimes?.dhuhr)}</p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Asr</h2>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{formatTime(prayerTimes?.asr)}</p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Maghrib</h2>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{formatTime(prayerTimes?.maghrib)}</p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Isha</h2>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{formatTime(prayerTimes?.isha)}</p>
      </div>
    </div>
  );
};