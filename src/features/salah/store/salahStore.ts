import { CalculationMethod, type CalculationParameters, Coordinates, Madhab, PrayerTimes } from "adhan";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Location {
  name: string;
  city?: string;
  country: string;
  lat: string;
  lng: string;
}

export interface Meta {
  latitude: number;
  longitude: number;
  timezone: string;
  method: {
    id: number;
    name: string;
    params: {
      Fajr: number;
      Isha: number;
    };
    location: {
      latitude: number;
      longitude: number;
    };
  };
  latitudeAdjustmentMethod: string;
  midnightMode: string;
  school: string;
  offset: {
    Imsak: number;
    Fajr: number;
    Sunrise: number;
    Dhuhr: number;
    Asr: number;
    Maghrib: number;
    Sunset: number;
    Isha: number;
    Midnight: number;
  };
}

interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  locationInput: string;
  cityName: string;
  latitude: string;
  longitude: string;
  meta: Meta | null;
  prayerTimes: PrayerTimes | null;
  madhab: "shafi" | "hanafi";
  playAdhan: boolean;
  setLocationInput: (input: string) => void;
  fetchLocation: () => Promise<void>;
  setSelectedLocation: (location: Location) => void;
  fetchMeta: () => Promise<void>;
  calculatePrayerTimes: () => void;
  setMadhab: (madhab: "shafi" | "hanafi") => void;
  setCoordinates: (latitude: string, longitude: string) => void;
  fetchCityName: (latitude: string, longitude: string) => void;
  toggleAdhan: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: [],
      selectedLocation: null,
      locationInput: "",
      latitude: "",
      longitude: "",
      cityName: "",
      meta: null,
      prayerTimes: null,
      madhab: "shafi",
      playAdhan: true,
      setLocationInput: (input) => set({ locationInput: input }),
      fetchLocation: async () => {
        const { locationInput } = get();
        try {
          const response = await fetch(
            `https://quran-location.remtl.workers.dev/api/location/${locationInput}`,
            {
              headers: {
                "X-Custom-Header": "your-random-value",
              },
            },
          );
          const data = await response.json();
          if (data.success) {
            set({
              selectedLocation: data.result[0],
              cityName: data.result[0].name,
              latitude: data.result[0].lat,
              longitude: data.result[0].lng,
            });
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      },
      setSelectedLocation: (location) => {
        console.log(location);
        set({
          selectedLocation: location,
          latitude: location.lat,
          longitude: location.lng,
        });
        get().fetchCityName(location.lat, location.lng);
        get().fetchMeta();
      },
      fetchMeta: async () => {
        const { latitude, longitude } = get();
        try {
          const response = await fetch(
            `https://api.aladhan.com/v1/calendar/2024/6?latitude=${latitude}&longitude=${longitude}`,
          );
          const data = await response.json();
          if (data.code === 200) {
            set({ meta: data.data[0].meta });
            get().calculatePrayerTimes();
          }
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      },
      calculatePrayerTimes: () => {
        const { meta, madhab } = get();
        if (!meta) return;

        const coordinates = new Coordinates(meta.latitude, meta.longitude);
        const params = getCalculationMethod(meta.method.name);
        params.fajrAngle = meta.method.params.Fajr;
        params.ishaAngle = meta.method.params.Isha;
        params.madhab = madhab === "shafi" ? Madhab.Shafi : Madhab.Hanafi;

        const prayerTimes = new PrayerTimes(coordinates, new Date(), params);
        set({ prayerTimes });

        get().fetchCityName(
          meta.latitude.toString(),
          meta.longitude.toString(),
        );
      },
      setMadhab: (madhab) => set({ madhab }),
      setCoordinates: (latitude, longitude) => {
        set({ latitude, longitude });
        get().fetchMeta();
      },
      fetchCityName: async (latitude: string, longitude: string) => {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const data = await response.json();
          if (data.city) {
            set({ cityName: data.city, locationInput: data.city });
          }
        } catch (error) {
          console.error("Error fetching city name:", error);
        }
      },
      toggleAdhan: () => set((state) => ({ playAdhan: !state.playAdhan })),
    }),
    {
      name: "location-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

const getCalculationMethod = (methodName: string): CalculationParameters => {
  switch (methodName) {
    case "Muslim World League":
      return CalculationMethod.MuslimWorldLeague();
    case "Egyptian General Authority of Survey":
      return CalculationMethod.Egyptian();
    case "University of Islamic Sciences, Karachi":
      return CalculationMethod.Karachi();
    case "Umm Al-Qura University, Makkah":
      return CalculationMethod.UmmAlQura();
    case "Dubai":
      return CalculationMethod.Dubai();
    case "Moonsighting Committee":
      return CalculationMethod.MoonsightingCommittee();
    case "ISNA":
      return CalculationMethod.NorthAmerica();
    case "Kuwait":
      return CalculationMethod.Kuwait();
    case "Qatar":
      return CalculationMethod.Qatar();
    case "Singapore":
      return CalculationMethod.Singapore();
    case "Institute of Geophysics, University of Tehran":
      return CalculationMethod.Tehran();
    case "Diyanet İşleri Başkanlığı, Turkey":
      return CalculationMethod.Turkey();
    default:
      return CalculationMethod.Other();
  }
};
