import { AsrEmoji, DhuhrEmoji, FajrEmoji, IshaEmoji, MaghribEmoji, SunriseEmoji } from "@/components/icons/salahIcons";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      <Card className="bg-secondary p-4 rounded-lg relative h-[250px] w-[200px]">
        <BorderBeam delay={1} colorFrom="#abecd6" colorTo="#fbed96" borderWidth={2} />
        <CardHeader className="mb-2 gap-2 justify-between items-center text-center">
          <p className="text-3xl font-bold">Fajr</p> <SunriseEmoji className="size-16" />
        </CardHeader>
        <CardContent className="text-2xl font-bold text-center">
          {formatTime(prayerTimes?.fajr)}
        </CardContent>
      </Card>
      <Card className="bg-secondary p-4 rounded-lg relative h-[250px] w-[200px]">
        <BorderBeam delay={4} colorFrom="#ffe259" colorTo="#ffa751" borderWidth={2} />
        <CardHeader className="text-lg font-bold  mb-2  gap-2 justify-between items-center">
          <p className="text-3xl font-bold">Sunrise</p> <FajrEmoji className="size-16" />
        </CardHeader>
        <CardContent className="text-2xl font-bold text-center">{formatTime(prayerTimes?.sunrise)}</CardContent>
      </Card>
      <Card className="bg-secondary p-4 rounded-lg relative h-[250px] w-[200px]">
        <BorderBeam delay={6} colorFrom="#fceabb" colorTo="#f8b500" borderWidth={2} />
        <CardHeader className="text-lg font-bold  mb-2  gap-2 justify-between items-center">
          <p className="text-3xl font-bold">Dhuhr</p> <DhuhrEmoji className="size-16" />
        </CardHeader>
        <CardContent className="text-2xl font-bold text-center">{formatTime(prayerTimes?.dhuhr)}</CardContent>
      </Card>
      <Card className="bg-secondary p-4 rounded-lg relative h-[250px] w-[200px]">
        <BorderBeam delay={8} colorFrom="#9be15d" colorTo="#00e3ae" borderWidth={2} />
        <CardHeader className="text-lg font-bold  mb-2  gap-2 justify-between items-center">
          <p className="text-3xl font-bold">Asr</p> <AsrEmoji className="size-16" />
        </CardHeader>
        <CardContent className="text-2xl font-bold text-center">{formatTime(prayerTimes?.asr)}</CardContent>
      </Card>
      <Card className="bg-secondary p-4 rounded-lg relative h-[250px] w-[200px]">
        <BorderBeam delay={10} colorFrom="#ff5858" colorTo="#f09819" borderWidth={2} />
        <CardHeader className="text-lg font-bold  mb-2  gap-2 justify-between items-center">
          <p className="text-3xl font-bold">Maghrib</p> <MaghribEmoji className="size-16" />
        </CardHeader>
        <CardContent className="text-2xl font-bold text-center">{formatTime(prayerTimes?.maghrib)}</CardContent>
      </Card>
      <Card className="bg-secondary p-4 rounded-lg relative h-[250px] w-[200px]">
        <BorderBeam delay={12} borderWidth={2} />
        <CardHeader className="text-lg font-bold  mb-2  gap-2 justify-between items-center">
          <p className="text-3xl font-bold">Isha</p> <IshaEmoji className="size-16" />
        </CardHeader>
        <CardContent className="text-2xl font-bold text-center">{formatTime(prayerTimes?.isha)}</CardContent>
      </Card>
    </div>
  );
};
